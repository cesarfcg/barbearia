import { useState } from "react";
import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, mensagemDeErro } from "../api/client";
import { useAuth } from "../AuthContext";
import { Carregando } from "../components/Carregando";
import { ConfirmarAcao } from "../components/ConfirmarAcao";
import { Erro } from "../components/Erro";
import { Estrelas } from "../components/Estrelas";
import { StatusHorario } from "../components/StatusHorario";
import { formatarData, formatarHora } from "../formatos";
import { useApi } from "../hooks/useApi";

export function Horario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pode } = useAuth();
  const { dados: horario, erro, carregando, recarregar } = useApi(`/agendamentos/${id}/`);
  const [erroAcao, setErroAcao] = useState(null);
  const [acao, setAcao] = useState(null);

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />;
  if (carregando) return <Carregando />;

  const ativo = ["solicitado", "confirmado"].includes(horario.status);
  const duracao = (new Date(horario.fim) - new Date(horario.inicio)) / 60000;

  async function executar(acao) {
    setErroAcao(null);
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: "POST" });
      recarregar();
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro));
    }
  }

  function confirmarAcao() {
    executar(acao);
    setAcao(null);
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{horario.servico_nome}</h4>
        <StatusHorario status={horario.status} />
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Barbeiro:</strong> {horario.recurso_nome}
        </ListGroup.Item>
        {pode("api.view_agendamento") && (
          <ListGroup.Item>
            <strong>Cliente:</strong> {horario.cliente_nome}
          </ListGroup.Item>
        )}
        <ListGroup.Item>
          <strong>Dia:</strong> {formatarData(horario.inicio)}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Horário:</strong> {formatarHora(horario.inicio)} às {formatarHora(horario.fim)} ({duracao} min)
        </ListGroup.Item>
        {horario.observacoes && (
          <ListGroup.Item>
            <strong>Observações:</strong> {horario.observacoes}
          </ListGroup.Item>
        )}
        {horario.nota && (
          <ListGroup.Item>
            <strong>Avaliação:</strong> <Estrelas nota={horario.nota} />
            {horario.comentario && <p className="mb-0 mt-1">{horario.comentario}</p>}
          </ListGroup.Item>
        )}
      </ListGroup>
      <Card.Body>
        {erroAcao && <Alert variant="danger">{erroAcao}</Alert>}
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          {pode("api.avaliar_agendamento") && horario.status === "concluido" && !horario.nota && (
            <Button as={Link} to={`/horarios/${id}/avaliar`}>
              <i className="bi bi-star"></i> Avaliar
            </Button>
          )}
          {pode("api.confirmar_agendamento") && horario.status === "solicitado" && (
            <Button variant="success" onClick={() => setAcao("confirmar")}>
              <i className="bi bi-check-lg"></i> Confirmar
            </Button>
          )}
          {pode("api.concluir_agendamento") && horario.status === "confirmado" && (
            <Button variant="success" onClick={() => setAcao("concluir")}>
              <i className="bi bi-check2-all"></i> Concluir
            </Button>
          )}
          {pode("api.cancelar_agendamento") && ativo && (
            <Button variant="outline-danger" className="ms-auto" onClick={() => setAcao("cancelar")}>
              Cancelar
            </Button>
          )}
        </div>
      </Card.Body>
      <ConfirmarAcao acao={acao} onConfirmar={confirmarAcao} onFechar={() => setAcao(null)} />
    </Card>
  );
}

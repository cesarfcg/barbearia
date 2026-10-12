import { Alert, Button, Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import { useState } from "react";
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
    <Card variant="outlined">
      <CardHeader
        className="d-flex justify-content-between align-items-center"
        title={<h4 className="mb-0">{horario.servico_nome}</h4>}
        action={<StatusHorario status={horario.status} />}
      />
      <List disablePadding>
        <ListItem>
          <strong>Barbeiro:</strong> {horario.recurso_nome}
        </ListItem>
        {pode("api.view_agendamento") && (
          <ListItem>
            <strong>Cliente:</strong> {horario.cliente_nome}
          </ListItem>
        )}
        <ListItem>
          <strong>Dia:</strong> {formatarData(horario.inicio)}
        </ListItem>
        <ListItem>
          <strong>Horário:</strong> {formatarHora(horario.inicio)} às {formatarHora(horario.fim)} ({duracao} min)
        </ListItem>
        {horario.observacoes && (
          <ListItem>
            <strong>Observações:</strong> {horario.observacoes}
          </ListItem>
        )}
        {horario.nota && (
          <ListItem>
            <strong>Avaliação:</strong> <Estrelas nota={horario.nota} />
            {horario.comentario && <p className="mb-0 mt-1">{horario.comentario}</p>}
          </ListItem>
        )}
      </List>
      <CardContent>
        {erroAcao && <Alert severity="error">{erroAcao}</Alert>}
        <div className="d-flex gap-2">
          <Button type="button" variant="outlined" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          {pode("api.avaliar_agendamento") && horario.status === "concluido" && !horario.nota && (
            <Button component={Link} to={`/horarios/${id}/avaliar`} type="button" variant="contained">
              <i className="bi bi-star"></i> Avaliar
            </Button>
          )}
          {pode("api.confirmar_agendamento") && horario.status === "solicitado" && (
            <Button type="button" variant="contained" onClick={() => setAcao("confirmar")}>
              Confirmar
            </Button>
          )}
          {pode("api.concluir_agendamento") && horario.status === "confirmado" && (
            <Button type="button" variant="contained" onClick={() => setAcao("concluir")}>
              Concluir
            </Button>
          )}
          {pode("api.cancelar_agendamento") && ativo && (
            <Button
              type="button"
              variant="outlined"
              color="error"
              className="ms-auto"
              onClick={() => setAcao("cancelar")}>
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
      <ConfirmarAcao acao={acao} onConfirmar={confirmarAcao} onFechar={() => setAcao(null)} />
    </Card>
  );
}

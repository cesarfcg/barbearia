import { useState } from "react";
import { Alert, Button, List, ListItem, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import { api, mensagemDeErro } from "../../api/client";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { ConfirmarAcao } from "../../components/ConfirmarAcao";
import { Erro } from "../../components/Erro";
import { formatarData, formatarHora } from "../../formatos";
import { usePaginado } from "../../hooks/useApi";

export function AConfirmar() {
  const pedidos = usePaginado("/agendamentos/?status=solicitado");
  const [pendente, setPendente] = useState(null);
  const [erroAcao, setErroAcao] = useState(null);

  async function executar(id, acao) {
    setErroAcao(null);
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: "POST" });
      pedidos.recarregar();
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro));
    }
  }

  function confirmarAcao() {
    executar(pendente.id, pendente.acao);
    setPendente(null);
  }

  if (pedidos.erro) return <Erro erro={pedidos.erro} tentarDeNovo={pedidos.recarregar} />;

  return (
    <>
      <h2 className="mb-4">A confirmar</h2>
      {erroAcao && <Alert severity="error">{erroAcao}</Alert>}
      {!pedidos.carregando && pedidos.itens.length === 0 && (
        <Alert severity="success">Nenhum pedido para confirmar.</Alert>
      )}
      <List disablePadding>
        {pedidos.itens.map((horario) => (
          <ListItem key={horario.id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/horarios/${horario.id}`}
              sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
              <div className="text-center">
                <div className="fw-bold">{formatarHora(horario.inicio)}</div>
                <small className="text-secondary">{formatarData(horario.inicio)}</small>
              </div>
              <div className="me-auto">
                <span className="fw-semibold">{horario.servico_nome}</span>
                <div>
                  <small className="text-secondary">
                    {horario.recurso_nome} · {horario.cliente_nome}
                  </small>
                </div>
                {horario.observacoes && <small className="fst-italic">{horario.observacoes}</small>}
              </div>
              <div className="d-flex gap-2" onClick={(event) => event.preventDefault()}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setPendente({ id: horario.id, acao: "confirmar" })}>
                  Confirmar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setPendente({ id: horario.id, acao: "cancelar" })}>
                  Cancelar
                </Button>
              </div>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {pedidos.carregando ? <Carregando /> : <CarregarMais lista={pedidos} />}

      <ConfirmarAcao acao={pendente?.acao ?? null} onConfirmar={confirmarAcao} onFechar={() => setPendente(null)} />
    </>
  );
}

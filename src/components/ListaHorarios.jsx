import { List } from "@mui/material";
import { usePaginado } from "../hooks/useApi";
import { HorarioItem } from "./HorarioItem";
import { Carregando } from "./Carregando";
import { CarregarMais } from "./CarregarMais";
import { Erro } from "./Erro";

export function ListaHorarios({ caminho, vazio = "Nenhum horário aqui.", mostrarCliente = false }) {
  const horarios = usePaginado(caminho);

  if (horarios.erro) return <Erro erro={horarios.erro} tentarDeNovo={horarios.recarregar} />;

  return (
    <>
      {!horarios.carregando && horarios.itens.length === 0 && <p className="text-secondary">{vazio}</p>}
      <List disablePadding>
        {horarios.itens.map((horario) => (
          <HorarioItem key={horario.id} horario={horario} mostrarCliente={mostrarCliente} />
        ))}
      </List>
      {horarios.carregando ? <Carregando /> : <CarregarMais lista={horarios} />}
    </>
  );
}

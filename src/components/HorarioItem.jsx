import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatarData, formatarHora } from "../formatos";
import { StatusHorario } from "./StatusHorario";

export function HorarioItem({ horario, mostrarCliente = false }) {
  return (
    <ListGroup.Item action as={Link} to={`/horarios/${horario.id}`} className="d-flex align-items-center gap-3">
      <div className="text-center">
        <div className="fw-bold">{formatarHora(horario.inicio)}</div>
        <small className="text-secondary">{formatarData(horario.inicio)}</small>
      </div>
      <div className="me-auto">
        <div className="fw-semibold">{horario.servico_nome}</div>
        <small className="text-secondary">
          {horario.recurso_nome}
          {mostrarCliente && ` · ${horario.cliente_nome}`}
        </small>
        {mostrarCliente && horario.observacoes && (
          <div>
            <small className="fst-italic">{horario.observacoes}</small>
          </div>
        )}
      </div>
      <StatusHorario status={horario.status} />
    </ListGroup.Item>
  );
}

import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HorarioItem } from "../../components/HorarioItem";

export function Enviado() {
  const location = useLocation();
  const agendamento = location.state?.agendamento;

  if (!agendamento) {
    return <Navigate to="/horarios" />;
  }

  return (
    <Card className="text-center">
      <Card.Body>
        <i className="bi bi-check-circle-fill text-success display-3"></i>
        <h2 className="my-3">Agendamento enviado!</h2>
        <ListGroup className="mb-3 text-start">
          <HorarioItem horario={agendamento} />
        </ListGroup>
        <Alert variant="info">O administrador da barbearia vai confirmar o seu horário.</Alert>
        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to={`/horarios/${agendamento.id}`}>
            Ver horário
          </Button>
          <Button as={Link} to="/inicio" variant="outline-primary">
            Início
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

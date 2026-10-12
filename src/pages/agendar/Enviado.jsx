import { Alert, Button, Card, CardContent, List } from "@mui/material";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HorarioItem } from "../../components/HorarioItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function Enviado() {
  const location = useLocation();
  const agendamento = location.state?.agendamento;

  if (!agendamento) {
    return <Navigate to="/horarios" />;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2 className="my-3">Agendamento enviado!</h2>
        <List disablePadding className="mb-3 text-start">
          <HorarioItem horario={agendamento} />
        </List>
        <Alert severity="info">O administrador da barbearia vai confirmar o seu horário.</Alert>
        <div className="d-flex gap-2">
          <Button component={Link} to={`/horarios/${agendamento.id}`} type="button" variant="contained">
            Ver horário
          </Button>
          <Button component={Link} to="/inicio" type="button" variant="outlined">
            Início
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

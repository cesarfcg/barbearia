import { Button, List, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../AuthContext";
import { HorarioItem } from "../components/HorarioItem";
import { Carregando } from "../components/Carregando";
import { Erro } from "../components/Erro";
import { hoje } from "../formatos";
import { useApi } from "../hooks/useApi";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function ehProximo(horario) {
  return ["solicitado", "confirmado"].includes(horario.status) && new Date(horario.fim) > new Date();
}

// percorre as páginas até achar o primeiro horário que ainda não passou
async function buscarProximoHorario(caminho) {
  let proxima = caminho;
  while (proxima) {
    const dados = await api(proxima);
    const horario = dados.results.find(ehProximo);
    if (horario) return horario;
    proxima = dados.next;
  }
  return null;
}

export function Inicio() {
  const { usuario } = useAuth();
  const organizacao = useApi("/organizacao/");
  const horario = useApi(`/agendamentos/?data_inicio=${hoje()}`, buscarProximoHorario);

  if (organizacao.erro) return <Erro erro={organizacao.erro} tentarDeNovo={organizacao.recarregar} />;
  if (horario.erro) return <Erro erro={horario.erro} tentarDeNovo={horario.recarregar} />;
  if (organizacao.carregando || horario.carregando) return <Carregando />;

  const { nome, descricao, logo } = organizacao.dados;

  return (
    <Box>
      <h2>Olá, {usuario.nome}!</h2>
      <h5 className="mt-4">Seu próximo horário</h5>
      {horario.dados ? (
        <List disablePadding className="mb-3">
          <HorarioItem horario={horario.dados} />
        </List>
      ) : (
        <p className="text-secondary">Você não tem horários agendados.</p>
      )}
      <Button component={Link} to="/agendar" type="button" variant="contained">
        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} /> Agendar
      </Button>
    </Box>
  );
}

import { Button, Card, CardContent, List, Box, Stack, Typography } from "@mui/material";
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
      <Card
        sx={{
          mb: 4,
          color: "white",
          background: "linear-gradient(135deg, #171717 0%, #3b3620 100%)",
          borderRadius: 3,
          overflow: "hidden",
        }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={3}>
            <Box>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,.7)", letterSpacing: 1.5 }}>
                Bem-vindo de volta
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 1 }}>
                Olá, {usuario.nome}!
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,.8)", maxWidth: 520 }}>
                {descricao || `Cuide do seu estilo na ${nome}.`}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} className="mb-3 d-flex justify-content-between align-items-center">
        <Box>
          <Typography variant="h5" component="h2">
            Seu próximo horário
          </Typography>
          <Typography>Acompanhe os detalhes do seu agendamento</Typography>
        </Box>
        <Button component={Link} to="/agendar" type="button" variant="contained" className="d-flex align-items-center gap-2">
          <CalendarTodayIcon fontSize="small" />
          Agendar horário
        </Button>
      </Stack>

      <Card variant="outlined" sx={{ mt: 3 }}>
        {horario.dados ? (
          <List disablePadding>
            <HorarioItem horario={horario.dados} />
          </List>
        ) : (
          <CardContent sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Nenhum horário agendado
            </Typography>
            <Typography>Que tal reservar um momento para cuidar de você?</Typography>
          </CardContent>
        )}
      </Card>
    </Box>
  );
}

import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../AuthContext";
import { HorarioItem } from "../components/HorarioItem";
import { Carregando } from "../components/Carregando";
import { Erro } from "../components/Erro";
import { hoje } from "../formatos";
import { useApi } from "../hooks/useApi";

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
    <Row className="g-4">
      <Col md={5}>
        <Card className="text-center h-100">
          <Card.Body>
            <Image src={logo ?? "/logo.png"} alt={nome} fluid className="mb-3" />
            <Card.Text className="text-secondary">{descricao}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={7}>
        <h2>Olá, {usuario.nome}!</h2>
        <h5 className="mt-4">Seu próximo horário</h5>
        {horario.dados ? (
          <ListGroup className="mb-3">
            <HorarioItem horario={horario.dados} />
          </ListGroup>
        ) : (
          <p className="text-secondary">Você não tem horários agendados.</p>
        )}
        <Button as={Link} to="/agendar" size="lg">
          <i className="bi bi-calendar-plus"></i> Agendar
        </Button>
      </Col>
    </Row>
  );
}

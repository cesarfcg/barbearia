import { Alert, Button, Card, CardContent, Rating, TextField } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { api, mensagemDeErro } from "../api/client";
import { Carregando } from "../components/Carregando";
import { Erro } from "../components/Erro";
import { formatarData } from "../formatos";
import { useApi } from "../hooks/useApi";

export function Avaliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const horario = useApi(`/agendamentos/${id}/`);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState(null);

  if (horario.erro) return <Erro erro={horario.erro} tentarDeNovo={horario.recarregar} />;
  if (horario.carregando) return <Carregando />;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    try {
      await api(`/agendamentos/${id}/avaliar/`, { method: "POST", body: { nota, comentario } });
      navigate(`/horarios/${id}`);
    } catch (erro) {
      setErro(mensagemDeErro(erro));
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2>Avaliar atendimento</h2>
        <p className="text-secondary">
          {horario.dados.servico_nome} com {horario.dados.recurso_nome}, {formatarData(horario.dados.inicio)}
        </p>
        {erro && <Alert severity="error">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Rating
            className="mb-3"
            value={nota}
            onChange={(_, novoValor) => setNota(novoValor ?? 0)}
            size="large"
            aria-label="Nota do atendimento"
          />
          <TextField
            label="Comentário"
            multiline
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button type="submit" variant="contained" disabled={nota === 0} className="mt-3">
            Enviar
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}

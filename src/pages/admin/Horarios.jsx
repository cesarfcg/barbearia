import {
  Alert,
  Box,
  Button,
  IconButton,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { api, buscarTodas, mensagemDeErro } from "../../api/client";
import { Carregando } from "../../components/Carregando";
import { Confirmacao } from "../../components/Confirmacao";
import { Erro } from "../../components/Erro";
import { useApi } from "../../hooks/useApi";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import PlusIcon from "@mui/icons-material/Add";

const DIAS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export function Horarios() {
  const { id } = useParams();
  const recurso = useApi(`/recursos/${id}/`);
  const horarios = useApi(`/disponibilidades/?recurso=${id}`, buscarTodas);
  const [editando, setEditando] = useState(null);
  const [removendo, setRemovendo] = useState(null);
  const [erro, setErro] = useState(null);

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />;
  if (horarios.erro) return <Erro erro={horarios.erro} tentarDeNovo={horarios.recarregar} />;
  if (recurso.carregando || horarios.carregando) return <Carregando />;

  async function remover() {
    setErro(null);
    try {
      await api(`/disponibilidades/${removendo}/`, { method: "DELETE" });
      horarios.recarregar();
    } catch (erro) {
      setErro(mensagemDeErro(erro));
    }
    setRemovendo(null);
  }

  function salvo() {
    setEditando(null);
    horarios.recarregar();
  }

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <div className="me-auto">
          <h2 className="mb-0">Horários</h2>
          <span className="text-secondary">{recurso.dados.nome}</span>
        </div>
        <Button component={Link} to={`/admin/recursos/${id}`} variant="outlined">
          Voltar
        </Button>
      </div>
      {erro && <Alert severity="error">{erro}</Alert>}
      {horarios.dados.length === 0 && <Alert severity="warning">Sem horários: ninguém consegue agendar.</Alert>}

      {DIAS.map((nome, dia) => (
        <Card variant="outlined" key={dia} className="mb-3">
          <CardHeader
            sx={{ "& .MuiCardHeader-action": { alignSelf: "center", marginTop: 0, marginRight: 0 } }}
            title={nome}
            action={
              <Button
                size="small"
                variant="contained"
                className="d-flex align-items-center gap-2"
                onClick={() => setEditando({ dia_semana: dia, hora_inicio: "", hora_fim: "" })}
                sx={{ minWidth: 0, whiteSpace: "nowrap" }}>
                <PlusIcon />
                Adicionar
              </Button>
            }
          />

          <List disablePadding>
            {horarios.dados
              .filter((h) => h.dia_semana === dia)
              .map((h) => (
                <ListItem
                  key={h.id}
                  divider
                  secondaryAction={
                    <>
                      <IconButton onClick={() => setEditando(h)} aria-label="Editar horário">
                        <EditSquareIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => setRemovendo(h.id)} aria-label="Remover horário">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }>
                  <ListItemText primary={`${h.hora_inicio.slice(0, 5)} às ${h.hora_fim.slice(0, 5)}`} />
                </ListItem>
              ))}
          </List>
        </Card>
      ))}

      {editando && <FormHorario recurso={id} horario={editando} onSalvo={salvo} onFechar={() => setEditando(null)} />}
      <Confirmacao
        show={removendo !== null}
        titulo="Remover horário"
        mensagem="Deseja mesmo remover esta faixa de horário?"
        textoConfirmar="Remover"
        variante="danger"
        onConfirmar={remover}
        onFechar={() => setRemovendo(null)}
      />
    </>
  );
}

function FormHorario({ recurso, horario, onSalvo, onFechar }) {
  const [dia, setDia] = useState(horario.dia_semana);
  const [inicio, setInicio] = useState(horario.hora_inicio.slice(0, 5));
  const [fim, setFim] = useState(horario.hora_fim.slice(0, 5));
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});
  const inicioSelecionado = dayjs(`2000-01-01T${inicio}`);
  const fimSelecionado = dayjs(`2000-01-01T${fim}`);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setErros({});
    const corpo = { recurso, dia_semana: dia, hora_inicio: inicio, hora_fim: fim };
    try {
      if (horario.id) {
        await api(`/disponibilidades/${horario.id}/`, { method: "PATCH", body: corpo });
      } else {
        await api("/disponibilidades/", { method: "POST", body: corpo });
      }
      onSalvo();
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
    }
  }

  return (
    <Modal open onClose={onFechar} aria-labelledby="horario-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "calc(100% - 32px)", sm: 480 },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 3,
        }}>
        <Typography id="horario-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {horario.id ? "Editar horário" : "Novo horário"}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Form onSubmit={handleSubmit}>
            {erro && <Alert severity="error">{erro}</Alert>}
            <FormControl fullWidth margin="dense">
              <InputLabel id="dia-label">Dia da semana</InputLabel>
              <Select
                labelId="dia-label"
                label="Dia da semana"
                value={dia}
                onChange={(e) => setDia(Number(e.target.value))}>
                {DIAS.map((nome, i) => (
                  <MenuItem key={i} value={i}>
                    {nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TimePicker
              label="Início"
              value={inicioSelecionado}
              onChange={(valor) => valor && setInicio(valor.format("HH:mm"))}
              slotProps={{
                textField: {
                  error: !!erros.hora_inicio,
                  helperText: erros.hora_inicio?.join(" "),
                  required: true,
                  fullWidth: true,
                  margin: "dense",
                },
              }}
            />
            <TimePicker
              label="Fim"
              value={fimSelecionado}
              onChange={(valor) => valor && setFim(valor.format("HH:mm"))}
              slotProps={{
                textField: {
                  error: !!erros.hora_fim,
                  helperText: erros.hora_fim?.join(" "),
                  required: true,
                  fullWidth: true,
                  margin: "dense",
                },
              }}
            />
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="button" variant="outlined" onClick={onFechar}>
                Voltar
              </Button>
              <Button type="submit" variant="contained">
                Salvar
              </Button>
            </div>
          </Form>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
}

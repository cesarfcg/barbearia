import { Alert, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, mensagemDeErro } from "../../api/client";
import { Carregando } from "../../components/Carregando";
import { Erro } from "../../components/Erro";
import { Foto } from "../../components/Foto";
import { useApi } from "../../hooks/useApi";
import AcessAlarmIcon from "@mui/icons-material/AccessAlarm";

const NOVO = { nome: "", bio: "", foto: null, capacidade: 1, ativo: true };

export function NovoRecurso() {
  return <FormRecurso recurso={NOVO} />;
}

export function EditarRecurso() {
  const { id } = useParams();
  const { dados, erro, carregando, recarregar } = useApi(`/recursos/${id}/`);

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />;
  if (carregando) return <Carregando />;

  return <FormRecurso recurso={dados} />;
}

function FormRecurso({ recurso }) {
  const navigate = useNavigate();
  const [nome, setNome] = useState(recurso.nome);
  const [bio, setBio] = useState(recurso.bio);
  const [capacidade, setCapacidade] = useState(recurso.capacidade);
  const [ativo, setAtivo] = useState(recurso.ativo);
  const [foto, setFoto] = useState(recurso.foto);
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setErros({});

    const formulario = new FormData();
    formulario.append("nome", nome);
    formulario.append("bio", bio);
    formulario.append("capacidade", capacidade);
    formulario.append("ativo", ativo);
    if (arquivo) {
      formulario.append("foto", arquivo);
    }

    try {
      if (recurso.id) {
        await api(`/recursos/${recurso.id}/`, { method: "PATCH", body: formulario });
      } else {
        await api("/recursos/", { method: "POST", body: formulario });
      }
      navigate("/admin/recursos");
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
    }
  }

  async function removerFoto() {
    try {
      await api(`/recursos/${recurso.id}/`, { method: "PATCH", body: { foto: null } });
      setFoto(null);
    } catch (erro) {
      setErro(mensagemDeErro(erro));
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <div className="d-flex align-items-center mb-4">
          <h2 className="me-auto mb-0">{recurso.id ? "Editar barbeiro" : "Novo barbeiro"}</h2>
          {recurso.id && (
            <Button component={Link} to={`/admin/recursos/${recurso.id}/horarios`} variant="outlined" className="d-flex align-items-center">
              <AcessAlarmIcon fontSize="small" sx={{ mr: 0.5 }} /> Horários
            </Button>
          )}
        </div>
        {erro && <Alert severity="error">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={!!erros.nome}
            helperText={erros.nome?.join(" ")}
            required
            fullWidth
            margin="dense"
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            error={!!erros.bio}
            helperText={erros.bio?.join(" ")}
            multiline
            rows={3}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Capacidade"
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            error={!!erros.capacidade}
            helperText={erros.capacidade?.join(" ") || "Quantidade de atendimentos simultâneos."}
            fullWidth
            margin="dense"
          />
          <Form.Group className="mb-3" controlId="foto">
            <Form.Label>Foto</Form.Label>
            <div className="d-flex flex-column align-items-start gap-2 mb-2">
              <Foto src={foto} tamanho={64} />
              {foto && (
                <Button type="button" variant="outlined" size="small" onClick={removerFoto}>
                  Remover foto
                </Button>
              )}
            </div>
            <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
              Selecionar foto
              <input type="file" hidden accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} />
            </Button>
            {arquivo && <div className="small text-secondary mt-2">{arquivo.name}</div>}
            {erros.foto && <div className="text-danger small mt-1">{erros.foto.join(" ")}</div>}
          </Form.Group>
          <FormControlLabel
            className="mb-3"
            control={<Switch id="ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />}
            label="Ativo (inativos não aparecem para os clientes)"
          />
          <div className="d-flex gap-2">
            <Button type="button" variant="outlined" onClick={() => navigate("/admin/recursos")}>
              Voltar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

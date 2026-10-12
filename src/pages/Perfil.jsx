import { Alert, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";
import UploadIcon from "@mui/icons-material/Upload";
import { Link, useLocation } from "react-router-dom";
import { api, mensagemDeErro } from "../api/client";
import { useAuth } from "../AuthContext";
import { Foto } from "../components/Foto";
import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";

export function Perfil() {
  const { usuario, setUsuario, sair } = useAuth();
  const location = useLocation();
  const [nome, setNome] = useState(usuario.nome);
  const [foto, setFoto] = useState(null);
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});
  const [salvo, setSalvo] = useState(false);

  async function salvar(corpo) {
    setErro(null);
    setErros({});
    setSalvo(false);
    try {
      setUsuario(await api("/auth/eu/", { method: "PATCH", body: corpo }));
      setSalvo(true);
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formulario = new FormData();
    formulario.append("nome", nome);
    if (foto) {
      formulario.append("foto", foto);
    }
    salvar(formulario);
  }

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Card variant="outlined">
          <CardContent>
            <div className="text-center mb-4">
              <Foto src={usuario.foto} tamanho={96} />
              <h2 className="mt-2 mb-0">{usuario.nome}</h2>
              <div className="text-secondary">{usuario.email}</div>
              <div className="text-secondary">{usuario.organizacao.nome}</div>
            </div>

            {erro && <Alert severity="error">{erro}</Alert>}
            {salvo && <Alert severity="success">Perfil atualizado.</Alert>}
            {location.state?.mensagem && <Alert severity="success">{location.state.mensagem}</Alert>}

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
              <Form.Group className="mb-3 mt-2" controlId="foto">
                <Form.Label>Foto</Form.Label>
                <br />
                <Button component="label" variant="outlined">
                  <UploadIcon sx={{ mr: 0.5 }} />
                  Selecionar foto
                  <input type="file" hidden accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
                </Button>
                {foto && <div className="small text-secondary mt-2">{foto.name}</div>}
                {erros.foto && <div className="text-danger small mt-1">{erros.foto.join(" ")}</div>}
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" variant="contained">
                  Salvar
                </Button>
                {usuario.foto && (
                  <Button type="button" variant="outlined" color="secondary" onClick={() => salvar({ foto: null })}>
                    Remover foto
                  </Button>
                )}
                <Button component={Link} to="/perfil/senha" variant="outlined" className="ms-auto">
                  <KeyIcon fontSize="small" sx={{ mr: 0.5 }} /> Alterar senha
                </Button>
                <Button type="button" variant="outlined" color="error" onClick={sair}>
                  <LogoutIcon fontSize="small" sx={{ mr: 0.5 }} /> Sair
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

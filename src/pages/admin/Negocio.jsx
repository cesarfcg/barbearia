import { Alert, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { Form, Image } from 'react-bootstrap'
import { Button, TextField } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { api, mensagemDeErro } from "../../api/client";
import { useAuth } from "../../AuthContext";
import { Carregando } from "../../components/Carregando";
import { Erro } from "../../components/Erro";
import { useApi } from "../../hooks/useApi";

export function Negocio() {
  const { dados, erro, carregando, recarregar } = useApi("/organizacao/");

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />;
  if (carregando) return <Carregando />;

  return <FormNegocio organizacao={dados} />;
}

function FormNegocio({ organizacao }) {
  const { usuario, setUsuario } = useAuth();
  const [nome, setNome] = useState(organizacao.nome);
  const [descricao, setDescricao] = useState(organizacao.descricao);
  const [logo, setLogo] = useState(organizacao.logo);
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});
  const [salvo, setSalvo] = useState(false);

  async function salvar(corpo) {
    setErro(null);
    setErros({});
    setSalvo(false);
    try {
      const nova = await api("/organizacao/", { method: "PATCH", body: corpo });
      setLogo(nova.logo);
      setUsuario({ ...usuario, organizacao: nova });
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
    formulario.append("descricao", descricao);
    if (arquivo) {
      formulario.append("logo", arquivo);
    }
    salvar(formulario);
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2 className="mb-4">Dados do negócio</h2>
        {erro && <Alert severity="error">{erro}</Alert>}
        {salvo && <Alert severity="success">Dados salvos.</Alert>}
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
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            error={!!erros.descricao}
            helperText={erros.descricao?.join(" ")}
            multiline
            rows={3}
            fullWidth
            margin="dense"
          />
          <Form.Group className="mb-3" controlId="logo">
            <Form.Label>Logo</Form.Label>
            {logo && (
              <div className="mb-2">
                <Image src={logo} width={200} thumbnail />
              </div>
            )}
            <Button component="label" variant="outlined">
              <UploadIcon sx={{ mr: 0.5 }} />
              Selecionar logo
              <input type="file" hidden accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} />
            </Button>
            {arquivo && <div className="small text-secondary mt-2">{arquivo.name}</div>}
            {erros.logo && <div className="text-danger small mt-1">{erros.logo.join(" ")}</div>}
          </Form.Group>
          <div className="d-flex gap-2">
            {logo && (
              <Button type="button" variant="outlined" onClick={() => salvar({ logo: null })}>
                Remover logo
              </Button>
            )}
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

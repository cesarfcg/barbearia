import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Form, Image } from "react-bootstrap";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate, useParams } from "react-router-dom";
import { api, buscarTodas, mensagemDeErro } from "../../api/client";
import { Carregando } from "../../components/Carregando";
import { Erro } from "../../components/Erro";
import { useApi } from "../../hooks/useApi";

const NOVO = { nome: "", descricao: "", duracao_min: 50, preco: "0.00", imagem: null, recursos: [], ativo: true };

export function NovoServico() {
  const recursos = useApi("/recursos/", buscarTodas);

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />;
  if (recursos.carregando) return <Carregando />;

  return <FormServico servico={NOVO} recursos={recursos.dados} />;
}

export function EditarServico() {
  const { id } = useParams();
  const servico = useApi(`/servicos/${id}/`);
  const recursos = useApi("/recursos/", buscarTodas);

  if (servico.erro) return <Erro erro={servico.erro} tentarDeNovo={servico.recarregar} />;
  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />;
  if (servico.carregando || recursos.carregando) return <Carregando />;

  return <FormServico servico={servico.dados} recursos={recursos.dados} />;
}

function FormServico({ servico, recursos }) {
  const navigate = useNavigate();
  const [nome, setNome] = useState(servico.nome);
  const [descricao, setDescricao] = useState(servico.descricao);
  const [duracao, setDuracao] = useState(servico.duracao_min);
  const [preco, setPreco] = useState(servico.preco);
  const [escolhidos, setEscolhidos] = useState(servico.recursos);
  const [ativo, setAtivo] = useState(servico.ativo);
  const [imagem, setImagem] = useState(servico.imagem);
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});

  function marcar(id, marcado) {
    if (marcado) {
      setEscolhidos([...escolhidos, id]);
    } else {
      setEscolhidos(escolhidos.filter((r) => r !== id));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setErros({});
    const corpo = { nome, descricao, duracao_min: duracao, preco, recursos: escolhidos, ativo };

    try {
      const salvo = servico.id
        ? await api(`/servicos/${servico.id}/`, { method: "PATCH", body: corpo })
        : await api("/servicos/", { method: "POST", body: corpo });

      // a lista de recursos vai em JSON; a imagem vai depois, em multipart
      if (arquivo) {
        const formulario = new FormData();
        formulario.append("imagem", arquivo);
        await api(`/servicos/${salvo.id}/`, { method: "PATCH", body: formulario });
      }
      navigate("/admin/servicos");
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
    }
  }

  async function removerImagem() {
    try {
      await api(`/servicos/${servico.id}/`, { method: "PATCH", body: { imagem: null } });
      setImagem(null);
    } catch (erro) {
      setErro(mensagemDeErro(erro));
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2 className="mb-4">{servico.id ? "Editar serviço" : "Novo serviço"}</h2>
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
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            error={!!erros.descricao}
            helperText={erros.descricao?.join(" ")}
            multiline
            rows={2}
            fullWidth
            margin="dense"
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }} className="mb-3">
              <TextField
                label="Duração (min)"
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                error={!!erros.duracao_min}
                helperText={erros.duracao_min?.join(" ")}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} className="mb-3">
              <TextField
                label="Preço (R$)"
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                error={!!erros.preco}
                helperText={erros.preco?.join(" ")}
                inputProps={{ step: "0.01" }}
                fullWidth
                margin="dense"
              />
            </Grid>
          </Grid>
          <Form.Group className="mb-3">
            <Form.Label>Barbeiros que oferecem</Form.Label>
            <br />
            {recursos.map((recurso) => (
              <FormControlLabel
                key={recurso.id}
                control={
                  <Checkbox
                    id={`recurso-${recurso.id}`}
                    checked={escolhidos.includes(recurso.id)}
                    onChange={(e) => marcar(recurso.id, e.target.checked)}
                  />
                }
                label={recurso.ativo ? recurso.nome : `${recurso.nome} (inativo)`}
              />
            ))}
            {erros.recursos && <div className="text-danger small">{erros.recursos.join(" ")}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="imagem">
            <Form.Label>Imagem</Form.Label>
            <br />
            {imagem && (
              <div className="d-flex align-items-start gap-3 mb-2 flex-column">
                <Image src={imagem} width={160} thumbnail />
                <Button type="button" variant="outlined" size="small" onClick={removerImagem}>
                  Remover imagem
                </Button>
              </div>
            )}
            <Button component="label" variant="outlined" className="d-flex align-items-center gap-2">
              <UploadIcon />
              Selecionar imagem
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setArquivo(e.target.files[0])}
              />
            </Button>
            {arquivo && <div className="small text-secondary mt-2">{arquivo.name}</div>}
            {erros.imagem && <div className="text-danger small mt-1">{erros.imagem.join(" ")}</div>}
          </Form.Group>
          <FormControlLabel
            className="mb-3"
            control={<Switch id="ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />}
            label="Ativo (inativos não aparecem para os clientes)"
          />
          <div className="d-flex gap-2">
            <Button type="button" variant="outlined" onClick={() => navigate("/admin/servicos")}>
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

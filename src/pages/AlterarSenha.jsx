import { Alert, Box, Button, Card, CardContent, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, mensagemDeErro } from "../api/client";

export function AlterarSenha() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setErros({});

    // a API não recebe a confirmação: ela é conferida só aqui
    if (novaSenha !== confirmacao) {
      setErros({ confirmacao: ["As senhas não conferem."] });
      return;
    }

    setEnviando(true);
    try {
      await api("/auth/alterar-senha/", {
        method: "POST",
        body: { senha_atual: senhaAtual, nova_senha: novaSenha },
      });
      navigate("/perfil", { state: { mensagem: "Senha alterada." } });
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
      setEnviando(false);
    }
  }

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Card variant="outlined">
          <CardContent>
            <h2 className="mb-4">Alterar senha</h2>
            {erro && <Alert severity="error">{erro}</Alert>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Senha atual"
                type={mostrarSenhaAtual ? "text" : "password"}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                error={!!erros.senha_atual}
                helperText={erros.senha_atual?.join(" ")}
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={mostrarSenhaAtual ? "Ocultar senha atual" : "Mostrar senha atual"}
                          onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                          edge="end">
                          {mostrarSenhaAtual ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Nova senha"
                type={mostrarNovaSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                error={!!erros.nova_senha}
                helperText={erros.nova_senha?.join(" ")}
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"}
                          onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                          edge="end">
                          {mostrarNovaSenha ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Confirme a nova senha"
                type={mostrarConfirmacao ? "text" : "password"}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                error={!!erros.confirmacao}
                helperText={erros.confirmacao?.join(" ")}
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            mostrarConfirmacao ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"
                          }
                          onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                          edge="end">
                          {mostrarConfirmacao ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div className="d-flex gap-2">
                <Button type="button" variant="outlined" onClick={() => navigate("/perfil")}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={enviando}>
                  Salvar
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

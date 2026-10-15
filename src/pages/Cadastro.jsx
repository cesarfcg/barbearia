import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { cadastrar, mensagemDeErro } from "../api/client";
import { useAuth } from "../AuthContext";
import logo from "../assets/logo.png";

export function Cadastro() {
  const { entrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [erro, setErro] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }
    setEnviando(true);
    setErro(null);
    setErros({});
    try {
      await cadastrar(nome, email, senha);
      await entrar(email, senha);
    } catch (erro) {
      setErro(mensagemDeErro(erro));
      setErros(erro.dados ?? {});
      setEnviando(false);
    }
  }

  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, height: "100%", minHeight: "100vh" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          order: 1,
          gap: 2,
          height: "100%",
          bgcolor: "#171717",
          color: "white",
          p: 3,
          textAlign: "center",
        }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ width: "min(100%, 230px)", aspectRatio: "1", objectFit: "contain" }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Seu estilo começa aqui
        </Typography>
        <Typography variant="body2" sx={{ color: "grey.400", maxWidth: 260 }}>
          Cortes, barba e cuidados para você sair no seu melhor estilo.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          order: { xs: 2, md: 2 },
          p: { xs: 3, md: 4 },
        }}>
        <Card sx={{ width: "100%", maxWidth: 520 }} variant="outlined">
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <h2 className="mb-4">Criar conta</h2>
            {erro && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {erro}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                error={!!erros.nome}
                helperText={erros.nome?.join(" ")}
                required
                fullWidth
              />
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!erros.email}
                helperText={erros.email?.join(" ")}
                required
                fullWidth
              />
              <TextField
                label="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={!!erros.senha}
                helperText={erros.senha?.join(" ")}
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          edge="end">
                          {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Confirmar senha"
                type={mostrarConfirmacao ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                error={senha !== confirmarSenha && confirmarSenha !== ""}
                helperText={senha !== confirmarSenha && confirmarSenha !== "" ? "As senhas não conferem." : ""}
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
              <Button type="submit" variant="contained" fullWidth disabled={enviando} sx={{ py: 1.5 }}>
                Criar conta
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mt: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}>
              <Typography>Já tem conta?</Typography>
              <Button component={Link} to="/login">
                Entrar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

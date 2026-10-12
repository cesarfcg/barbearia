import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, TextField, Box, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { cadastrar, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'

export function Cadastro() {
  const { entrar } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }
    setEnviando(true)
    setErro(null)
    setErros({})
    try {
      await cadastrar(nome, email, senha)
      await entrar(email, senha)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Criar conta</h2>
      {erro && <Alert severity="error">{erro}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          error={!!erros.nome}
          helperText={erros.nome?.join(' ')}
          required
          fullWidth
        />
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!erros.email}
          helperText={erros.email?.join(' ')}
          required
          fullWidth
        />
        <TextField
          label="Senha"
          type={mostrarSenha ? 'text' : 'password'}
          value={senha}
          onChange={e => setSenha(e.target.value)}
          error={!!erros.senha}
          helperText={erros.senha?.join(' ')}
          required
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
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
          type={mostrarConfirmacao ? 'text' : 'password'}
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
          error={senha !== confirmarSenha && confirmarSenha !== ''}
          helperText={senha !== confirmarSenha && confirmarSenha !== '' ? 'As senhas não conferem.' : ''}
          required
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={mostrarConfirmacao ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
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
      <div className="d-flex justify-content-between align-items-center mt-3">
        <p className="m-0">Já tem conta?</p>
        <Button component={Link} to="/login">Entrar</Button>
      </div>
    </>
  )
}

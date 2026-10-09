import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Button, Box, TextField } from '@mui/material'
import { mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'

export function Login() {
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await entrar(email, senha)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Entrar</h2>
      {erro && <Alert variant="danger">{erro}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" fullWidth disabled={enviando} sx={{ py: 1.5 }}>
          Entrar
        </Button>
      </Box>
      <div className="d-flex justify-content-between mt-3">
        <Button component={Link} to="/cadastro">Criar conta</Button>
        <Button component={Link} to="/esqueci-senha">Esqueci minha senha</Button>
      </div>
    </>
  )
}

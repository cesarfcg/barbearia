import { useState } from 'react'
import { Alert, Box, Button, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { mensagemDeErro, redefinirSenha } from '../api/client'

export function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await redefinirSenha(email)
      setEnviado(true)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Esqueci minha senha</h2>
      {enviado ? (
        <Alert severity="success">
          Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.
        </Alert>
      ) : (
        <>
          {erro && <Alert severity="error">{erro}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth disabled={enviando} sx={{ py: 1.5 }}>
              Enviar link
            </Button>
          </Box>
        </>
      )}
      <Button component={Link} to="/login" sx={{ mt: 1.5 }}>
        Voltar para o login
      </Button>
    </>
  )
}

import { Alert, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { mensagemDeErro } from '../api/client'

export function Erro({ erro, tentarDeNovo }) {
  const navigate = useNavigate()

  return (
    <Alert severity="error" className="d-flex align-items-center">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {mensagemDeErro(erro)}
      {erro.status === 404 ? (
        <Button type="button" variant="outlined" color="error" size="small" className="ms-auto" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      ) : (
        <Button type="button" variant="outlined" color="error" size="small" className="ms-auto" onClick={tentarDeNovo}>
          Tentar de novo
        </Button>
      )}
    </Alert>
  )
}

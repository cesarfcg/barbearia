import { Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function NaoEncontrado() {
  const { inicio } = useAuth()
  return (
    <Alert severity="warning">
      Página não encontrada. <Link to={inicio}>Voltar para o início</Link>
    </Alert>
  )
}

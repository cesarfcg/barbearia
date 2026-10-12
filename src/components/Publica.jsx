import { Card, CardContent, Container, Grid } from "@mui/material";
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'

export function Publica() {
  const { usuario, carregando, inicio } = useAuth()

  if (carregando) {
    return <Carregando />
  }
  if (usuario) {
    return <Navigate to={inicio} />
  }

  return (
    <Container className="min-vh-100 d-flex align-items-center">
      <Grid container className="w-100" sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Card variant="outlined" className="shadow-sm">
            <CardContent className="p-4">
              <Outlet />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

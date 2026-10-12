import { Alert, Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from 'react-router-dom'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { usePaginado } from '../hooks/useApi'

export function Barbeiros() {
  const recursos = usePaginado('/recursos/')

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />

  return (
    <>
      <h2 className="mb-4">Barbeiros</h2>
      {!recursos.carregando && recursos.itens.length === 0 && <Alert severity="info">Nenhum barbeiro cadastrado.</Alert>}
      <Grid container spacing={4}>
        {recursos.itens.map(recurso => (
          <Grid key={recurso.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined" component={Link} to={`/barbeiros/${recurso.id}`} className="text-decoration-none d-flex">
              <CardContent className="d-flex align-items-center gap-3">
                <Foto src={recurso.foto} tamanho={64} />
                <div>
                  <Typography component="h5" className="card-title">{recurso.nome}</Typography>
                  <Typography component="p" className="card-text text-secondary">{recurso.bio}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}

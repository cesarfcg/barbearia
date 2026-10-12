import { Alert, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { Erro } from "../../components/Erro";
import { Foto } from "../../components/Foto";
import { usePaginado } from "../../hooks/useApi";

export function EscolherBarbeiro() {
  const [params] = useSearchParams();
  const servico = params.get("servico");
  const recursos = usePaginado(`/recursos/?servicos=${servico}`);

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />;
  if (recursos.carregando && recursos.itens.length === 0) return <Carregando />;

  return (
    <>
      <small className="text-secondary">Passo 2 de 4</small>
      <h2 className="mb-4">Escolha o barbeiro</h2>
      {recursos.itens.length === 0 ? (
        <Alert severity="info">Nenhum barbeiro realiza este serviço.</Alert>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined" className="h-100">
              <CardContent className="d-flex gap-3">
                <i className="bi bi-people-fill text-secondary display-5"></i>
                <div>
                  <Typography component="h5" className="card-title">
                    Qualquer um
                  </Typography>
                  <Typography component="p" className="card-text text-secondary">
                    Mostra os horários livres de todos.
                  </Typography>
                  <Button component={Link} to={`/agendar/horario?servico=${servico}`} type="button" variant="contained" className="mt-2">
                    Escolher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          {recursos.itens.map((recurso) => (
            <Grid key={recurso.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card variant="outlined" className="h-100">
                <CardContent className="d-flex gap-3">
                  <Foto src={recurso.foto} tamanho={64} />
                  <div>
                    <Typography component="h5" className="card-title">
                      {recurso.nome}
                    </Typography>
                    <Typography component="p" className="card-text text-secondary">
                      {recurso.bio}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/agendar/horario?servico=${servico}&recurso=${recurso.id}`}
                      type="button"
                      variant="contained"
                      className="me-2 mt-2">
                      Escolher
                    </Button>
                    <Button component={Link} to={`/barbeiros/${recurso.id}`} type="button" variant="text" className="mt-2">
                      Ver avaliações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  );
}

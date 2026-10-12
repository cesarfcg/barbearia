import { Alert, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { Erro } from "../../components/Erro";
import { formatarPreco } from "../../formatos";
import { usePaginado } from "../../hooks/useApi";
import AcessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCutIcon from "@mui/icons-material/ContentCut";

export function EscolherServico() {
  const [params] = useSearchParams();
  const recurso = params.get("recurso");
  const servicos = usePaginado(recurso ? `/servicos/?recursos=${recurso}` : "/servicos/");

  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />;

  function proximoPasso(servico) {
    if (recurso) {
      return `/agendar/horario?servico=${servico.id}&recurso=${recurso}`;
    }
    return `/agendar/barbeiro?servico=${servico.id}`;
  }

  return (
    <>
      <small className="text-secondary">Passo 1 de 4</small>
      <h2 className="mb-4">Qual serviço?</h2>
      {!servicos.carregando && servicos.itens.length === 0 && <Alert severity="info">Nenhum serviço disponível.</Alert>}
      <Grid container spacing={4}>
        {servicos.itens.map((servico) => (
          <Grid key={servico.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined" component={Link} to={proximoPasso(servico)} className="h-100 text-decoration-none d-flex flex-column">
              {servico.imagem ? (
                <CardMedia component="img" src={servico.imagem} />
              ) : (
                <div className="text-center bg-body-tertiary py-4">
                  <ContentCutIcon fontSize="large" sx={{ mr: 0.5 }} />
                </div>
              )}
              <CardContent>
                <Typography component="h5" className="card-title">{servico.nome}</Typography>
                <Typography component="p" className="card-text text-secondary">{servico.descricao}</Typography>
              </CardContent>
              <CardActions className="d-flex justify-content-between">
                <span>
                  <AcessTimeIcon fontSize="small" sx={{ mr: 0.5 }} /> {servico.duracao_min} min
                </span>
                <strong>{formatarPreco(servico.preco)}</strong>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  );
}

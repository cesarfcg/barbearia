import { Button, Card, CardContent, Chip, List } from "@mui/material";
import { Link, useParams } from 'react-router-dom'
import { buscarTodas } from '../api/client'
import { useAuth } from '../AuthContext'
import { Avaliacao } from '../components/Avaliacao'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { useApi, usePaginado } from '../hooks/useApi'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function Barbeiro() {
  const { id } = useParams()
  const { pode } = useAuth()
  const recurso = useApi(`/recursos/${id}/`)
  const servicos = useApi(`/servicos/?recursos=${id}`, buscarTodas)
  const avaliacoes = usePaginado(`/avaliacoes/?recurso=${id}`)

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />
  if (recurso.carregando || servicos.carregando) return <Carregando />

  const { nome, bio, foto } = recurso.dados

  return (
    <>
      <Card variant="outlined" className="mb-4">
        <CardContent className="d-flex gap-4 align-items-center">
          <Foto src={foto} tamanho={120} />
          <div>
            <h2>{nome}</h2>
            <p className="text-secondary">{bio}</p>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {servicos.dados.map(servico => (
                <Chip key={servico.id} label={servico.nome} color="default" />
              ))}
            </div>
            {pode('api.add_agendamento') && (
              <Button component={Link} to={`/agendar?recurso=${id}`} type="button" variant="contained" className="d-flex align-items-center gap-2">
                <CalendarTodayIcon fontSize="small" /> Agendar com este barbeiro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <h4>Avaliações</h4>
      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}
      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-secondary">Ainda sem avaliações.</p>
      )}
      <List disablePadding>
        {avaliacoes.itens.map(avaliacao => (
          <Avaliacao key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </List>
      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  )
}

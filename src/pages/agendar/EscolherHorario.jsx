import { Alert, Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { SeletorData } from '../../components/SeletorData'
import { formatarHora, hoje, somarDias } from '../../formatos'
import { useApi } from '../../hooks/useApi'

export function EscolherHorario() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const servico = params.get('servico')
  const recurso = params.get('recurso')
  const data = params.get('data') ?? hoje()

  let caminho = `/horarios-livres/?servico=${servico}&data=${data}`
  if (recurso) {
    caminho += `&recurso=${recurso}`
  }
  const { dados, erro, carregando, recarregar } = useApi(caminho)

  function mudarData(novaData) {
    const novos = new URLSearchParams(params)
    novos.set('data', novaData)
    setParams(novos, { replace: true })
  }

  function escolher(recursoId, inicio) {
    const escolha = new URLSearchParams({ servico, recurso: recursoId, inicio })
    navigate(`/agendar/confirmar?${escolha}`, {
      state: { voltar: location.pathname + location.search },
    })
  }

  const comHorarios = dados ? dados.filter(item => item.horarios.length > 0) : []

  return (
    <>
      <small className="text-secondary">Passo 3 de 4</small>
      <h2 className="mb-4">Quando?</h2>

      {location.state?.erro && <Alert severity="warning">{location.state.erro}</Alert>}

      <SeletorData data={data} onChange={mudarData} min={hoje()} />

      {erro && <Erro erro={erro} tentarDeNovo={recarregar} />}
      {carregando && <Carregando />}

      {dados && comHorarios.length === 0 && (
        <Alert severity="info" className="d-flex align-items-center">
          Sem horários livres neste dia.
          <Button type="button" variant="outlined" size="small" className="ms-auto" onClick={() => mudarData(somarDias(data, 1))}>
            Ver o dia seguinte
          </Button>
        </Alert>
      )}

      {comHorarios.map(item => (
        <Card variant="outlined" key={item.recurso.id} className="mb-3">
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Foto src={item.recurso.foto} tamanho={40} />
                <span>{item.recurso.nome}</span>
              </Box>
            }
          />
          <CardContent className="d-flex flex-wrap gap-2">
            {item.horarios.map(horario => (
              <Button type="button" key={horario} variant="outlined" onClick={() => escolher(item.recurso.id, horario)}>
                {formatarHora(horario)}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

import { Button } from '@mui/material'

export function CarregarMais({ lista }) {
  if (!lista.temMais) return null
  return (
    <div className="text-center my-3">
      <Button type="button" variant="outlined" onClick={lista.carregarMais} disabled={lista.carregando}>
        Carregar mais
      </Button>
    </div>
  )
}

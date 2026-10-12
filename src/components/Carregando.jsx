import { CircularProgress } from '@mui/material'

export function Carregando() {
  return (
    <div className="text-center my-5">
      <CircularProgress color="primary" />
    </div>
  )
}

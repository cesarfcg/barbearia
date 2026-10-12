import { MenuItem, Select } from '@mui/material'

export function FiltroAtivo({ valor, onChange }) {
  return (
    <Select
      value={valor}
      onChange={e => onChange(e.target.value)}
      displayEmpty
      renderValue={value => (value === '' ? 'Todos' : value === 'true' ? 'Ativos' : 'Inativos')}
      size="small"
      sx={{ minWidth: 110 }}
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="true">Ativos</MenuItem>
      <MenuItem value="false">Inativos</MenuItem>
    </Select>
  )
}

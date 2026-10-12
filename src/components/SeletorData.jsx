import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'

export function SeletorData({ data, onChange, min }) {
  const dataSelecionada = dayjs(data)
  const dataMinima = min ? dayjs(min) : undefined

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="mb-4">
        <DatePicker
          label="Data"
          value={dataSelecionada}
          minDate={dataMinima}
          onChange={(novaData) => novaData && onChange(novaData.format('YYYY-MM-DD'))}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
      </div>
    </LocalizationProvider>
  )
}

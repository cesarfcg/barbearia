import { Box, Button, Modal, Typography } from '@mui/material'

export function Confirmacao({ show, titulo, mensagem, textoConfirmar = 'Confirmar', variante = 'primary', onConfirmar, onFechar }) {
  return (
    <Modal open={show} onClose={onFechar} aria-labelledby="confirmacao-titulo">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 'calc(100% - 32px)', sm: 420 },
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 3,
        }}>
        <Typography id="confirmacao-titulo" variant="h6" component="h2">
          {titulo}
        </Typography>
        <Typography sx={{ mt: 2 }}>{mensagem}</Typography>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button type="button" variant="outlined" onClick={onFechar}>
            Voltar
          </Button>
          <Button variant="contained" onClick={onConfirmar}>
            {textoConfirmar}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

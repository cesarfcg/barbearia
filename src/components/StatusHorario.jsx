import { Chip } from "@mui/material";

const STATUS = {
  solicitado: { cor: "warning", texto: "Solicitado" },
  confirmado: { cor: "primary", texto: "Confirmado" },
  concluido: { cor: "success", texto: "Concluído" },
  cancelado: { cor: "secondary", texto: "Cancelado" },
};

export function StatusHorario({ status }) {
  const { cor, texto } = STATUS[status];
  return (
    <Chip label={texto} color={cor === "secondary" ? "default" : cor} />
  );
}

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ListaHorarios } from "../components/ListaHorarios";
import { hoje, somarDias } from "../formatos";

export function MeusHorarios() {
  const [aba, setAba] = useState("proximos");

  return (
    <>
      <h2 className="mb-4">Meus horários</h2>
      <Tabs value={aba} onChange={(_, valor) => setAba(valor)} sx={{ mb: 3 }}>
        <Tab value="proximos" label="Próximos" />
        <Tab value="historico" label="Histórico" />
      </Tabs>
      {aba === "proximos" && (
        <Box>
          <ListaHorarios caminho={`/agendamentos/?data_inicio=${hoje()}`} />
        </Box>
      )}
      {aba === "historico" && (
        <Box>
          <ListaHorarios caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} />
        </Box>
      )}
    </>
  );
}

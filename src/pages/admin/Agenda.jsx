import { Alert, Grid, List, MenuItem, Select } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { buscarTodas } from "../../api/client";
import { HorarioItem } from "../../components/HorarioItem";
import { Carregando } from "../../components/Carregando";
import { Erro } from "../../components/Erro";
import { SeletorData } from "../../components/SeletorData";
import { hoje } from "../../formatos";
import { useApi } from "../../hooks/useApi";

export function Agenda() {
  const [params, setParams] = useSearchParams();
  const data = params.get("data") ?? hoje();
  const recurso = params.get("recurso") ?? "";

  let caminho = `/agendamentos/?data_inicio=${data}&data_fim=${data}`;
  if (recurso) {
    caminho += `&recurso=${recurso}`;
  }
  const horarios = useApi(caminho, buscarTodas);
  const recursos = useApi("/recursos/", buscarTodas);

  function mudar(nome, valor) {
    const novos = new URLSearchParams(params);
    novos.set(nome, valor);
    setParams(novos, { replace: true });
  }

  return (
    <>
      <h2 className="mb-4">Agenda do dia</h2>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SeletorData data={data} onChange={(valor) => mudar("data", valor)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Select
            className="mb-4"
            fullWidth
            size="small"
            value={recurso}
            onChange={(e) => mudar("recurso", e.target.value)}
            displayEmpty
            renderValue={(value) =>
              value === ""
                ? "Todos os barbeiros"
                : (recursos.dados?.find((r) => String(r.id) === String(value))?.nome ?? value)
            }>
            <MenuItem value="">Todos os barbeiros</MenuItem>
            {recursos.dados?.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nome}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {horarios.erro && <Erro erro={horarios.erro} tentarDeNovo={horarios.recarregar} />}
      {horarios.carregando && <Carregando />}
      {horarios.dados?.length === 0 && <Alert severity="info">Nenhum horário neste dia.</Alert>}
      <List disablePadding>
        {horarios.dados?.map((horario) => (
          <HorarioItem key={horario.id} horario={horario} mostrarCliente />
        ))}
      </List>
    </>
  );
}

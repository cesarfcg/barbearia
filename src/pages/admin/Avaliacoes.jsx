import { useState } from "react";
import { Grid, List, MenuItem, Select } from "@mui/material";
import { buscarTodas } from "../../api/client";
import { Avaliacao } from "../../components/Avaliacao";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { Erro } from "../../components/Erro";
import { useApi, usePaginado } from "../../hooks/useApi";

export function Avaliacoes() {
  const [recurso, setRecurso] = useState("");
  const [nota, setNota] = useState("");
  const recursos = useApi("/recursos/", buscarTodas);

  const filtros = new URLSearchParams();
  if (recurso) filtros.set("recurso", recurso);
  if (nota) filtros.set("nota", nota);
  const avaliacoes = usePaginado(`/avaliacoes/?${filtros}`);

  return (
    <>
      <h2 className="mb-4">Avaliações</h2>
      <Grid container spacing={2} className="mb-4">
        <Grid size={{ xs: 12, md: 8 }}>
          <Select
            fullWidth
            size="small"
            value={recurso}
            onChange={(e) => setRecurso(e.target.value)}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            fullWidth
            size="small"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            displayEmpty
            renderValue={(value) =>
              value === "" ? "Todas as notas" : `${value} ${value === "1" ? "estrela" : "estrelas"}`
            }>
            <MenuItem value="">Todas as notas</MenuItem>
            {[5, 4, 3, 2, 1].map((n) => (
              <MenuItem key={n} value={n}>
                {n} {n === 1 ? "estrela" : "estrelas"}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}
      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-secondary">Ainda sem avaliações.</p>
      )}
      <List disablePadding>
        {avaliacoes.itens.map((avaliacao) => (
          <Avaliacao key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </List>
      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  );
}

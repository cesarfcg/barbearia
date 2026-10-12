import { useState } from "react";
import { Alert, Button, Chip, List, ListItemButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { Erro } from "../../components/Erro";
import { FiltroAtivo } from "../../components/FiltroAtivo";
import { Foto } from "../../components/Foto";
import { usePaginado } from "../../hooks/useApi";

export function Recursos() {
  const [ativo, setAtivo] = useState("");
  const recursos = usePaginado(ativo ? `/recursos/?ativo=${ativo}` : "/recursos/");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <h2 className="me-auto mb-0">Barbeiros</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Button
          component={Link}
          to="/admin/recursos/novo"
          variant="contained"
          sx={{ textTransform: "none", display: "inline-flex", alignItems: "center" }}>
          <AddIcon fontSize="small" sx={{ mr: 0.5 }} /> Novo barbeiro
        </Button>
      </div>

      {recursos.erro && <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />}
      {!recursos.carregando && !recursos.erro && recursos.itens.length === 0 && (
        <Alert severity="info">Cadastre o primeiro barbeiro.</Alert>
      )}
      <List disablePadding>
        {recursos.itens.map((recurso) => (
          <ListItemButton
            key={recurso.id}
            component={Link}
            to={`/admin/recursos/${recurso.id}`}
            className="d-flex align-items-center gap-3">
            <Foto src={recurso.foto} tamanho={48} />
            <div className="me-auto">
              <div className="fw-semibold">{recurso.nome}</div>
              <small className="text-secondary">Capacidade: {recurso.capacidade}</small>
            </div>
            {recurso.ativo ? <Chip label="Ativo" color="success" /> : <Chip label="Inativo" color="default" />}
          </ListItemButton>
        ))}
      </List>
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  );
}

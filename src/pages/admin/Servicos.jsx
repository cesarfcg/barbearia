import { useState } from "react";
import { Image } from "react-bootstrap";
import { Alert, Button, Chip, List, ListItemButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { Carregando } from "../../components/Carregando";
import { CarregarMais } from "../../components/CarregarMais";
import { Erro } from "../../components/Erro";
import { FiltroAtivo } from "../../components/FiltroAtivo";
import { formatarPreco } from "../../formatos";
import { usePaginado } from "../../hooks/useApi";
import ContentCutIcon from "@mui/icons-material/ContentCut";

export function Servicos() {
  const [ativo, setAtivo] = useState("");
  const servicos = usePaginado(ativo ? `/servicos/?ativo=${ativo}` : "/servicos/");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <h2 className="me-auto mb-0">Serviços</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Button
          component={Link}
          to="/admin/servicos/novo"
          variant="contained"
          sx={{ textTransform: "none" }}
          className="d-flex align-items-center gap-2">
          <AddIcon fontSize="small" />
          Novo serviço
        </Button>
      </div>

      {servicos.erro && <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />}
      {!servicos.carregando && !servicos.erro && servicos.itens.length === 0 && (
        <Alert severity="info">Cadastre o primeiro serviço.</Alert>
      )}
      <List disablePadding>
        {servicos.itens.map((servico) => (
          <ListItemButton
            key={servico.id}
            component={Link}
            to={`/admin/servicos/${servico.id}`}
            className="d-flex align-items-center gap-3">
            {servico.imagem ? (
              <Image src={servico.imagem} width={64} rounded />
            ) : (
              <ContentCutIcon className="fs-2 text-secondary" />
            )}
            <div className="me-auto">
              <div className="fw-semibold">{servico.nome}</div>
              <small className="text-secondary">
                {servico.duracao_min} min · {formatarPreco(servico.preco)}
              </small>
            </div>
            {servico.ativo ? <Chip label="Ativo" color="success" /> : <Chip label="Inativo" color="default" />}
          </ListItemButton>
        ))}
      </List>
      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  );
}

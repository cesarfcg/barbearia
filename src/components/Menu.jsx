import { useState } from "react";
import { Button, Divider, IconButton, Menu as MuiMenu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Foto } from "./Foto";

export function Menu() {
  const { usuario, pode, inicio, sair } = useAuth();
  const organizacao = usuario.organizacao;
  const [cadastrosAnchor, setCadastrosAnchor] = useState(null);
  const [usuarioAnchor, setUsuarioAnchor] = useState(null);

  const fecharMenus = () => {
    setCadastrosAnchor(null);
    setUsuarioAnchor(null);
  };

  return (
    <Navbar expand="lg" bg="black" data-bs-theme="dark" className="p-3">
      <Container>
        <Navbar.Brand as={Link} to={inicio} className="d-flex align-items-center">
          <Image src={organizacao.logo || "/favicon.png"} height={40} className="me-2" />
          {organizacao.nome}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" />
        <Navbar.Collapse id="menu">
          {pode("api.change_organizacao") ? (
            <Nav className="m-auto gap-4">
              <Nav.Link as={NavLink} to="/admin/agenda">
                Agenda
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/confirmar">
                A confirmar
              </Nav.Link>
              <Button
                aria-haspopup="true"
                aria-expanded={cadastrosAnchor ? "true" : undefined}
                onClick={(event) => setCadastrosAnchor(event.currentTarget)}
                className="d-flex align-items-center gap-2"
                sx={{
                  textTransform: "none",
                  color: "var(--bs-nav-link-color)",
                  minHeight: 40,
                  padding: "0.5rem 0rem",
                }}>
                Cadastros
                <ExpandMoreIcon />
              </Button>
              <MuiMenu anchorEl={cadastrosAnchor} open={Boolean(cadastrosAnchor)} onClose={fecharMenus}>
                <MenuItem component={Link} to="/admin/negocio" onClick={fecharMenus}>
                  Dados do negócio
                </MenuItem>
                <MenuItem component={Link} to="/admin/recursos" onClick={fecharMenus}>
                  Barbeiros
                </MenuItem>
                <MenuItem component={Link} to="/admin/servicos" onClick={fecharMenus}>
                  Serviços
                </MenuItem>
              </MuiMenu>
              <Nav.Link as={NavLink} to="/admin/avaliacoes">
                Avaliações
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/inicio">
                Início
              </Nav.Link>
              {pode("api.add_agendamento") && (
                <Nav.Link as={NavLink} to="/agendar">
                  Agendar
                </Nav.Link>
              )}
              <Nav.Link as={NavLink} to="/horarios">
                Meus horários
              </Nav.Link>
              <Nav.Link as={NavLink} to="/barbeiros">
                Barbeiros
              </Nav.Link>
            </Nav>
          )}
          <Nav>
            <IconButton
              color="inherit"
              aria-label="Abrir menu do usuário"
              aria-haspopup="true"
              aria-expanded={usuarioAnchor ? "true" : undefined}
              onClick={(event) => setUsuarioAnchor(event.currentTarget)}
              sx={{ p: 0 }}>
              <Foto src={usuario.foto} tamanho={40} />
            </IconButton>
            <MuiMenu
              anchorEl={usuarioAnchor}
              open={Boolean(usuarioAnchor)}
              onClose={fecharMenus}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}>
              <MenuItem component={Link} to="/perfil" onClick={fecharMenus}>
                Meu perfil
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  fecharMenus();
                  sair();
                }}>
                <LogoutIcon fontSize="small" sx={{ mr: 0.5 }} /> Sair
              </MenuItem>
            </MuiMenu>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

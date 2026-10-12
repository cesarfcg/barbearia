import { Button } from "@mui/material";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export function Entrada() {
  return (
    <div className="text-center">
      <Image src={logo} alt="Barbearia" fluid className="mb-4" />
      <p className="text-secondary">Cortes, barba e cuidados para você sair no seu melhor estilo.</p>
      <div className="d-grid gap-2 mt-4">
        <Button component={Link} to="/login" type="button" variant="contained">
          Entrar
        </Button>
        <Button component={Link} to="/cadastro" type="button" variant="outlined">
          Criar conta
        </Button>
      </div>
    </div>
  );
}

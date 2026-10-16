import "./LandingPage.scss";
import { Link } from "react-router-dom";
import { Menu } from "../components/Menu";

export function LandingPage() {
  return (
    <main className="landing">
      <Menu />

      <section className="landing__hero" id="inicio">
        <div className="landing__content">
          <p className="landing__eyebrow">
            TRADIÇÃO — ESTILO — EXCELÊNCIA
          </p>

          <h1>
            A Tradição de
            <br />
            <span className="landing__title-white">
              Cuidar de Você.
            </span>
            <br />
            <span className="landing__title-secondary">
              Seu Estilo,
              <br />
              Sua Identidade.
            </span>
          </h1>

          <p className="landing__description">
            Mais que um corte, uma experiência.
            Descubra o cuidado e o estilo que você merece.
          </p>

          <div className="landing__actions">
            <Link
              to="/login"
              className="landing__button"
            >
              AGENDAR AGORA
            </Link>
          </div>
        </div>

        <div className="landing__stats">
          <div>
            <strong>4.9 ★</strong>
            <span>AVALIAÇÃO DOS CLIENTES</span>
          </div>

          <div>
            <strong>+18</strong>
            <span>ANOS DE TRADIÇÃO</span>
          </div>

          <div>
            <strong>15</strong>
            <span>PROFISSIONAIS</span>
          </div>

          <div>
            <strong>VIP</strong>
            <span>ATENDIMENTO ESPECIAL</span>
          </div>
        </div>
      </section>
    </main>
  );
}

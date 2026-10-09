import { Tab, Tabs } from "react-bootstrap";
import { ListaHorarios } from "../components/ListaHorarios";
import { hoje, somarDias } from "../formatos";

export function MeusHorarios() {
  return (
    <>
      <h2 className="mb-4">Meus horários</h2>
      <Tabs defaultActiveKey="proximos" className="mb-3" mountOnEnter>
        <Tab eventKey="proximos" title="Próximos">
          <ListaHorarios caminho={`/agendamentos/?data_inicio=${hoje()}`} />
        </Tab>
        <Tab eventKey="historico" title="Histórico">
          <ListaHorarios caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} />
        </Tab>
      </Tabs>
    </>
  );
}

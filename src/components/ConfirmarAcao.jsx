import { Confirmacao } from "./Confirmacao";

const ACOES = {
  confirmar: { titulo: "Confirmar horário", mensagem: "Deseja confirmar este horário?", variante: "success" },
  concluir: { titulo: "Concluir atendimento", mensagem: "Deseja marcar este atendimento como concluído?", variante: "success" },
  cancelar: { titulo: "Cancelar horário", mensagem: "Deseja mesmo cancelar este horário?", variante: "danger" },
};

export function ConfirmarAcao({ acao, onConfirmar, onFechar }) {
  const { titulo, mensagem, variante } = ACOES[acao] ?? ACOES.confirmar;

  return (
    <Confirmacao
      show={acao !== null}
      titulo={titulo}
      mensagem={mensagem}
      textoConfirmar={titulo}
      variante={variante}
      onConfirmar={onConfirmar}
      onFechar={onFechar}
    />
  );
}

# Barbearia

Sistema web para agendamento de serviços de barbearia, desenvolvido com React e integrado a uma API REST.

## Tecnologias

- React
- Vite
- React Bootstrap
- React Router
- API REST

## Funcionalidades

- Cadastro e autenticação de usuários;
- Agendamento de serviços;
- Escolha de barbeiros, datas e horários;
- Consulta e cancelamento de agendamentos;
- Avaliação dos serviços;
- Painel administrativo para gerenciar serviços, horários e agenda.

## Como executar

Clone o repositório e instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` com as variáveis necessárias:

```env
VITE_API_URL=https://agendamentos.spaincentral.cloudapp.azure.com/api
VITE_ORGANIZACAO=barbearia
```

Inicie o projeto:

```bash
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Documentação da API

[Swagger — API de Agendamentos](https://agendamentos.spaincentral.cloudapp.azure.com/api/docs/)

## Aplicação online

[barbearia-pos-psi.vercel.app](https://barbearia-pos-psi.vercel.app/)


Este projeto foi desenvolvido a partir do repositório de exemplo [**dvcirilo-ifrn/pos-escola-de-musica-web**](https://github.com/dvcirilo-ifrn/pos-escola-de-musica-web), adaptado para o domínio de agendamento de serviços de barbearia.

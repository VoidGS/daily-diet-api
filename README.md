# Daily Diet API

A Daily Diet API é uma API de dieta desenvolvida em Node.js com o framework Fastify. Ela foi criada como um projeto de desafio do curso de Node.js da Rocketseat, com o objetivo de fornecer um controle maior sobre suas refeições.

## Instalação

1. Clone o repositório: `git clone https://github.com/VoidGS/daily-diet-api.git`
2. Crie um arquivo `.env` e siga o exemplo do `.env.example` para definir as variáveis de ambiente
3. Instale as dependências: `npm install`
4. Execute a API: `npm run dev`

## Regras da aplicação

1. Deve ser possível criar um usuário
2. Deve ser possível identificar o usuário entre as requisições
3. Deve ser possível registrar uma refeição feita, com as seguintes informações:  
	(_As refeições devem ser relacionadas a um usuário._)
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
4. Deve ser possível editar uma refeição, podendo alterar todos os dados acima
5. Deve ser possível apagar uma refeição
6. Deve ser possível listar todas as refeições de um usuário
7. Deve ser possível visualizar uma única refeição
8. Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
9. O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

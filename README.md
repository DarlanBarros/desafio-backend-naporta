Para subir o banco rodar: docker compose up -d


## Requisitos funcionais
- [] Deve ser possível se autenticar;
- [x] Deve ser possível criar um pedido;
- [] Deve ser possível listar pedidos;
- [] Deve ser possível filtrar pedidos por número, período(data inicial e final), status;
- [] Deve ser possível editar pedido;
- [] Deve ser possível excluir pedido;

## Regras de negócio
- [] O usuário não deve poder realizar operações sem estar autenticado;
- [x] Não deve ser possível cadastrar um pedido sem um cliente;
- [x] Não deve ser possível cadastrar um pedido sem itens;

## Requisitos Não funcionais 
- [] A senha do usuário precisa estar criptografada;
- [x] Os dados do usuário precisam estar persistidos em um banco PostGreSQL;
- [] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [] O usuário deve ser identificado por um JWT (JSON Web Token);

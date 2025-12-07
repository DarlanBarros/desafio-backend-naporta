# 📦 naPorta API

API REST desenvolvida em Node.js para o desafio técnico da **naPorta**, responsável pelo gerenciamento de pedidos.

O projeto utiliza **Fastify** ao invés de NestJS ou Express, visando uma stack mais simples e performática. O NestJS não foi adotado pois ainda estou em processo de aprendizado da ferramenta.

---

## 🛠 Tecnologias

- Node.js + TypeScript  
- **Fastify**  
- Prisma ORM  
- PostgreSQL  
- JWT (autenticação)  
- Docker / Docker Compose  
- Zod (validação)  
- Vitest (testes)

---

## 🔐 Autenticação

Autenticação feita via **JWT**.  
Envie o token no header:

```
Authorization: Bearer <token>
```
---

## ▶️ Executando o projeto

```bash
# Subir o banco
docker compose up -d

# Instalar dependências
npm install

# Rodar migrations
npx prisma migrate dev

# Popular o banco com dados fictícios
npm run seed

# Iniciar a API
npm run start:dev
```

API disponível em:  
http://localhost:3333

---

## 🧪 Testes
Unitários:
npm run test

E2E:
npm run test:e2e

---
## ✅ Funcionalidades

- Autenticação
- Criar pedido
- Listar pedidos
- Filtrar por número, período e status
- Editar pedido
- Excluir pedido (exclusão lógica)

---

## 📄 Estrutura do Pedido

- Id  
- Número do pedido  
- Previsão de entrega  
- Cliente (nome, documento)  
- Endereço de entrega  
- Items (descrição e preço)  
- Data de criação  

---

## 📋 Requisitos

### Funcionais
- [x] Autenticação
- [x] CRUD de pedidos
- [x] Filtros de listagem

### Regras de Negócio
- [x] Operações exigem autenticação
- [x] Pedido precisa ter cliente
- [x] Pedido precisa ter itens
- [x] Deve ser possível excluir pedido (exclusão lógica)

### Não funcionais
- [x] Senhas criptografadas
- [x] Persistência em PostgreSQL
- [ ] Paginação de listas (pendente)
- [x] JWT

---

## 🎁 Bônus

- ✅ Clean Code
- ✅ Testes automatizados
- ✅ Docker
- ✅ Linter
- ⏳ Serverless (não implementado)

---

## 👨‍💻 Autor

Darlan Barros – Desafio Técnico naPorta
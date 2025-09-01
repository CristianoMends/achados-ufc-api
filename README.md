# Achados e Perdidos - UFC API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  API RESTful desenvolvida com <strong>NestJS</strong> para um sistema de "Achados e Perdidos" na Universidade Federal do Ceará (UFC).
</p>

<p align="center">
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/TypeORM-E8225A?style=for-the-badge" alt="TypeORM"/>
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

---

## 🎯 Sobre o Projeto

A **Achados e Perdidos - UFC API** é o backend de um sistema projetado para ajudar a comunidade acadêmica a encontrar e devolver itens perdidos dentro do campus. A aplicação permite que usuários se cadastrem, publiquem itens que encontraram e pesquisem por itens que perderam.

O projeto foi construído utilizando as melhores práticas de desenvolvimento, com uma arquitetura modular e escalável, pronta para ser consumida por qualquer cliente (web ou mobile).

## ✨ Principais Funcionalidades

* **Autenticação de Usuários**:
    * Cadastro de novos usuários com e-mail e senha (com hash de senha usando `bcrypt`).
    * Login tradicional (e-mail e senha).
    * Login social integrado com o **Google**, utilizando `google-auth-library`.
    * Proteção de rotas com **JWT (JSON Web Tokens)**.
* **Gerenciamento de Itens**:
    * `POST /items`: Criação de um novo item (achado ou perdido) com upload de imagem.
    * `GET /items`: Listagem de todos os itens cadastrados, ordenados por data.
    * `GET /items/:id`: Busca de um item específico pelo seu ID.
    * `DELETE /items/:id`: Remoção de um item (requer autenticação).
* **Gerenciamento de Usuários**:
    * `GET /users`: Lista todos os usuários.
    * `GET /users/search`: Busca um usuário pelo e-mail.
    * `GET /users/:username`: Busca um usuário pelo seu nome de usuário.
* **Upload de Arquivos**:
    * Sistema flexível de upload de imagens com suporte a diferentes estratégias (local ou Vercel Blob Storage).
    * Validação de tipo de arquivo (apenas imagens) e tamanho (máximo de 3MB).

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **Backend**:
    * **[NestJS](https://nestjs.com/)**: Um framework Node.js progressivo para construir aplicações eficientes e escaláveis.
    * **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
* **Banco de Dados**:
    * **[PostgreSQL](https://www.postgresql.org/)**: Um poderoso banco de dados relacional de código aberto.
    * **[TypeORM](https://typeorm.io/)**: Um ORM (Object-Relational Mapper) para TypeScript e JavaScript.
* **Autenticação e Segurança**:
    * **[JWT](https://jwt.io/)**: Para criação de tokens de acesso seguros.
    * **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)**: Para hashing de senhas.
* **Upload de Arquivos**:
    * **[@vercel/blob](https://vercel.com/docs/storage/blob)**: Para armazenamento de arquivos na nuvem da Vercel (configurável).
* **Deploy**:
    * Configurado para deploy na **[Vercel](https://vercel.com/)**.

## ⚙️ Configuração do Ambiente

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [pnpm](https://pnpm.io/) (ou npm/yarn)
* Uma instância do PostgreSQL rodando.

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/cristianomends/achados-ufc-api.git](https://github.com/cristianomends/achados-ufc-api.git)
    cd achados-ufc-api
    ```

2.  Instale as dependências:
    ```bash
    pnpm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` (se houver) e preencha as variáveis de ambiente:
    ```env

    NODE_ENV="Production"
    
    # URL de conexão com o banco de dados
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Segredo para o JWT
    JWT_SECRET="SEU_SEGREDO_AQUI"

    # Credenciais do Google para o login social
    GOOGLE_CLIENT_ID="SEU_CLIENT_ID_DO_GOOGLE"

    # Estratégia de Upload ('local' ou 'vercel')
    UPLOAD_STRATEGY="local"

    #chave de acesso do vercel blob
    BLOB_READ_WRITE_TOKEN=vercel_blob_hash_id
    ```

### Rodando a Aplicação

```bash
# Modo de desenvolvimento (com watch)
pnpm run start:dev

# Modo de produção
pnpm run start:prod

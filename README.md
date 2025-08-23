# api-curiosidade

API criada com Node.Js para o projeto Operação Curiosidade.
Escolhi o Express como framework para a API, assim como o Sequelize como ORM para comunicação com o banco (SQL Server).
Autenticação feita com JWT e bcrypt para criptografia de senhas. Agora, fora os requests de cadastro e login, todos precisam do header do token bearer, retornado pelo endpoint de login.

## Testes com Bruno/Postman

Incluído no repositório está a pasta collection, com a coleção de endpoints para testes no Bruno ou no Postman - basta importar o arquivo .json correto.

## Requisitos

É necessário possuir o **Node.js** versão 18 ou superior, assim como uma instância do **SQL Server** para a criação da base.

## Instalação

Para rodar localmente, primeiro clone o repositório:

   ```sh
   git clone https://github.com/hugoanjos/api-curiosidade.git
   cd api-curiosidade
   ```

Instale as dependências:

   ```sh
   npm install
   ```

Também é necessário configurar o ambiente. Para isso, crie a database `OperacaoCuriosidadeDb` no SQL Server:

```sql
CREATE DATABASE OperacaoCuriosidadeDb;
```

Com isso, crie um arquivo `.env` com base no arquivo `.env.example`, adicionando sua string de conexão com a base criada e a chave secreta para autenticação JWT.

## Execução

Para rodar em modo de desenvolvimento:

   ```sh
   npm run dev
   ```

E em modo de produção:

   ```sh
   npm start
   ```

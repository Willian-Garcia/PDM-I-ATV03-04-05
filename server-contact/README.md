# Atividade - Servidor

A aplicação possui um servidor usado para persitir dados de contatos na tabela _contacts_ do _dblocation_ do SQLite.

A tabela _contacts_ possui os seguintes campos:
```
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY,
    name TEXT,
    latitude REAL,
    longitude REAL,
    address TEXT
)
```

### Instruções de uso

Utilize os comandos a seguir para clonar o repositório e subir o serviço na porta _3011_.
1. Crie uma pasta no local de sua preferência do computador;
2. Abra essa pasta no CMD (prompt de comando) e digite o comando a seguir para baixar o projeto no seu computador: 
```
git clone https://github.com/arleysouza/server-contact.git server
cd server
```
3. Comandos para subir o servidor:
```
npm run dev
ou
npm start
```

### Endpoints

A aplicação responde nos endpoints:
- HTTP GET http://localhost:3011/ para retornar todos os registros da tabela _contacts_;
- HTTP POST http://localhost:3011/ para inserir um registro na tabela _contacts_. Recebe pelo _body_ um objeto `{name, latitude, longitude, address}`, como parâmetro;
- HTTP DELETE http://localhost:3011/get?id=5 para excluir o registro que possui o _id_ fornecido como parâmetro na URL;
- HTTP PUT http://localhost:3011 para atualizar um registro na tabela _contacts_. Recebe pelo _body_ um objeto `{id, name, latitude, longitude, address}`, como parâmetro;


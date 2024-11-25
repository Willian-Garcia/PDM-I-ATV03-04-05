import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();

const db_name = process.env.DB_NAME || "db.sqlite";

export function initDB() {
  // Abre ou cria o banco de dados
  return new sqlite3.Database(db_name);
}

// Função para criar a tabela
export async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      name TEXT,
      latitude REAL,
      longitude REAL,
      address TEXT
    )
  `;

  const db = initDB();
  db.run(query, (err) => {
    if (err) {
      console.error("Erro ao criar a tabela", err.message);
    } else {
      console.log('Tabela "contacts" criada ou já existe');
    }
  });
}

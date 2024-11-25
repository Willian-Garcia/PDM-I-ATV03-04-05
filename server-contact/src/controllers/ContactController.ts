import { Request, Response } from "express";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();

interface Contact {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

class ContactsController {
  private db_name = process.env.DB_NAME || "db.sqlite";
  private db: sqlite3.Database;

  constructor() {
    // Conecta ao banco de dados SQLite
    this.db = new sqlite3.Database(this.db_name, (err) => {
      if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
      } else {
        console.log("Conectado ao banco de dados SQLite.");
        this.createTable();
      }
    });
  }

  // Método para criar a tabela, caso ainda não exista
  createTable(): void {
    const sql = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY,
        name TEXT,
        latitude REAL,
        longitude REAL,
        address TEXT
      )
    `;
    this.db.run(sql, (err: Error | null) => {
      if (err) {
        console.error("Erro ao criar tabela:", err.message);
      } else {
        console.log("Tabela contacts criada com sucesso.");
      }
    });
  }

  // Inserir novo contato
  create = (req: Request, res: Response): void => {
    const { name, latitude, longitude, address } = req.body;

    // Verificação dos campos obrigatórios
    if (
      !name ||
      latitude === undefined ||
      longitude === undefined ||
      !address
    ) {
      res
        .status(400)
        .json({
          error:
            "Todos os campos 'name', 'latitude', 'longitude' e 'address' são obrigatórios",
        });
    }
    else{
      const sql = `
        INSERT INTO contacts (name, latitude, longitude, address)
        VALUES (?, ?, ?, ?)
      `;
      try{
        this.db.run(sql, [name, latitude, longitude, address], function (err:Error | null) {
          if (err) {
            res.json({ error: err.message });
          } else {
            res.json({ id: this.lastID, name, latitude, longitude, address});
          }
        });
      } catch (e: any) {
        res.json({ error: e.message });
      }
    }
  }

  // Listar todos os contatos
  getAll = (_: Request, res: Response): void => {
    const sql = `SELECT * FROM contacts ORDER BY name`;
    try {
      this.db.all(sql, [], (err: Error | null, rows: Contact[]) => {
        if (err) {
          res
            .status(500)
            .json({ error: `Erro ao buscar contatos: ${err.message}` });
        } else {
          res.json(rows);
        }
      });
    } catch (e: any) {
      res.json({ error: e.message });
    }
  };

  // Atualizar um contato por ID
  update = (req: Request, res: Response): void => {
    const { id, name, latitude, longitude, address } = req.body;

    const sql = `
      UPDATE contacts
      SET name = ?, latitude = ?, longitude = ?, address = ?
      WHERE id = ?
    `;

    this.db.run(
      sql,
      [name, latitude, longitude, address, id],
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          res
            .status(500)
            .json({ error: `Erro ao atualizar contato: ${err.message}` });
        } else if (this.changes === 0) {
          res.status(404).json({ message: "Contato não encontrado" });
        } else {
          res.json({ changes: this.changes });
        }
      }
    );
  };

  // Excluir um contato por ID
  remove = (req: Request, res: Response): void => {
    const id = req.query.id as string;
    const sql = `DELETE FROM contacts WHERE id = ?`;

    this.db.run(
      sql,
      [id],
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          res
            .status(500)
            .json({ error: `Erro ao excluir contato: ${err.message}` });
        } else if (this.changes === 0) {
          res.status(404).json({ message: "Contato não encontrado" });
        } else {
          res.json({ changes: this.changes });
        }
      }
    );
  };
}

const controller = new ContactsController();
export default controller;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/* ===================================== */
/* CONEXÃO COM O SQLITE */
/* ===================================== */

const db = new sqlite3.Database(
    path.join(__dirname, 'database.db'),
    (err) => {

        if (err) {

            console.error('Erro ao conectar ao banco:', err.message);

        } else {

            console.log('Banco SQLite conectado com sucesso.');

        }

    }
);

/* ===================================== */
/* TABELA DE USUÁRIOS */
/* ===================================== */

db.run(`

CREATE TABLE IF NOT EXISTS usuarios (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    usuario TEXT UNIQUE NOT NULL,

    senha TEXT NOT NULL,

    perfil TEXT NOT NULL,

    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);

/* ===================================== */
/* TABELA DE MACROS */
/* ===================================== */

db.run(`

CREATE TABLE IF NOT EXISTS macros (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    numero TEXT NOT NULL,

    equipe TEXT NOT NULL,

    descricao TEXT,

    total_us REAL DEFAULT 0,

    criado_por TEXT,

    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);

/* ===================================== */
/* TABELA DE ATIVIDADES */
/* ===================================== */

db.run(`

CREATE TABLE IF NOT EXISTS atividades (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    atividade TEXT NOT NULL,

    qtde_us REAL,

    aba TEXT

)

`);

/* ===================================== */
/* LIGAÇÃO ENTRE MACROS E ATIVIDADES */
/* ===================================== */

db.run(`

CREATE TABLE IF NOT EXISTS macro_atividades (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    macro_id INTEGER NOT NULL,

    atividade_id INTEGER NOT NULL,

    FOREIGN KEY (macro_id) REFERENCES macros(id),

    FOREIGN KEY (atividade_id) REFERENCES atividades(id)

)

`);

module.exports = db;
const sqlite3 = require('sqlite3').verbose();

const path = require('path');

/* ===================================== */
/* BANCO SQLITE */
/* ===================================== */

const dbPath = path.join(
    __dirname,
    'database.db'
);

const db = new sqlite3.Database(

    dbPath,

    (err) => {

        if (err) {

            console.log(
                'Erro ao conectar banco:',
                err.message
            );

        } else {

            console.log(
                'Banco SQLite conectado'
            );

        }

    }

);

/* ===================================== */
/* TABELA EXCEL */
/* ===================================== */

db.run(`

    CREATE TABLE IF NOT EXISTS excel_files (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nome TEXT NOT NULL,

        arquivo TEXT NOT NULL,

        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

    )

`);

/* ===================================== */
/* TABELA MACROS */
/* ===================================== */

db.run(`

    CREATE TABLE IF NOT EXISTS macros (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        numero TEXT NOT NULL,

        equipe TEXT NOT NULL,

        descricao TEXT NOT NULL,

        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

    )

`);

/* ===================================== */

module.exports = db;
const sqlite3 = require("sqlite3");

const database = new sqlite3.Database("./src/database/db_transactions.sqlite");

database.serialize(() => {
    database.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            public_id TEXT UNIQUE NOT NULL,
            description TEXT NOT NULL,
            amount INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
})

module.exports = database;
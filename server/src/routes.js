const express = require("express");

const { randomUUID } = require("node:crypto");

const database = require("./database/config");

const routes = express.Router();

routes.get("/transactions", (request, response) => {
    database.all(`
        SELECT 
            transactions.public_id, 
            transactions.description, 
            transactions.amount, 
            transactions.created_at
        FROM transactions;
    `, (error, transactions) => {
        if (error) {
            return response.status(500).json({ message: `${error}` });
        }

        if (transactions.length === 0) {
            return response.status(404).json({ message: "Nenhuma transação encontrada" });
        }
    
        return response.status(200).json([...transactions].reverse());
    })
})

routes.get("/transactions/:id", (request, response) => {
    const { id } = request.params;

    database.all(`
        SELECT 
            transactions.public_id, 
            transactions.description, 
            transactions.amount, 
            transactions.created_at
        FROM transactions
        WHERE transactions.public_id = ?;
    `, [id], (error, transaction) => {
        if (error) {
            return response.status(500).json({ message: `${error}` });
        }

        if (transaction.length === 0) {
            return response.status(404).json({ message: "Nenhuma transação encontrada" });
        }

        return response.status(200).json(transaction);
    })
})

routes.post("/transactions", (request, response) => {
    const { description, amount, created_at } = request.body;

    const newTransactionId = randomUUID();

    database.run(`
        INSERT INTO transactions (
            public_id,
            description,
            amount,
            created_at
        )
        VALUES (
            ?,
            ?,
            ?,
            ?
        );
    `, [newTransactionId, description, amount, created_at], (error, transaction) => {
        if (error) {
            return response.status(500).json({ message: `${error}` });
        }

        return response.status(201).json({ message: "Transação criada com sucesso", transaction: transaction });
    })
})

routes.put("/transactions/:id", (request, response) => {
    const { id } = request.params;

    const { description, amount, created_at } = request.body;

    database.run(`
        UPDATE transactions
            SET description = ?,
                amount = ?,
                created_at = ?
        WHERE transactions.public_id = ?;
    `, [description, amount, created_at, id], (error) => {
        if (error) {
            return response.status(500).json({ message: `${error}` });
        }

        return response.status(204).json();
    })
})

routes.delete("/transactions/:id", (request, response) => {
    const { id } = request.params;

    database.run(`
        DELETE FROM transactions
        WHERE transactions.public_id = ?
    `, [id], (error) => {
        if (error) {
            return response.status(500).json({ message: `${error}` });
        }

        return response.status(204).json();
    })
})

module.exports = routes;
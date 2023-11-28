const Modal = {
    open(isEdit) {
        document.querySelector(".modal-overlay").classList.add("active");

        if (isEdit) {
            document.querySelector("#form h2").textContent = "Editar transação";
            document.querySelector("#form button[type='submit']").textContent = "Atualizar";
        } 
        
        else {
            document.querySelector("#form h2").textContent = "Nova transação";
            document.querySelector("#form button[type='submit']").textContent = "Salvar";
        }
    },
    
    close() {
        document.querySelector(".modal-overlay").classList.remove("active");
    },

    async edit(id) {
        try {
            const response = await fetch(`http://localhost:3333/transactions/${id}`);
            const transaction = await response.json();

            Form.setEditTransaction(transaction[0], id);

            Modal.open(true);
        } 
        
        catch (error) {
            console.error('Erro ao carregar transação para edição:', error);
        }
    }
}

const Storage = {
    async get() {
        const response = await fetch(`http://localhost:3333/transactions`);
        const transactions = await response.json();

        return transactions;
    },
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        fetch(`http://localhost:3333/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transaction)
        })

        App.reload();
    },

    remove(id) {
        fetch(`http://localhost:3333/transactions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        
        App.reload();
    },

    edit(id) {
        App.setEditingTransaction(id);
        
        Modal.edit(id);
    },

    async editTransaction(id, updatedTransaction) {
        try {
            await fetch(`http://localhost:3333/transactions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTransaction)
            });

            App.reload();
        } 
        
        catch (error) {
            console.error('Erro ao editar a transação:', error);
        }
    },

    incomes(transactions) {
        let income = 0;

        transactions.forEach(transaction => {
            if (transaction.amount > 0) return income += transaction.amount;
        })

        return income;
    },

    expenses(transactions) {
        let expense = 0;

        transactions.forEach(transaction => {
            if (transaction.amount < 0) return expense += transaction.amount;
        })

        return expense;
    },

    total(transactions) {
        return Number(Transaction.incomes(transactions)) + Number(Transaction.expenses(transactions));
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.id = transaction["public_id"]; 

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction["amount"] > 0 ? "income" : "expense";
        const amountCurrency = Utils.formatCurrency(transaction["amount"]);

        const html = `
            <tr id="${transaction["public_id"]}">
                <td class="description">${transaction["description"]}</td>
                <td class="${CSSClass}">${amountCurrency}</td>
                <td class="date">${transaction["created_at"]}</td>
                <td>
                    <i onclick="Transaction.edit('${transaction["public_id"]}')" class="ph ph-pencil-line" alt="Editar transação" title="Editar transação"></i>
                    <i onclick="Transaction.remove('${transaction["public_id"]}')" class="ph ph-minus-circle" alt="Remover transação" title="Remover transação"></i>
                </td>
            </tr>
        `

        return html;
    },

    updateBalance(transactions) {
        document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes(transactions));
        document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses(transactions));
        document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total(transactions));
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#data"),
    
    editingIndex: null,

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    fillDateInput(date) {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        Form.date.value = formattedDate;
    },

    setEditTransaction(transaction, id) {
        Form.description.value = transaction["description"];
        Form.amount.value = transaction["amount"];
        Form.fillDateInput(transaction["created_at"]);
        Form.editingIndex = id;
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);
        
        return {
            description,
            amount,
            created_at: date
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") throw new Error(`Por favor! Preencha todos os campos!`);
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
        
        Form.editingIndex = null;
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();

            const transaction = Form.formatValues();

            if (Form.editingIndex !== null) {
                Transaction.editTransaction(Form.editingIndex, transaction);

                Form.editingIndex = null;
            } else {
                Transaction.add(transaction);
            }

            Form.clearFields();

            Modal.close();
        } 
        
        catch (error) {
            Form.description.focus();
            alert(error.message);
        }
    }
}

const Utils = {
    formatCurrency(value) {
        const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

        return currency;
    },

    formatAmount(value) {
        value = Number(value);

        return Math.round(value);
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    }
}

const App = {
    editingIndex: null,

    async init() {
        const transactions = await Transaction.all;

        transactions.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        })

        DOM.updateBalance(transactions);
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    },

    setEditingTransaction(index) {
        App.editingIndex = index;
    }
}

App.init();
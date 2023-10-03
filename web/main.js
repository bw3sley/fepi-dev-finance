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

    edit(index) {
        const transaction = Transaction.all[index];
        Form.setEditTransaction(transaction, index);
        Modal.open(true);
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);
        
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        
        App.reload();
    },

    edit(index) {
        App.setEditingTransaction(index);
        
        Modal.edit(index);
    },

    editTransaction(index, editedTransaction) {
        if (index >= 0 && index < Transaction.all.length) {
            Transaction.all[index] = editedTransaction;

            App.reload();
        }
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) return income += transaction.amount;
        })

        return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) return expense += transaction.amount;
        })

        return expense;
    },

    total() {
        return Number(Transaction.incomes()) + Number(Transaction.expenses());
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index; 

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense";
        const amountCurrency = Utils.formatCurrency(transaction.amount);

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amountCurrency}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <i onclick="Transaction.edit(${index})" class="ph ph-pencil-line" alt="Editar transação" title="Editar transação"></i>
            <i onclick="Transaction.remove(${index})" class="ph ph-minus-circle" alt="Remover transação" title="Remover transação"></i>
            </td>
        </tr>
        `

        return html;
    },

    updateBalance() {
        document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
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

    setEditTransaction(transaction, index) {
        Form.description.value = transaction.description;
        Form.amount.value = transaction.amount;
        Form.fillDateInput(transaction.date);
        Form.editingIndex = index;
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);
        
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
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
            } 
            
            else {
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

    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        })

        DOM.updateBalance();
        Storage.set(Transaction.all);
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
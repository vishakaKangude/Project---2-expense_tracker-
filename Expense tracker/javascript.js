const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const category = document.getElementById("category").value;

    if (!date || !description || !amount || !category) {
        alert("Please fill all the fields.");
        return;
    }

    const transaction = {
        id: Date.now(),
        date,
        description,
        amount: parseFloat(amount),
        category,
        type: category === "Income" ? "income" : "expense",
    };

    transactions.push(transaction);
    updateLocalStorage();
    renderTransactions();
    form.reset();
}

function deleteTransaction(id) {
    transactions = transactions.filter((t) => t.id !== id);
    updateLocalStorage();
    renderTransactions();
}

function renderTransactions() {
    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
        const item = document.createElement("li");
        item.classList.add("transaction", tx.type);
        const sign = tx.type === "income" ? "+" : "-";

        item.innerHTML = `
        <div class="details">
            <strong>${tx.description}</strong><br>
            <small>${tx.date} • ${tx.category}</small>
        </div>
        <div class="amount">
            ${sign}₹${Math.abs(tx.amount).toFixed(2)}
            <button class="delete-btn" onclick="deleteTransaction(${tx.id})">×</button>
        </div>
    
        `;

        list.appendChild(item);

        if (tx.type === "income") {
            income += tx.amount;
        } else {
            expense += tx.amount;
        }
    });

    balanceEl.textContent = (income - expense).toFixed(2);
    incomeEl.textContent = income.toFixed(2);
    expenseEl.textContent = expense.toFixed(2);
}

form.addEventListener("submit", addTransaction);

renderTransactions();

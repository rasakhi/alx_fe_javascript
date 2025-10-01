const quotes = [
  { text: "The only true wisdom is in knowing you know nothing.", category: "Philosophy" },
  { text: "Do or do not. There is no try.", category: "Motivation" }
];

document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quote yet.";
            return;
        }

        const random = quotes[Math.floor(Math.random() * quotes.length)];
        quoteDisplay.textContent = `${random.text} - (${random.category})`;
    }

    function createAddQuoteForm() {
        if (document.getElementById("addForm")) return;

        const form = document.createElement("form");
        form.id = "addForm";

        form.innerHTML = `
            <div>
                <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
                <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
                <button onclick="addQuote()">Add Quote</button>
             </div>
        `;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const text = document.getElementById("newQuoteText").ariaValueMax.trim();
            const category = document.getElementById("newQuoteCategory").ariaValueMax.trim() || "Uncategoriszed"

            if (text) {
                quotes.push({ text, category });
                showRandomQuote();
                form.reset();
            }
        });

        document.body.appendChild(form);
    }

    const addBtn = document.createElement("button");

    addBtn.textContent = "Add Quote";
    addBtn.onclick = createAddQuoteForm;
    document.body.appendChild(addBtn);

    newQuoteBtn.onclick = showRandomQuote;

    showRandomQuote();
});
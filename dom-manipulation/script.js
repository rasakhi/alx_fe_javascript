const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only true wisdom is in knowing you know nothing.", category: "Philosophy" },
  { text: "Do or do not. There is no try.", category: "Motivation" }
];

document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // Function that saves quote to local storage

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quote yet.";
            return;
        }

        const random = quotes[Math.floor(Math.random() * quotes.length)];
        quoteDisplay.textContent = `${random.text} - (${random.category})`;

        sessionStorage.setItem("lastQuote", JSON.stringify(random));
    }

    if (sessionStorage.getItem("lastQuote")) {
        const last = JSON.parse(sessionStorage.getItem("lastQuote"));
        quoteDisplay.textContent = `${last.text} - (${last.category})`;
    } else {
        showRandomQuote();
    }

    function createAddQuoteForm() {
        if (document.getElementById("addForm")) return;

        const form = document.createElement("form");
        form.id = "addForm";

        form.innerHTML = `
            <div>
                <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
                <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
                <button type="submit">Add Quote</button>
             </div>
        `;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const text = document.getElementById("newQuoteText").value.trim();
            const category = document.getElementById("newQuoteCategory").value.trim() || "Uncategorized"

            if (text) {
                quotes.push({ text, category });
                saveQuotes();
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

    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export Quotes";
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    document.body.appendChild(exportBtn);

    function impotFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert('Quotes imported successfully!');
                    showRandomQuote();
                } else {
                    alert('Invalid JSON format.');
                }
            } catch {
                alert('Error reading JSON file.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = "application/json";
    importInput.addEventListener("change", impotFromJsonFile);
    document.body,appendChild(importInput);
});
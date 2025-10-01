const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only true wisdom is in knowing you know nothing.", category: "Philosophy" },
  { text: "Do or do not. There is no try.", category: "Motivation" }
];

document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

    // Function that saves quote to local storage

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        let filtered = quotes;
        const selectedCategory = categoryFilter.value;

        if (selectedCategory !== "all") {
            filtered = quotes.filter(q => q.category === selectedCategory);
        }

        if (filtered.length === 0) {
            quoteDisplay.textContent = "No quotes in this category.";
            return;
        }

        const random = filtered[Math.floor(Math.random() * filtered.length)];
        quoteDisplay.textContent = `${random.text} - (${random.category})`;

        sessionStorage.setItem("lastQuote", JSON.stringify(random));
    }

    if (sessionStorage.getItem("lastQuote")) {
        const last = JSON.parse(sessionStorage.getItem("lastQuote"));
        quoteDisplay.textContent = `${last.text} - (${last.category})`;
    } else {
        showRandomQuote();
    }

    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        const categories = [...new Set(quotes.map(q => q.category))];

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        const lastFilter = localStorage.getItem("lastFilter");
        if (lastFilter) {
            categoryFilter.value = lastFilter;
        }
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("lastFilter", selectedCategory);
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
                populateCategories();
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
    categoryFilter.onchange = filterQuotes;

    const exportBtn = document.getElementById("exportQuotes");
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    populateCategories();
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
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);

    async function fetchQuotesFromServer() {
        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
            const data = await res.json();

            return data.map(item => ({
                text: item.title,
                category: "Server"
            }));
        } catch (error) {
            console.error("Failed to fetch server quotes:", error);
            return [];
        }
    }

    async function syncQuoteWithServer() {
        const serverQuotes = await fetchQuotesFromServer();
        if (serverQuotes.length === 0) return;
        
        const mergedQuotes = [...serverQuotes];

        quotes.forEach(localQ => {
            if (!serverQuotes.some(sq => sq.text === localQ.text && sq.category === localQ.category)) {
                mergedQuotes.push(localQ);
            }
        });

        quotes.length = 0;
        quotes.push(...mergedQuotes);
        saveQuotes();

        populateCategories();
        filterQuotes();

        alert("Quotes synced with server (server data takes priority).");
    }

    const syncBtn = document.createElement("button");
    syncBtn.textContent = "Sync with Server";
    syncBtn.onclick = syncQuoteWithServer;
    document.body.appendChild(syncBtn);

    populateCategories();
    filterQuotes();

    setInterval(syncQuoteWithServer, 60000);
    
});
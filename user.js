// Load from LocalStorage
let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];

// DOM Elements
const list = document.getElementById("opportunityList");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

// DISPLAY CARDS
function displayOpportunities(data) {
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "<p>No opportunities found</p>";
        return;
    }

    data.forEach(op => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <span class="badge">${op.category}</span>
            <h3>${op.title}</h3>
            <p>${op.description}</p>
            <a href="${op.link}" target="_blank">Apply Now 🚀</a>
        `;

        list.appendChild(card);
    });
}

// SEARCH + FILTER
function filterData() {
    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value.toLowerCase();

    const filtered = opportunities.filter(op => {
        const matchesSearch = op.title.toLowerCase().includes(searchValue);

        const matchesFilter =
            filterValue === "all" ||
            op.category.toLowerCase().includes(filterValue);

        return matchesSearch && matchesFilter;
    });

    displayOpportunities(filtered);
}

// EVENTS
searchInput.addEventListener("input", filterData);
filterSelect.addEventListener("change", filterData);

// INITIAL LOAD
displayOpportunities(opportunities);
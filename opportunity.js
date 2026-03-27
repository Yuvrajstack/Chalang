// Load data from LocalStorage
let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];

// Run after page loads
window.onload = function () {
    renderOpportunities();

    // Search + Filter listeners
    document.getElementById("searchInput").addEventListener("input", renderOpportunities);
    document.getElementById("filterCategory").addEventListener("change", renderOpportunities);
};

// ➕ ADD OPPORTUNITY
function addOpportunity() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const link = document.getElementById("link").value.trim();
    const description = document.getElementById("description").value.trim();

    // Validation
    if (!title || !category || !link || !description) {
        alert("Please fill all fields!");
        return;
    }

    const opportunity = {
        id: Date.now(),
        title,
        category,
        link,
        description
    };

    opportunities.push(opportunity);
    saveData();
    renderOpportunities();
    clearForm();
}

// 📋 RENDER OPPORTUNITIES
function renderOpportunities() {
    const list = document.getElementById("opportunityList");
    const template = document.getElementById("cardTemplate");

    list.innerHTML = "";

    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const filterCategory = document.getElementById("filterCategory").value.toLowerCase();

    // Filter logic
    const filtered = opportunities.filter(op => {
        return (
            op.title.toLowerCase().includes(searchText) &&
            (filterCategory === "" || op.category.toLowerCase().includes(filterCategory))
        );
    });

    // Show message if empty
    if (filtered.length === 0) {
        list.innerHTML = "<p>No opportunities found</p>";
        return;
    }

    // Create cards
    filtered.forEach(op => {
        const card = template.content.cloneNode(true);

        card.querySelector(".card-title").innerText = op.title;
        card.querySelector(".card-category").innerText = op.category;
        card.querySelector(".card-description").innerText = op.description;

        const linkEl = card.querySelector(".card-link");
        linkEl.href = op.link;
        linkEl.innerText = "Apply Now 🚀";

        // Delete button
        card.querySelector(".delete-btn").onclick = () => deleteOpportunity(op.id);

        // Edit button
        card.querySelector(".edit-btn").onclick = () => editOpportunity(op.id);

        list.appendChild(card);
    });
}

// ❌ DELETE
function deleteOpportunity(id) {
    opportunities = opportunities.filter(op => op.id !== id);
    saveData();
    renderOpportunities();
}

// ✏️ EDIT
function editOpportunity(id) {
    const op = opportunities.find(op => op.id === id);

    document.getElementById("title").value = op.title;
    document.getElementById("category").value = op.category;
    document.getElementById("link").value = op.link;
    document.getElementById("description").value = op.description;

    // Remove old entry (will re-add after editing)
    deleteOpportunity(id);
}

// 💾 SAVE TO LOCALSTORAGE
function saveData() {
    localStorage.setItem("opportunities", JSON.stringify(opportunities));
}

// 🧹 CLEAR FORM
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("category").value = "";
    document.getElementById("link").value = "";
    document.getElementById("description").value = "";
}
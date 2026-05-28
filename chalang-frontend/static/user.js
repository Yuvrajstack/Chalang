const API_URL = "http://localhost:8080/opportunity/all";
let allData = [];

// Fetch data from backend
function loadOpportunities() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            allData = data || [];
            displayData(allData);
        })
        .catch(err => {
            console.error("Load error:", err);
            const container = document.getElementById("opportunityList");
            container.innerHTML = `<p style="color: #ff4d4d; text-align: center; grid-column: 1 / -1;">Failed to fetch opportunities from the database. Ensure the backend is online.</p>`;
        });
}

// Verify link safety using Secure Browser Logging before opening
function verifyAndOpenLink(event, url) {
    event.preventDefault();
    fetch("http://localhost:8080/browser/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url })
    })
    .then(res => res.text())
    .then(statusText => {
        if (statusText.includes("ALLOW")) {
            window.open(url, "_blank");
        } else if (statusText.includes("WARN")) {
            if (confirm("⚠️ Warning: This link is unencrypted (HTTP) and may not be fully secure. Do you still want to proceed?")) {
                window.open(url, "_blank");
            }
        } else {
            alert("❌ Access Blocked: This URL is flagged as unsafe and cannot be opened.");
        }
    })
    .catch(err => {
        console.error("Secure check failed, opening link:", err);
        window.open(url, "_blank");
    });
}

// Display cards
function displayData(data) {
    const container = document.getElementById("opportunityList");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p style="color: #cbd5e1; text-align: center; grid-column: 1 / -1; font-size: 1.1rem;">No opportunities found.</p>`;
        return;
    }

    data.forEach(op => {
        const title = op.title || "";
        const company = op.company ? `at ${op.company}` : "";
        const category = op.category || "";
        const description = op.description || "";
        const eligibility = op.eligibility || "Open to all";
        const deadline = op.deadline || "N/A";
        const postedBy = op.postedBy || "Admin";
        const link = op.link || "#";

        const card = `
            <div class="card">
                <span class="badge ${category.replace(/\s+/g, '') || 'Internship'}">${category}</span>
                <h3>${title}</h3>
                <div class="card-meta">
                    <span class="company-name">${company}</span>
                </div>
                <p>${description}</p>
                <div class="extra-details">
                    <p><strong>Eligibility:</strong> ${eligibility}</p>
                    <p><strong>Deadline:</strong> ${deadline}</p>
                    <p><strong>Posted By:</strong> ${postedBy}</p>
                </div>
                <a href="${link}" target="_blank" onclick="verifyAndOpenLink(event, '${link}')">Apply Now</a>
            </div>
        `;

        container.innerHTML += card;
    });
}

// Search + Filter
function setupFilters() {
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");

    if (searchInput) {
        searchInput.addEventListener("input", filterData);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", filterData);
    }
}

function filterData() {
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");

    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const filter = filterSelect ? filterSelect.value.toLowerCase() : "all";

    const filtered = allData.filter(op => {
        const title = (op.title || "").toLowerCase();
        const description = (op.description || "").toLowerCase();
        const category = (op.category || "").toLowerCase();
        const company = (op.company || "").toLowerCase();

        const matchesSearch =
            title.includes(search) || description.includes(search) || company.includes(search);

        const matchesFilter =
            filter === "all" || category === filter;

        return matchesSearch && matchesFilter;
    });

    displayData(filtered);
}

// Load on start
window.onload = () => {
    loadOpportunities();
    setupFilters();
};
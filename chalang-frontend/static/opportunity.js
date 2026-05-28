const API_BASE_URL = "http://localhost:8080/opportunity";
const EXAM_API_URL = "http://localhost:8080/exam";
const RESOURCE_API_URL = "http://localhost:8080/resource";

// Switch dashboard tabs
function switchTab(tabId) {
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.remove('active-panel');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab');
    });

    if (tabId === 'opportunities') {
        document.getElementById('panel-opportunities').classList.add('active-panel');
        document.getElementById('tab-opp').classList.add('active-tab');
        loadOpportunities();
    } else if (tabId === 'exams') {
        document.getElementById('panel-exams').classList.add('active-panel');
        document.getElementById('tab-exam').classList.add('active-tab');
        loadExams();
    } else if (tabId === 'resources') {
        document.getElementById('panel-resources').classList.add('active-panel');
        document.getElementById('tab-res').classList.add('active-tab');
        loadResources();
    }
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

/* ========================================================
   OPPORTUNITIES CRUD
   ======================================================== */

// Load opportunities from backend
function loadOpportunities() {
    fetch(`${API_BASE_URL}/all`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load opportunities");
            return res.json();
        })
        .then(data => {
            const container = document.getElementById("opportunityList");
            container.innerHTML = "";

            data.forEach((op) => {
                const template = document.getElementById("cardTemplate");
                const card = template.content.cloneNode(true);

                card.querySelector(".card-title").innerText = op.title || "";
                card.querySelector(".card-company").innerText = op.company ? `at ${op.company}` : "";
                card.querySelector(".card-category").innerText = op.category || "";
                card.querySelector(".card-description").innerText = op.description || "";
                card.querySelector(".card-link").href = op.link || "#";
                card.querySelector(".card-link").onclick = (e) => verifyAndOpenLink(e, op.link || "#");

                card.querySelector(".card-eligibility").innerText = op.eligibility || "N/A";
                card.querySelector(".card-deadline").innerText = op.deadline || "N/A";
                card.querySelector(".card-postedby").innerText = op.postedBy || "N/A";

                // DELETE
                card.querySelector(".delete-btn").onclick = () => {
                    if (confirm("Are you sure you want to delete this opportunity?")) {
                        fetch(`${API_BASE_URL}/delete/${op.id}`, { method: "DELETE" })
                        .then(() => loadOpportunities())
                        .catch(err => console.error("Delete error:", err));
                    }
                };

                // EDIT
                card.querySelector(".edit-btn").onclick = () => {
                    const title = prompt("Edit title:", op.title || "");
                    if (title === null) return;
                    const company = prompt("Edit company:", op.company || "");
                    if (company === null) return;
                    const category = prompt("Edit category:", op.category || "");
                    if (category === null) return;
                    const link = prompt("Edit link:", op.link || "");
                    if (link === null) return;
                    const deadline = prompt("Edit deadline:", op.deadline || "");
                    if (deadline === null) return;
                    const eligibility = prompt("Edit eligibility:", op.eligibility || "");
                    if (eligibility === null) return;
                    const postedBy = prompt("Edit posted by:", op.postedBy || "");
                    if (postedBy === null) return;
                    const description = prompt("Edit description:", op.description || "");
                    if (description === null) return;

                    if (!title.trim() || !category.trim() || !link.trim() || !description.trim()) {
                        alert("Title, Category, Link, and Description are required!");
                        return;
                    }

                    fetch(`${API_BASE_URL}/update/${op.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            title: title.trim(), company: company.trim(), category: category.trim(), 
                            link: link.trim(), deadline: deadline.trim(), eligibility: eligibility.trim(),
                            postedBy: postedBy.trim(), description: description.trim() 
                        })
                    })
                    .then(() => loadOpportunities())
                    .catch(err => console.error("Edit error:", err));
                };

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Load error:", err);
        });
}

function addOpportunity() {
    const title = document.getElementById("title").value.trim();
    const company = document.getElementById("company").value.trim();
    const category = document.getElementById("category").value.trim();
    const link = document.getElementById("link").value.trim();
    const deadline = document.getElementById("deadline").value.trim();
    const eligibility = document.getElementById("eligibility").value.trim();
    const postedBy = document.getElementById("postedBy").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !category || !link || !description) {
        alert("Please fill all required fields (Title, Category, Link, Description)!");
        return;
    }

    // Verify Link safety before creating
    fetch("http://localhost:8080/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link, submittedBy: postedBy || "Admin", context: "Opportunity Creation Scan" })
    })
    .then(res => res.json())
    .then(scanResult => {
        if (scanResult.status === "UNSAFE") {
            alert(`❌ Opportunity Creation Blocked!\nThe application link is flagged as UNSAFE. Please use a secure URL.`);
            return;
        }
        if (scanResult.status === "SUSPICIOUS") {
            if (!confirm(`⚠️ Warning: The link is flagged as SUSPICIOUS.\nDo you still want to publish it?`)) return;
        }
        createOpportunityOnBackend(title, company, category, link, deadline, eligibility, postedBy, description);
    })
    .catch(err => {
        console.error("Link verification failed, proceeding:", err);
        createOpportunityOnBackend(title, company, category, link, deadline, eligibility, postedBy, description);
    });
}

function createOpportunityOnBackend(title, company, category, link, deadline, eligibility, postedBy, description) {
    fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, category, link, deadline, eligibility, postedBy, description })
    })
    .then(() => {
        document.getElementById("title").value = "";
        document.getElementById("company").value = "";
        document.getElementById("category").value = "";
        document.getElementById("link").value = "";
        document.getElementById("deadline").value = "";
        document.getElementById("eligibility").value = "";
        document.getElementById("postedBy").value = "";
        document.getElementById("description").value = "";
        loadOpportunities();
    });
}


/* ========================================================
   EXAMS CRUD
   ======================================================== */

function loadExams() {
    fetch(`${EXAM_API_URL}/all`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("examList");
            container.innerHTML = "";

            data.forEach(ex => {
                const template = document.getElementById("examCardTemplate");
                const card = template.content.cloneNode(true);

                card.querySelector(".card-title").innerText = ex.name || "";
                card.querySelector(".card-level").innerText = ex.level || "N/A";
                card.querySelector(".card-mode").innerText = ex.mode || "N/A";
                card.querySelector(".card-date").innerText = ex.applicationDate || "N/A";
                card.querySelector(".card-eligibility").innerText = ex.eligibility || "N/A";
                card.querySelector(".card-description").innerText = ex.description || "";
                card.querySelector(".card-link").href = ex.officialLink || "#";
                card.querySelector(".card-link").onclick = (e) => verifyAndOpenLink(e, ex.officialLink || "#");

                // Delete
                card.querySelector(".delete-btn").onclick = () => {
                    if (confirm("Delete this exam?")) {
                        fetch(`${EXAM_API_URL}/delete/${ex.id}`, { method: "DELETE" })
                        .then(() => loadExams());
                    }
                };

                // Edit
                card.querySelector(".edit-btn").onclick = () => {
                    const name = prompt("Edit name:", ex.name || ""); if (name === null) return;
                    const level = prompt("Edit level:", ex.level || ""); if (level === null) return;
                    const mode = prompt("Edit mode:", ex.mode || ""); if (mode === null) return;
                    const applicationDate = prompt("Edit date:", ex.applicationDate || ""); if (applicationDate === null) return;
                    const eligibility = prompt("Edit eligibility:", ex.eligibility || ""); if (eligibility === null) return;
                    const officialLink = prompt("Edit link:", ex.officialLink || ""); if (officialLink === null) return;
                    const description = prompt("Edit description:", ex.description || ""); if (description === null) return;

                    fetch(`${EXAM_API_URL}/update/${ex.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, level, mode, applicationDate, eligibility, officialLink, description })
                    })
                    .then(() => loadExams());
                };

                container.appendChild(card);
            });
        });
}

function addExam() {
    const name = document.getElementById("examName").value.trim();
    const level = document.getElementById("examLevel").value.trim();
    const mode = document.getElementById("examMode").value.trim();
    const applicationDate = document.getElementById("examDate").value.trim();
    const eligibility = document.getElementById("examEligibility").value.trim();
    const officialLink = document.getElementById("examLink").value.trim();
    const description = document.getElementById("examDescription").value.trim();

    if (!name || !officialLink) {
        alert("Exam Name and Official Link are required!");
        return;
    }

    // Verify Link safety before creating
    fetch("http://localhost:8080/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: officialLink, submittedBy: "Admin", context: "Exam Link Scan" })
    })
    .then(res => res.json())
    .then(scanResult => {
        if (scanResult.status === "UNSAFE") {
            alert("❌ Creation Blocked! Insecure link.");
            return;
        }
        fetch(`${EXAM_API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, level, mode, applicationDate, eligibility, officialLink, description })
        })
        .then(() => {
            document.getElementById("examName").value = "";
            document.getElementById("examLevel").value = "";
            document.getElementById("examMode").value = "";
            document.getElementById("examDate").value = "";
            document.getElementById("examEligibility").value = "";
            document.getElementById("examLink").value = "";
            document.getElementById("examDescription").value = "";
            loadExams();
        });
    });
}


/* ========================================================
   RESOURCES CRUD
   ======================================================== */

function loadResources() {
    fetch(`${RESOURCE_API_URL}/all`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("resourceList");
            container.innerHTML = "";

            data.forEach(r => {
                const template = document.getElementById("resourceCardTemplate");
                const card = template.content.cloneNode(true);

                card.querySelector(".card-title").innerText = r.title || "";
                card.querySelector(".card-category").innerText = r.category || "N/A";
                card.querySelector(".card-description").innerText = r.description || "";
                card.querySelector(".card-link").href = r.link || "#";
                card.querySelector(".card-link").onclick = (e) => verifyAndOpenLink(e, r.link || "#");

                // Delete
                card.querySelector(".delete-btn").onclick = () => {
                    if (confirm("Delete this resource?")) {
                        fetch(`${RESOURCE_API_URL}/delete/${r.id}`, { method: "DELETE" })
                        .then(() => loadResources());
                    }
                };

                // Edit
                card.querySelector(".edit-btn").onclick = () => {
                    const title = prompt("Edit title:", r.title || ""); if (title === null) return;
                    const category = prompt("Edit category:", r.category || ""); if (category === null) return;
                    const link = prompt("Edit link:", r.link || ""); if (link === null) return;
                    const description = prompt("Edit description:", r.description || ""); if (description === null) return;

                    fetch(`${RESOURCE_API_URL}/update/${r.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title, category, link, description })
                    })
                    .then(() => loadResources());
                };

                container.appendChild(card);
            });
        });
}

function addResource() {
    const title = document.getElementById("resourceTitle").value.trim();
    const category = document.getElementById("resourceCategory").value.trim();
    const link = document.getElementById("resourceLink").value.trim();
    const description = document.getElementById("resourceDescription").value.trim();

    if (!title || !link) {
        alert("Resource Title and Link are required!");
        return;
    }

    // Verify Link safety before creating
    fetch("http://localhost:8080/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link, submittedBy: "Admin", context: "Resource Link Scan" })
    })
    .then(res => res.json())
    .then(scanResult => {
        if (scanResult.status === "UNSAFE") {
            alert("❌ Creation Blocked! Insecure link.");
            return;
        }
        fetch(`${RESOURCE_API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, category, link, description })
        })
        .then(() => {
            document.getElementById("resourceTitle").value = "";
            document.getElementById("resourceCategory").value = "";
            document.getElementById("resourceLink").value = "";
            document.getElementById("resourceDescription").value = "";
            loadResources();
        });
    });
}

// Load on start
window.onload = loadOpportunities;
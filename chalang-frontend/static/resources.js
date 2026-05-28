const container = document.getElementById("resourcesContainer");
const search = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");

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

let resourcesData = [];
let currentCategory = "All";

/* =========================
   LOADING SCREEN
========================= */
function showLoader(){

    container.innerHTML = `

    <div class="loader-container">

        <div class="loader"></div>

        <h2>Loading Resources...</h2>

    </div>

    `;
}

/* =========================
   FETCH DATA
========================= */
showLoader();

fetch("http://localhost:8080/resource/all")
.then(res => res.json())
.then(data => {

    resourcesData = data;

    setTimeout(() => {
        displayResources(data);
    }, 800);

})
.catch(error => {

    container.innerHTML = `

    <div class="error-box">

        <h2>⚠ Failed To Load Resources</h2>

        <p>Please try again later.</p>

    </div>

    `;

    console.log(error);
});

/* =========================
   DISPLAY RESOURCES
========================= */
function displayResources(resources){

    container.innerHTML = "";

    if(resources.length === 0){

        container.innerHTML = `

        <div class="empty-state">

            <h2>No Resources Found</h2>

            <p>Try another keyword or category.</p>

        </div>

        `;

        return;
    }

    resources.forEach((resource, index) => {

        const card = document.createElement("div");

        card.classList.add("resource-card", "hidden-card");

        card.innerHTML = `
            <div class="resource-image" style="background: linear-gradient(135deg, rgba(0, 234, 255, 0.1), rgba(37, 99, 235, 0.25)); display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; z-index: 2;">
                    <span style="padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; color: white; background: linear-gradient(135deg, var(--primary), var(--secondary));">${resource.category}</span>
                </div>
            </div>

            <div class="resource-content">

                <h3>${resource.title}</h3>

                <p>${resource.description}</p>

                <div class="resource-footer">

                    <div class="resource-tags">
                        <span class="tag">
                            ${resource.category}
                        </span>
                    </div>

                    <a href="${resource.link}"
                    target="_blank"
                    onclick="verifyAndOpenLink(event, '${resource.link}')"
                    class="resource-btn">

                    Open Resource

                    </a>

                </div>

            </div>

        `;

        container.appendChild(card);

        setTimeout(() => {
            card.classList.add("show-card");
        }, index * 120);
    });
}

/* =========================
   SEARCH FUNCTIONALITY
========================= */
search.addEventListener("input", filterResources);

function filterResources(){

    const value = search.value.toLowerCase();

    const filtered = resourcesData.filter(resource => {

        const matchesSearch =

            resource.title.toLowerCase().includes(value) ||

            resource.description.toLowerCase().includes(value) ||

            resource.category.toLowerCase().includes(value);

        const matchesCategory =

            currentCategory === "All" ||

            resource.category.toLowerCase() ===
            currentCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    displayResources(filtered);
}

/* =========================
   FILTER BUTTONS
========================= */
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.textContent.trim();

        filterResources();
    });

});

/* =========================
   SCROLL ANIMATION
========================= */
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show-card");
        }
    });

},{
    threshold:0.15
});

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(
        ".resource-card"
    );

    cards.forEach(card => {

        observer.observe(card);
    });
});

/* =========================
   PARALLAX EFFECT
========================= */
window.addEventListener("mousemove", (e) => {

    const hero = document.querySelector(".hero");

    if(hero){

        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;

        hero.style.transform =
        `translateX(${x}px) translateY(${y}px)`;
    }
});

/* =========================
   BUTTON RIPPLE EFFECT
========================= */
document.addEventListener("click", function(e){

    if(e.target.classList.contains("resource-btn") ||
       e.target.classList.contains("primary-btn") ||
       e.target.classList.contains("secondary-btn")){

        const button = e.target;

        const circle = document.createElement("span");

        const diameter = Math.max(
            button.clientWidth,
            button.clientHeight
        );

        const radius = diameter / 2;

        circle.style.width =
        circle.style.height =
        `${diameter}px`;

        circle.style.left =
        `${e.clientX - button.offsetLeft - radius}px`;

        circle.style.top =
        `${e.clientY - button.offsetTop - radius}px`;

        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];

        if(ripple){
            ripple.remove();
        }

        button.appendChild(circle);
    }
});

/* =========================
   AUTO TYPING PLACEHOLDER
========================= */
const placeholders = [

    "Search Web Development...",
    "Search DSA Sheets...",
    "Search AI/ML Notes...",
    "Search Interview Prep...",
    "Search Roadmaps..."
];

let currentPlaceholder = 0;

setInterval(() => {

    search.setAttribute(
        "placeholder",
        placeholders[currentPlaceholder]
    );

    currentPlaceholder++;

    if(currentPlaceholder >= placeholders.length){
        currentPlaceholder = 0;
    }

}, 2500);

/* =========================
   FLOATING PARTICLES
========================= */
function createParticles(){

    const bg = document.querySelector(".bg-animation");

    if(!bg) return;

    for(let i = 0; i < 15; i++){

        const particle = document.createElement("span");

        particle.style.left =
        Math.random() * 100 + "%";

        particle.style.animationDuration =
        (Math.random() * 10 + 10) + "s";

        particle.style.width =
        particle.style.height =
        (Math.random() * 8 + 4) + "px";

        bg.appendChild(particle);
    }
}

createParticles();

/* =========================
   STATS COUNTER
========================= */
const counters = document.querySelectorAll(".stat-card h2");

const speed = 200;

counters.forEach(counter => {

    const updateCount = () => {

        const target =
        +counter.innerText.replace(/\D/g,'');

        const count =
        +counter.getAttribute("data-count") || 0;

        const increment = target / speed;

        if(count < target){

            const newCount =
            Math.ceil(count + increment);

            counter.setAttribute(
                "data-count",
                newCount
            );

            counter.innerText =
            newCount + "+";

            setTimeout(updateCount, 20);

        }else{

            counter.innerText = target + "+";
        }
    };

    updateCount();
});

/* =========================
   BACK TO TOP BUTTON
========================= */
const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

topBtn.classList.add("top-btn");

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {

    if(window.scrollY > 400){

        topBtn.classList.add("show-top-btn");

    }else{

        topBtn.classList.remove("show-top-btn");
    }
});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});
function showSection(sectionId) {
    const sections = document.querySelectorAll(".content");
    const buttons = document.querySelectorAll("nav button");

    sections.forEach(section => {
        section.style.display = "none";
    });

    buttons.forEach(button => {
        button.style.background = "linear-gradient(135deg, #3498db, #2980b9)";
        button.style.boxShadow = "0 5px 12px rgba(52, 152, 219, 0.3)";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }

    buttons.forEach(button => {
        if (button.getAttribute("onclick").includes(sectionId)) {
            button.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
            button.style.boxShadow = "0 6px 15px rgba(46, 204, 113, 0.5)";
        }
    });
}

window.onload = function () {
    showSection("home");
};

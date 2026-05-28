const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const searchValue = searchInput.value.toLowerCase();

    const examCards =
        document.querySelectorAll(".exam-card");

    examCards.forEach(card => {

        const examName =
            card.dataset.name.toLowerCase();

        if (examName.includes(searchValue)) {
            card.style.display = "block";
        }

        else {
            card.style.display = "none";
        }

    });

});
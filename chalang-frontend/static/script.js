
const hiddenElements = document.querySelectorAll(
    '.card, .feature-box, .timeline-item, .stat-card'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show-card');
        }
    });
});

hiddenElements.forEach((el) => {
    el.classList.add('hidden-card');
    observer.observe(el);
});



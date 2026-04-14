document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect on the big title
    window.addEventListener('scroll', () => {
        const title = document.querySelector('.big-title');
        const scroll = window.pageYOffset;
        title.style.transform = `translateX(${scroll * 0.2}px)`;
    });

    // Intersection Observer for work items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.work-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(item);
    });
});
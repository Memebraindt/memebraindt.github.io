document.querySelectorAll('.portfolio-item-wrapper').forEach(item => {
    item.addEventListener('click', () => {
        const portfolioItem = item.querySelector('.portfolio-item');
        portfolioItem.classList.toggle('flipped');
    });
});

const desktop = document.querySelector('.desktop');
const draggableElements = document.querySelectorAll('.draggable');

// Перемещение окон и ярлыков
draggableElements.forEach(element => {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
    });
  });

  function onMouseMove(e) {
    if (isDragging) {
      const desktopRect = desktop.getBoundingClientRect();
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;

      // Ограничения для перемещения в пределах области
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + element.offsetWidth > desktopRect.width) left = desktopRect.width - element.offsetWidth;
      if (top + element.offsetHeight > desktopRect.height) top = desktopRect.height - element.offsetHeight;

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
    }
  }
});

// Адаптация окон при изменении размера окна браузера
window.addEventListener('resize', () => {
  draggableElements.forEach(element => {
    const desktopRect = desktop.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Перемещение окна внутрь видимой области
    if (elementRect.right > desktopRect.width) {
      element.style.left = `${desktopRect.width - elementRect.width}px`;
    }
    if (elementRect.bottom > desktopRect.height) {
      element.style.top = `${desktopRect.height - elementRect.height}px`;
    }
  });
});

/* document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Удаляем активный класс со всех вкладок
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Скрываем все проекты
        document.querySelectorAll('.project-content').forEach(content => content.classList.remove('active'));

        // Показываем активный проект
        const target = tab.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
}); */

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Удаляем активный класс со всех вкладок
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Скрываем все проекты
        document.querySelectorAll('.desktop').forEach(content => content.classList.remove('active'));
        // tab.classList.add('active');

        // Показываем активный проект
        const target = tab.getAttribute('data-target');
        const targetElement = document.getElementById(target);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    });
});
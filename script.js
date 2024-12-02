function getActiveDesktop() {
  return document.querySelector('.desktop.active');
}

function setupDraggableElements() {
  const activeDesktop = getActiveDesktop();
  if (!activeDesktop) return;

  const draggableElements = activeDesktop.querySelectorAll('.draggable');

  draggableElements.forEach(element => {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (isDragging) {
        const desktopRect = activeDesktop.getBoundingClientRect();

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // Ограничения перемещения в пределах активного desktop
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left + element.offsetWidth > desktopRect.width) {
          left = desktopRect.width - element.offsetWidth;
        }
        if (top + element.offsetHeight > desktopRect.height) {
          top = desktopRect.height - element.offsetHeight;
        }

        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
      }
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Удаляем активный класс со всех вкладок
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Скрываем все desktop и показываем только активный
    document.querySelectorAll('.desktop').forEach(desktop => desktop.classList.remove('active'));
    const target = tab.getAttribute('data-target');
    const targetElement = document.getElementById(target);
    if (targetElement) {
      targetElement.classList.add('active');
    }

    // Заново инициализируем draggable элементы для активного desktop
    setupDraggableElements();
  });
});

// Инициализация при загрузке страницы
setupDraggableElements();

// Адаптация окон при изменении размера окна браузера
window.addEventListener('resize', () => {
  const activeDesktop = getActiveDesktop();
  if (!activeDesktop) return;

  const draggableElements = activeDesktop.querySelectorAll('.draggable');

  draggableElements.forEach(element => {
    const desktopRect = activeDesktop.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Перемещение окна внутрь видимой области
    if (elementRect.right > desktopRect.width) {
      element.style.left = `${desktopRect.width - element.offsetWidth}px`;
    }
    if (elementRect.bottom > desktopRect.height) {
      element.style.top = `${desktopRect.height - element.offsetHeight}px`;
    }
  });
});

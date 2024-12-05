const tabs = document.querySelectorAll('.tab');
const desktops = document.querySelectorAll('.desktop');
const draggableElements = document.querySelectorAll('.draggable');
const desktopWrapper = document.querySelector('.d-wrap');
const tabsWrapper = document.querySelector('.tabs-wrapper');
const tabsContainer = document.querySelector('.tabs');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
let currentZIndex = 10; // Начальный z-index для управления слоями

// Переключение вкладок
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Сбросить класс active у всех вкладок и desktop
    tabs.forEach(t => t.classList.remove('active'));
    desktops.forEach(d => d.classList.remove('active'));

    // Активировать выбранную вкладку и соответствующий desktop
    const targetId = tab.getAttribute('data-target');
    const targetDesktop = document.getElementById(targetId);

    if (targetDesktop) {
      tab.classList.add('active');
      targetDesktop.classList.add('active');
    }
  });
});

// Горизонтальная прокрутка вкладок
let scrollPosition = 0;

const updateArrowState = () => {
  const maxScroll = tabsContainer.scrollWidth - tabsWrapper.offsetWidth;
  leftArrow.disabled = scrollPosition <= 0;
  rightArrow.disabled = scrollPosition >= maxScroll;
};

const scrollTabs = (direction) => {
  const tabWidth = 202; // 192px + 10px (gap)
  const maxScroll = tabsContainer.scrollWidth - tabsWrapper.offsetWidth;

  scrollPosition += direction * tabWidth;
  scrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

  tabsContainer.style.transform = `translateX(-${scrollPosition}px)`;
  updateArrowState();
};

leftArrow.addEventListener('click', () => scrollTabs(-1));
rightArrow.addEventListener('click', () => scrollTabs(1));

updateArrowState();

// Перемещение окон и ярлыков
draggableElements.forEach(element => {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Предотвращает выделение текста
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    // Установить наивысший z-index для текущего элемента
    currentZIndex++;
    element.style.zIndex = currentZIndex;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
    });
  });

  function onMouseMove(e) {
    if (isDragging) {
      const desktopRect = desktopWrapper.getBoundingClientRect();
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

// Запрет перетаскивания изображений
document.addEventListener('dragstart', (event) => {
  if (event.target.tagName === 'IMG') {
    event.preventDefault();
  }
});

// Адаптация окон при изменении размера окна браузера
window.addEventListener('resize', () => {
  draggableElements.forEach(element => {
    const desktopRect = desktopWrapper.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Перемещение окна внутрь видимой области
    if (elementRect.right > desktopRect.width) {
      element.style.left = `${desktopRect.width - elementRect.width}px`;
    }
    if (elementRect.bottom > desktopRect.height) {
      element.style.top = `${desktopRect.height - elementRect.height}px`;
    }
  });

  // Обновление состояния стрелок после изменения размера
  updateArrowState();
});

// Управление кликами на ссылках
const links = document.querySelectorAll('a');

links.forEach(link => {
  let singleClickTimeout;
  // link.target = '_blank';
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Блокируем переход по одинарному клику
    clearTimeout(singleClickTimeout);
    singleClickTimeout = setTimeout(() => {
      // Одинарный клик - ничего не делаем
    }, 300);
  });

  link.addEventListener('dblclick', (e) => {
    e.preventDefault();
    clearTimeout(singleClickTimeout);
    window.open(link.href, link.target || '_blank'); // Переход по ссылке
  });
});

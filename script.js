const tabs = document.querySelectorAll('.tab');
const tabsWrapper = document.querySelector('.tabs-wrapper');
const tabsContainer = document.querySelector('.tabs-container');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

const desktops = document.querySelectorAll('.desktop');
const draggableElements = document.querySelectorAll('.draggable');
const desktopWrapper = document.querySelector('.d-wrap');
const links = document.querySelectorAll('a');

let currentZIndex = 10; 
let scrollPosition = 0;

const updateArrowState = () => {
  const tabsWrapperWidth = tabsWrapper.offsetWidth;
  const tabsContainerWidth = tabsContainer.scrollWidth;

  const maxScroll = tabsContainerWidth - tabsWrapperWidth;

  leftArrow.style.display = scrollPosition > 0 ? 'block' : 'none';
  rightArrow.style.display = scrollPosition < maxScroll ? 'block' : 'none';
}

const scrollTabs = (direction) => {
  const tabWidth = 202; // 192px + 10px (gap)
  const tabsWrapperWidth = tabsWrapper.offsetWidth;
  const tabsContainerWidth = tabsContainer.scrollWidth;

  const maxScroll = tabsContainerWidth - tabsWrapperWidth;

  scrollPosition += direction * tabWidth;
  scrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

  tabsContainer.style.transform = `translateX(${-scrollPosition}px)`;

  updateArrowState();
};

const updateTabsLayout = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth > 1628) {
    tabsContainer.style.transform = `translateX(0px)`;
    tabsWrapper.style.transform = `translateX(${(windowWidth - 1628)/2}px)`;
    scrollPosition = 0;
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'none';
  } else {
    updateArrowState();
    tabsWrapper.style.transform = `translateX(0px)`;
    // tabsContainer.style.transform = `translateX(0px)`;
    // scrollPosition -= windowWidth - (1628 - scrollPosition);
    // tabsContainer.style.transform = `translateX(${-scrollPosition}px)`;
  }
};

leftArrow.addEventListener('click', () => scrollTabs(-1));
rightArrow.addEventListener('click', () => scrollTabs(1));

window.addEventListener('resize', () => {
  updateTabsLayout();
});

document.addEventListener('DOMContentLoaded', () => {
  updateTabsLayout();
});


tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    desktops.forEach(d => d.classList.remove('active'));

    const targetId = tab.getAttribute('data-target');
    const targetDesktop = document.getElementById(targetId);

    if (targetDesktop) {
      tab.classList.add('active');
      targetDesktop.classList.add('active');
    }
  });
});

draggableElements.forEach(element => {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

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

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + element.offsetWidth > desktopRect.width) left = desktopRect.width - element.offsetWidth;
      if (top + element.offsetHeight > desktopRect.height) top = desktopRect.height - element.offsetHeight;

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
    }
  }
});

document.addEventListener('dragstart', (event) => {
  if (event.target.tagName === 'IMG') {
    event.preventDefault();
  }
});

window.addEventListener('resize', () => {
  draggableElements.forEach(element => {
    const desktopRect = desktopWrapper.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (elementRect.right > desktopRect.width) {
      element.style.left = `${desktopRect.width - elementRect.width}px`;
    }
    if (elementRect.bottom > desktopRect.height) {
      element.style.top = `${desktopRect.height - elementRect.height}px`;
    }
    updateTabsLayout();
  });
  updateArrowState();
});


links.forEach(link => {
  let singleClickTimeout;

  link.addEventListener('click', (e) => {
    e.preventDefault(); 
    clearTimeout(singleClickTimeout);
    singleClickTimeout = setTimeout(() => {}, 300);
  });

  link.addEventListener('dblclick', (e) => {
    e.preventDefault();
    clearTimeout(singleClickTimeout);
    window.open(link.href, link.target || '_blank');
  });
});
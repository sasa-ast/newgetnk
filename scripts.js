document.querySelectorAll('a.hero__inf-link[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'     
      });
    }
  });
});

const btnUp = {
  el: document.querySelector('#btn-up'),
  footer: document.querySelector('footer'), // Находит ваш тег <footer>
  
  show() { this.el.classList.remove('btn-up_hide'); },
  hide() { this.el.classList.add('btn-up_hide'); },
  
  addEventListener() {
    const checkPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      // 1. Показ и скрытие кнопки
      scrollY > 300 ? this.show() : this.hide();
      
      // 2. Логика выталкивания кнопки футером
      if (this.footer) {
        const footerRect = this.footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const defaultBottom = 25; // Стандартный отступ кнопки от края экрана (в px)
        
        // Проверяем, появился ли футер в зоне видимости экрана
        if (footerRect.top < windowHeight) {
          // Вычисляем, сколько пикселей футера уже видно на экране
          const footerVisibleHeight = windowHeight - footerRect.top;
          // Новый отступ = высота видимой части футера + стандартный зазор
          const newBottom = footerVisibleHeight + defaultBottom;
          
          this.el.style.setProperty('--btn-bottom', `${newBottom}px`);
        } else {
          // Если футера еще не видно, возвращаем стандартный отступ
          this.el.style.setProperty('--btn-bottom', `${defaultBottom}px`);
        }
      }
    };

    // Запуск проверок
    checkPosition();
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    // Клик наверх
    this.el.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  btnUp.addEventListener();
});
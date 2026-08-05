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
  footer: document.querySelector('footer'),
  
  show() { this.el.classList.remove('btn-up_hide'); },
  hide() { this.el.classList.add('btn-up_hide'); },
  
  addEventListener() {
    const checkPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      

      scrollY > 300 ? this.show() : this.hide();
      

      if (this.footer) {
        const footerRect = this.footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const defaultBottom = 25;
        

        if (footerRect.top < windowHeight) {

          const footerVisibleHeight = windowHeight - footerRect.top;

          const newBottom = footerVisibleHeight + defaultBottom;
          
          this.el.style.setProperty('--btn-bottom', `${newBottom}px`);
        } else {

          this.el.style.setProperty('--btn-bottom', `${defaultBottom}px`);
        }
      }
    };


    checkPosition();
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);


    this.el.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  btnUp.addEventListener();
});

document.body.classList.add('preloader-active');

window.addEventListener('load', () => {
  const preloader = document.querySelector('#preloader');
  
  if (preloader) {

    setTimeout(() => {
      preloader.classList.add('preloader_hide');
      document.body.classList.remove('preloader-active');
    }, 400); 
  }
});

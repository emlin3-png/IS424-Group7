// Carousel script
    (function(){
      const track = document.querySelector('.carousel-track');
      if (!track) return;
      const slides = Array.from(track.children);
      const prevButton = document.querySelector('.carousel-button.prev');
      const nextButton = document.querySelector('.carousel-button.next');
      const slideWidth = slides[0].getBoundingClientRect().width;

      // arrange slides next to one another
      const setSlidePosition = (slide, index) => {
        slide.style.left = (100 * index) + '%';
      };
      slides.forEach(setSlidePosition);

      let currentIndex = 0;

      const moveToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        track.style.transform = 'translateX(-' + (100 * index) + '%)';
        currentIndex = index;
      };

      nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
      prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

      // autoplay
      let autoplay = setInterval(() => moveToSlide(currentIndex + 1), 4000);
      const carousel = document.querySelector('.carousel');
      carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
      carousel.addEventListener('mouseleave', () => { autoplay = setInterval(() => moveToSlide(currentIndex + 1), 4000); });

      // responsive: ensure slides still positioned if window resized
      window.addEventListener('resize', () => slides.forEach(setSlidePosition));
    })();

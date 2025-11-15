(function(){
  const track = document.querySelector('.imagens-corte');
  const btnPrev = document.querySelector('.carousel__btn--prev');
  const btnNext = document.querySelector('.carousel__btn--next');
  
  if(!track) return;

  const items = Array.from(track.querySelectorAll('img'));
  let index = 0;
  const gap = parseInt(getComputedStyle(track).gap) || 24;

  function updateButtons() {
    if (btnPrev) {
      btnPrev.disabled = index === 0;
    }
    if (btnNext) {
      btnNext.disabled = index === items.length - 1;
    }
  }

  function scrollToIndex(i, smooth = true){
    const item = items[i];
    if(!item) return;
    
    const left = item.offsetLeft - (track.clientWidth - item.clientWidth)/2;
    track.scrollTo({ 
      left, 
      behavior: smooth ? 'smooth' : 'auto' 
    });
    index = i;
    updateButtons();
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', ()=>{
      const nextIndex = Math.max(0, index-1);
      scrollToIndex(nextIndex);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', ()=>{
      const nextIndex = Math.min(items.length-1, index+1);
      scrollToIndex(nextIndex);
    });
  }

  let scrollTimeout;
  track.addEventListener('scroll', ()=>{
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(()=>{
      // find centered item
      const center = track.scrollLeft + track.clientWidth/2;
      let closest = 0;
      let closestDist = Infinity;
      items.forEach((it, idx)=>{
        const itCenter = it.offsetLeft + it.clientWidth/2;
        const dist = Math.abs(center - itCenter);
        if(dist < closestDist){ 
          closestDist = dist; 
          closest = idx; 
        }
      });
      index = closest;
      updateButtons();
    }, 100);
  }, { passive: true });

  // Autoplay
  let autoplay = true;
  let autoplayDelay = 4000;
  let autoplayTimer;
  
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(()=>{
      const next = (index + 1) % items.length;
      scrollToIndex(next);
    }, autoplayDelay);
  }
  
  function stopAutoplay(){ 
    if(autoplayTimer) clearInterval(autoplayTimer); 
  }

  track.addEventListener('mouseenter', ()=> stopAutoplay());
  track.addEventListener('mouseleave', ()=> autoplay && startAutoplay());

  scrollToIndex(0, false);
  updateButtons();
  
  if(autoplay && items.length > 1) startAutoplay();
})();

// ...existing code...
(function () {
    const container = document.querySelector('#testimoni .testimonials-container');
    if (!container) return;

    const existingGrid = container.querySelector('.testimonial-grid');
    if (!existingGrid) return;

    // collect cards and remove original grid
    const cards = Array.from(existingGrid.children).map(c => c.cloneNode(true));
    existingGrid.remove();

    // build slider + track
    const slider = document.createElement('div');
    slider.className = 'testimonial-slider';
    const track = document.createElement('div');
    track.className = 'testimonial-track';

    // append two copies for seamless loop
    cards.forEach(c => track.appendChild(c.cloneNode(true)));
    cards.forEach(c => track.appendChild(c.cloneNode(true)));

    slider.appendChild(track);

    // create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-nav-btn testimonial-nav-prev';
    prevBtn.innerHTML = '&#10094;'; // left arrow
    prevBtn.setAttribute('aria-label', 'Testimonial sebelumnya');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-nav-btn testimonial-nav-next';
    nextBtn.innerHTML = '&#10095;'; // right arrow
    nextBtn.setAttribute('aria-label', 'Testimonial berikutnya');

    slider.appendChild(prevBtn);
    slider.appendChild(nextBtn);
    container.appendChild(slider);

    // inject CSS for slider/track
    const style = document.createElement('style');
    style.textContent = `
        .testimonial-slider { width:100%; overflow:hidden; position:relative; padding: 12px 0; display:flex; align-items:center; }
        .testimonial-track { display:flex; gap:24px; align-items:stretch; will-change: transform; flex:1; }
        .testimonial-track .testimonial-card { flex: 0 0 auto; }
        .testimonial-nav-btn { position:absolute; top:50%; transform:translateY(-50%); width:40px; height:40px; border:none; background-color:rgba(0,0,0,0.5); color:white; cursor:pointer; font-size:20px; border-radius:50%; z-index:10; transition:background-color 0.3s; }
        .testimonial-nav-btn:hover { background-color:rgba(0,0,0,0.8); }
        .testimonial-nav-prev { left:10px; }
        .testimonial-nav-next { right:10px; }
        @media (max-width:767px) { .testimonial-track { gap:12px; } .testimonial-track .testimonial-card { width: calc(100% - 48px); max-width: 420px; } .testimonial-nav-btn { width:32px; height:32px; font-size:16px; } }
        @media (prefers-reduced-motion: reduce) { .testimonial-track { animation: none !important; } }
    `;
    document.head.appendChild(style);

    // animation loop (left -> right). uses pixels/sec speed
    let speed = 80; // px per second (dipercepat dari 40)
    let pos = 0;
    let singleWidth = 0;
    let last = performance.now();
    let paused = false;
    let autoplay = true;

    function recalc() {
        // total track width / 2 = width of one set
        singleWidth = track.scrollWidth / 2 || 0;
        // start from -singleWidth so first visible set scrolls into view left->right
        pos = -singleWidth;
        track.style.transform = `translateX(${pos}px)`;
    }

    // continuous animation: move right (increase pos). when reaches 0, reset to -singleWidth
    function tick(now) {
        if (paused || !autoplay) { last = now; requestAnimationFrame(tick); return; }
        const dt = Math.max(0, now - last) / 1000;
        last = now;
        pos += speed * dt;
        if (pos >= 0) pos = -singleWidth + (pos - 0); // wrap smoothly
        track.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(tick);
    }

    // button handlers
    prevBtn.addEventListener('click', () => {
        autoplay = false;
        pos -= singleWidth / cards.length;
        track.style.transform = `translateX(${pos}px)`;
    });

    nextBtn.addEventListener('click', () => {
        autoplay = false;
        pos += singleWidth / cards.length;
        track.style.transform = `translateX(${pos}px)`;
    });

    // pause on hover
    slider.addEventListener('mouseenter', () => paused = true);
    slider.addEventListener('mouseleave', () => { paused = false; autoplay = true; });

    // recalc on load/resize
    window.addEventListener('load', () => { recalc(); last = performance.now(); requestAnimationFrame(tick); });
    window.addEventListener('resize', () => { recalc(); });
    // initial calc
    recalc();
})();
// ...existing code...

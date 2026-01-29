(function () {
    const testimonials = [
        { text: "Kursus ini membuat saya lebih percaya diri berbicara Inggris. Metode pengajarannya sangat mudah dipahami.", author: "Siti, Jakarta" },
        { text: "Materinya terstruktur sesuai level. Dalam 3 bulan saya sudah bisa percakapan dasar dengan lancar.", author: "Budi, Bandung" },
        { text: "Pengajar ramah dan sabar. Latihan speaking-nya efektif banget.", author: "Rina, Surabaya" },
        { text: "Harga terjangkau untuk kualitas seperti ini. Recommended!", author: "Ahmad, Medan" }
    ];

    const container = document.querySelector('#testimoni .container');
    if (!container) return;

    // Build wrapper + table
    const wrapper = document.createElement('div');
    wrapper.className = 'testimonial-table-wrapper';
    const table = document.createElement('table');
    table.className = 'testimonial-table';
    const tr = document.createElement('tr');

    testimonials.forEach(t => {
        const td = document.createElement('td');
        td.className = 'testimonial-cell';
        td.innerHTML = `
            <div class="testimonial-item neon-box" style="margin:0;">
                <p>${t.text}</p>
                <div class="testimonial-author">— ${t.author}</div>
            </div>
        `;
        tr.appendChild(td);
    });

    // Duplicate cells to allow seamless looping
    Array.from(tr.children).forEach(child => tr.appendChild(child.cloneNode(true)));

    table.appendChild(tr);
    wrapper.appendChild(table);
    container.appendChild(wrapper);

    // Inject minimal CSS for table layout and smooth appearance
    const style = document.createElement('style');
    style.textContent = `
        .testimonial-table-wrapper { width:100%; overflow:hidden; position:relative; }
        .testimonial-table { border-collapse:collapse; white-space:nowrap; display:inline-block; will-change:transform; }
        .testimonial-table tr { display:flex; align-items:stretch; }
        .testimonial-cell { display:inline-block; vertical-align:top; padding:0 12px; }
        .testimonial-item { min-width:320px; max-width:420px; box-sizing:border-box; }
        @media (max-width:768px) {
            .testimonial-item { min-width:260px; max-width:320px; }
        }
    `;
    document.head.appendChild(style);

    // Animation: constant-speed leftward sliding, seamless loop
    let speed = 25; // px per second (slow)
    let paused = false;
    let last = null;
    let offset = 0;

    function recalc() {
        // width of one sequence (half of full table because we duplicated)
        const fullW = table.getBoundingClientRect().width;
        const singleW = fullW / 2 || 1;
        return { fullW, singleW };
    }

    let sizes = recalc();
    window.addEventListener('resize', () => { sizes = recalc(); });

    wrapper.addEventListener('mouseenter', () => { paused = true; });
    wrapper.addEventListener('mouseleave', () => { paused = false; last = null; requestAnimationFrame(loop); });

    function loop(ts) {
        if (!last) last = ts;
        const delta = ts - last;
        last = ts;
        if (!paused && sizes.singleW > 0 && sizes.fullW > wrapper.clientWidth) {
            offset += (speed * delta) / 1000;
            if (offset >= sizes.singleW) offset = offset - sizes.singleW;
            table.style.transform = `translateX(${-offset}px)`;
        }
        requestAnimationFrame(loop);
    }

    // Start only if content bigger than wrapper (otherwise keep static)
    sizes = recalc();
    requestAnimationFrame(loop);
})();

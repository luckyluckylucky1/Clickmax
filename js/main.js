(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
    });
  }

  // Slideshows
  document.querySelectorAll('[data-slideshow]').forEach(function (ss) {
    const slides = ss.querySelectorAll('.slide');
    const dotsHost = ss.querySelector('[data-slideshow-dots]');
    if (!slides.length) return;

    let idx = 0;
    let timer = null;
    const INTERVAL = 3800;

    // Build dots
    if (dotsHost) {
      slides.forEach(function (_, i) {
        const b = document.createElement('button');
        b.className = 'slideshow-dot' + (i === 0 ? ' is-active' : '');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', function () {
          go(i);
          restart();
        });
        dotsHost.appendChild(b);
      });
    }

    function go(n) {
      slides[idx].classList.remove('is-active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      if (dotsHost) {
        dotsHost.querySelectorAll('.slideshow-dot').forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
      }
    }

    function next() { go(idx + 1); }

    function start() {
      if (timer) return;
      timer = setInterval(next, INTERVAL);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    // Pause on hover
    ss.addEventListener('mouseenter', stop);
    ss.addEventListener('mouseleave', start);

    // Only auto-play when visible (saves work + nicer UX)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.3 });
      io.observe(ss);
    } else {
      start();
    }
  });

  // ---------- PROCESS DEMO ----------
  const demo = document.querySelector('[data-demo]');
  if (demo) {
    const messagesEl = demo.querySelector('[data-demo-messages]');
    const replyEl = demo.querySelector('[data-demo-reply]');
    const chatEl = demo.querySelector('[data-demo-chat]');
    const codeEl = demo.querySelector('[data-demo-code]');
    const codeBlockEl = demo.querySelector('[data-demo-code-block]');
    const fileEl = demo.querySelector('[data-demo-file]');
    const toastEl = demo.querySelector('[data-demo-toast]');
    const siteEl = demo.querySelector('[data-demo-site]');
    const urlEl = demo.querySelector('[data-demo-url]');
    const viewportEl = demo.querySelector('[data-demo-viewport]');
    const avatarEl = demo.querySelector('[data-demo-avatar]');
    const nameEl = demo.querySelector('[data-demo-name]');
    const clientSubEl = demo.querySelector('[data-demo-client-sub]');

    const cafeMarkup = `
      <div class="cafe-site">
        <div class="cafe-nav">
          <div class="cafe-nav-brand">OAKRIDGE PHYSIO</div>
          <div class="cafe-nav-links"><span>Services</span><span>Team</span><span>Book</span></div>
        </div>
        <div class="cafe-hero">
          <div class="cafe-hero-image" style="background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop');"></div>
          <div class="cafe-hero-overlay"></div>
          <div class="cafe-hero-content">
            <p class="cafe-hero-eyebrow">Hawthorn · Est. 2018</p>
            <h1>Hands-on care.<br><em>Lasting results.</em></h1>
            <p class="cafe-hero-sub">Evidence-based physiotherapy for everyday pain, sports injuries, and post-op recovery.</p>
            <div class="cafe-hero-ctas">
              <div class="cafe-hero-btn primary">Book a consult</div>
              <div class="cafe-hero-btn ghost">Our services</div>
            </div>
          </div>
        </div>
        <div class="cafe-strip">
          <div><span class="cafe-strip-label">Initial</span><strong>$145</strong></div>
          <div><span class="cafe-strip-label">Follow-up</span><strong>$95</strong></div>
          <div><span class="cafe-strip-label">Open</span><strong>Mon–Sat</strong></div>
        </div>
      </div>
    `;

    const salonMarkup = `
      <div class="salon-site">
        <div class="salon-nav">
          <div class="salon-nav-brand">LUNA ATELIER</div>
          <div class="salon-nav-links"><span>Services</span><span>Atelier</span><span>Book</span></div>
        </div>
        <div class="salon-hero">
          <div class="salon-hero-image" style="background-image: url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop');"></div>
          <div class="salon-hero-text">
            <p class="salon-hero-eyebrow">EST. 2026 · FITZROY</p>
            <h1>An atelier,<br><em>reimagined.</em></h1>
            <p class="salon-hero-sub">Editorial lashes, brows &amp; skin — now booking at our flagship on Gertrude Street.</p>
            <div class="salon-hero-btn">Book a session</div>
          </div>
        </div>
        <div class="salon-services">
          <div><span>CLASSIC</span><strong>$95</strong></div>
          <div><span>HYBRID</span><strong>$125</strong></div>
          <div><span>VOLUME</span><strong>$155</strong></div>
        </div>
      </div>
    `;

    const scenarios = [
      {
        url: 'oakridgephysio.com.au',
        file: 'oakridgephysio/index.html',
        client: { name: 'Dr Sarah', sub: 'Oakridge Physio', avatar: 'S', avatarBg: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
        turns: [
          { type: 'client-typing' },
          { type: 'client', body: "Hi! Quick one — can we update our consult fees? Initial is now $145 instead of $130." },
          { type: 'us-typing', delay: 500 },
          { type: 'us-reply', body: "Hi Sarah. No worries — want me to update it everywhere, pricing page and the FAQ?" },
          { type: 'code', tokens: [
            { txt: '// ', cls: 'c' }, { txt: 'oakridgephysio/pricing.html', cls: 'c' }, { txt: '\n', cls: '' },
            { txt: '<section', cls: 'k' }, { txt: ' class', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"fees"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '  <div>', cls: 'k' },
            { txt: 'Initial consult ', cls: '' },
            { txt: '<strong>', cls: 'k' }, { txt: '$145', cls: '' }, { txt: '</strong>', cls: 'k' },
            { txt: '</div>\n', cls: 'k' }
          ]},
          { type: 'client-typing' },
          { type: 'client', body: "Yes please 🙏 and one more thing — could you add Dr Patel to the team page? She's starting Monday, I'll send her bio + photo through." },
          { type: 'us-typing', delay: 400 },
          { type: 'us-reply', body: "Easy. I'll update the fees, add Dr Patel to the team page, push it live, and send a preview link." },
          { type: 'code', tokens: [
            { txt: '  <div>', cls: 'k' },
            { txt: 'Follow-up ', cls: '' },
            { txt: '<strong>', cls: 'k' },
            { txt: '$95', cls: '' },
            { txt: '</strong>', cls: 'k' },
            { txt: '</div>\n', cls: 'k' },
            { txt: '</section>\n\n', cls: 'k' },
            { txt: '<article', cls: 'k' }, { txt: ' class', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"clinician"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '  <h3>', cls: 'k' }, { txt: 'Dr Priya Patel', cls: '' }, { txt: '</h3>\n', cls: 'k' },
            { txt: '  <p>', cls: 'k' }, { txt: 'Sports & musculoskeletal physio', cls: '' }, { txt: '</p>\n', cls: 'k' },
            { txt: '</article>', cls: 'k' }
          ]},
          { type: 'us-typing', delay: 400 },
          { type: 'us-reply', body: "All done — fees updated and Dr Patel's profile is live." },
          { type: 'toast' },
          { type: 'reveal' }
        ],
        site: cafeMarkup
      },
      {
        url: 'luna-atelier.com.au',
        file: 'luna-atelier/index.html',
        client: { name: 'Mia', sub: 'Luna & Co', avatar: 'M', avatarBg: 'linear-gradient(135deg, #F9A8D4, #C084FC)' },
        turns: [
          { type: 'client-typing' },
          { type: 'client', body: "Hi! Finally signing the lease on the new studio next week 🥹" },
          { type: 'client-typing' },
          { type: 'client', body: "I'll need a whole new site for it. Keeping the Luna & Co site as-is for the original studio — this one's for the flagship." },
          { type: 'client-typing' },
          { type: 'client', body: "I assume it's the same build fee as the first one?" },
          { type: 'us-typing', delay: 500 },
          { type: 'us-reply', body: "Huge congrats on the new space Mia! Since you're a returning client, we'll take 15% off the build fee — our way of saying thanks." },
          { type: 'client-typing' },
          { type: 'client', body: "Oh amazing, thank you! 🥹 That's really kind of you." },
          { type: 'us-typing', delay: 400 },
          { type: 'us-reply', body: "Of course. What's the new brand called, and what vibe are you going for?" },
          { type: 'code', tokens: [
            { txt: '<!DOCTYPE html>\n', cls: '' },
            { txt: '<html', cls: 'k' }, { txt: ' lang', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"en"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '<head>\n', cls: 'k' },
            { txt: '  <meta', cls: 'k' }, { txt: ' charset', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"UTF-8"', cls: 's' }, { txt: '>\n', cls: 'k' }
          ]},
          { type: 'client-typing' },
          { type: 'client', body: "Luna Atelier. Want it to feel elevated — think Soho loft meets Parisian atelier." },
          { type: 'client-typing' },
          { type: 'client', body: "Same Fresha booking integration as the current site if that's okay." },
          { type: 'us-typing', delay: 400 },
          { type: 'us-reply', body: "Perfect direction. I'll carry the Fresha setup across and build something more editorial. First draft on the way." },
          { type: 'code', tokens: [
            { txt: '  <title>', cls: 'k' }, { txt: 'Luna Atelier', cls: '' }, { txt: '</title>\n', cls: 'k' },
            { txt: '  <link', cls: 'k' }, { txt: ' rel', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"stylesheet"', cls: 's' }, { txt: ' href', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"css/atelier.css"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '</head>\n', cls: 'k' },
            { txt: '<body>\n', cls: 'k' },
            { txt: '  <nav', cls: 'k' }, { txt: ' class', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"brand"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '    <a', cls: 'k' }, { txt: ' href', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"/"', cls: 's' }, { txt: '>', cls: 'k' },
            { txt: 'LUNA ATELIER', cls: '' }, { txt: '</a>\n', cls: 'k' },
            { txt: '  </nav>\n', cls: 'k' },
            { txt: '  <section', cls: 'k' }, { txt: ' class', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"hero"', cls: 's' }, { txt: '>\n', cls: 'k' },
            { txt: '    <h1>', cls: 'k' }, { txt: 'An atelier, reimagined.', cls: '' }, { txt: '</h1>\n', cls: 'k' }
          ]},
          { type: 'client-typing' },
          { type: 'client', body: "Oh, and could we show the address prominently? The new location is a huge deal for us." },
          { type: 'us-typing', delay: 350 },
          { type: 'us-reply', body: "Already slotted in. Drop me the exact address whenever you're ready." },
          { type: 'code', tokens: [
            { txt: '    <p>', cls: 'k' }, { txt: 'Now booking at our flagship.', cls: '' }, { txt: '</p>\n', cls: 'k' },
            { txt: '    <address>', cls: 'k' }, { txt: '27 Gertrude St, Fitzroy', cls: '' }, { txt: '</address>\n', cls: 'k' },
            { txt: '    <a', cls: 'k' }, { txt: ' class', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"btn"', cls: 's' }, { txt: '>', cls: 'k' },
            { txt: 'Book a session', cls: '' }, { txt: '</a>\n', cls: 'k' },
            { txt: '  </section>\n', cls: 'k' },
            { txt: '  <script', cls: 'k' }, { txt: ' src', cls: 'a' }, { txt: '=', cls: '' },
            { txt: '"fresha.embed.js"', cls: 's' }, { txt: '></script>\n', cls: 'k' },
            { txt: '</body>', cls: 'k' }
          ]},
          { type: 'us-typing', delay: 400 },
          { type: 'us-reply', body: "First draft is ready for review 👇" },
          { type: 'toast' },
          { type: 'reveal' }
        ],
        site: salonMarkup
      }
    ];

    let scenarioIdx = 0;
    let tickets = [];
    let running = false;
    let paused = false;
    let pauseResolvers = [];

    function waitWhilePaused() {
      if (!paused) return Promise.resolve();
      return new Promise(function (res) { pauseResolvers.push(res); });
    }

    function releasePause() {
      const rs = pauseResolvers;
      pauseResolvers = [];
      rs.forEach(function (r) { r(); });
    }

    async function wait(ms) {
      // Split into small chunks so hover-pause feels responsive
      const chunk = 60;
      let elapsed = 0;
      while (elapsed < ms) {
        if (!running) return;
        await waitWhilePaused();
        if (!running) return;
        const step = Math.min(chunk, ms - elapsed);
        await new Promise(function (res) {
          const handle = setTimeout(res, step);
          tickets.push(function () { clearTimeout(handle); });
        });
        elapsed += step;
      }
    }

    function reset() {
      tickets.forEach(function (t) { t(); });
      tickets = [];
      messagesEl.innerHTML = '';
      replyEl.innerHTML = '';
      codeEl.innerHTML = '';
      if (chatEl) chatEl.classList.remove('show');
      if (codeBlockEl) codeBlockEl.classList.remove('show');
      toastEl.classList.remove('show');
      siteEl.classList.remove('show');
      viewportEl.innerHTML = '';
      if (clientSubEl) clientSubEl.textContent = 'Online';
    }

    function addMessage(type, body) {
      const el = document.createElement('div');
      el.className = 'demo-message demo-message-' + type;
      el.innerHTML = body;
      messagesEl.appendChild(el);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.add('show');
          messagesEl.scrollTop = messagesEl.scrollHeight;
        });
      });
      return el;
    }

    function addTypingBubble() {
      const el = document.createElement('div');
      el.className = 'demo-message demo-message-client';
      el.innerHTML = '<span class="demo-typing"><span></span><span></span><span></span></span>';
      messagesEl.appendChild(el);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.add('show');
          messagesEl.scrollTop = messagesEl.scrollHeight;
        });
      });
      return el;
    }

    async function typeInto(element, text, speed) {
      speed = speed || 42;
      element.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'demo-chat-cursor';
      element.appendChild(cursor);
      for (let i = 0; i < text.length; i++) {
        if (!running) return;
        cursor.insertAdjacentText('beforebegin', text[i]);
        await wait(speed + (Math.random() * 30 - 10));
      }
      await wait(700);
      cursor.remove();
    }

    async function typeCode(tokens) {
      codeEl.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'demo-cursor';
      codeEl.appendChild(cursor);

      for (const tok of tokens) {
        if (!running) return;
        const span = document.createElement('span');
        if (tok.cls) span.className = tok.cls;
        codeEl.insertBefore(span, cursor);
        for (let i = 0; i < tok.txt.length; i++) {
          if (!running) return;
          span.textContent += tok.txt[i];
          codeEl.scrollTop = codeEl.scrollHeight;
          await wait(8 + Math.random() * 14);
        }
      }
      await wait(300);
      cursor.remove();
    }

    async function runScenario(s) {
      reset();
      if (!running) return;

      urlEl.textContent = s.url;
      fileEl.textContent = s.file;

      let currentTypingBubble = null;
      let codeStreamPromise = Promise.resolve();
      let chatShown = false;
      let codeShown = false;

      await wait(400);

      for (let i = 0; i < s.turns.length; i++) {
        if (!running) return;
        const turn = s.turns[i];

        if (turn.type === 'client-typing') {
          currentTypingBubble = addTypingBubble();
          await wait(1700 + Math.random() * 800);
          if (!running) return;
        }
        else if (turn.type === 'client') {
          if (currentTypingBubble) {
            currentTypingBubble.remove();
            currentTypingBubble = null;
          }
          addMessage('client', turn.body);
          await wait(1200 + Math.random() * 500);
        }
        else if (turn.type === 'us-typing') {
          if (!chatShown) {
            chatEl.classList.add('show');
            chatShown = true;
            await wait(400);
          }
          if (clientSubEl) clientSubEl.textContent = 'Replying…';
          replyEl.innerHTML = '<span class="demo-typing-dark"><span></span><span></span><span></span></span>';
          await wait((turn.delay || 800) + 600);
        }
        else if (turn.type === 'us-reply') {
          if (!chatShown) {
            chatEl.classList.add('show');
            chatShown = true;
            await wait(400);
          }
          if (clientSubEl) clientSubEl.textContent = 'Replying…';
          await typeInto(replyEl, turn.body);
          if (!running) return;
          addMessage('us', turn.body);
          if (clientSubEl) clientSubEl.textContent = 'Online';
          await wait(1200);
        }
        else if (turn.type === 'code') {
          // Show code block on first appearance
          if (!codeShown) {
            codeBlockEl.classList.add('show');
            codeShown = true;
            await wait(300);
          }
          // Stream the code tokens — don't await here so it runs in parallel with upcoming turns
          codeStreamPromise = codeStreamPromise.then(function () {
            return streamCodeTokens(turn.tokens);
          });
        }
        else if (turn.type === 'toast') {
          // Make sure all code is finished streaming before the toast
          await codeStreamPromise;
          if (!running) return;
          await wait(500);
          toastEl.classList.add('show');
          await wait(1800);
          if (!running) return;
          toastEl.classList.remove('show');
          await wait(350);
        }
        else if (turn.type === 'reveal') {
          viewportEl.innerHTML = s.site;
          siteEl.classList.add('show');
          await wait(8000);
          if (!running) return;
        }
      }

      // Wait for any trailing code stream
      await codeStreamPromise;
      if (!running) return;

      await wait(800);
      scenarioIdx = (scenarioIdx + 1) % scenarios.length;
      runScenario(scenarios[scenarioIdx]);
    }

    async function streamCodeTokens(tokens) {
      const existingCursor = codeEl.querySelector('.demo-cursor');
      if (existingCursor) existingCursor.remove();

      const cursor = document.createElement('span');
      cursor.className = 'demo-cursor';
      codeEl.appendChild(cursor);

      for (const tok of tokens) {
        if (!running) return;
        const span = document.createElement('span');
        if (tok.cls) span.className = tok.cls;
        codeEl.insertBefore(span, cursor);
        for (let i = 0; i < tok.txt.length; i++) {
          if (!running) return;
          span.textContent += tok.txt[i];
          codeEl.scrollTop = codeEl.scrollHeight;
          await wait(6 + Math.random() * 10);
        }
      }
    }

    function startDemo() {
      if (running) return;
      running = true;
      runScenario(scenarios[scenarioIdx]);
    }

    function stopDemo() {
      running = false;
      tickets.forEach(function (t) { t(); });
      tickets = [];
    }

    demo.addEventListener('mouseenter', function () { paused = true; });
    demo.addEventListener('mouseleave', function () { paused = false; releasePause(); });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) startDemo();
          else stopDemo();
        });
      }, { threshold: 0.2 });
      io.observe(demo);
    } else {
      startDemo();
    }
  }
})();

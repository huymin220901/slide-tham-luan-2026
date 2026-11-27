/* =========================================================
   ĐIỀU KHIỂN TRÌNH CHIẾU
   Phím: → / Space / PageDown / click: slide sau · ← / PageUp: slide trước
         Home / End: đầu / cuối · F: toàn màn hình · R: chạy lại hiệu ứng
   ========================================================= */

/* Chữ chân trang dùng chung cho mọi slide — sửa ở đây */
const FOOTER_TEXT = 'THAM LUẬN · HỘI NGHỊ TỔNG KẾT CÔNG TÁC NĂM 2026';
const LOGO_LINE1 = 'BỘ TƯ LỆNH CSCĐ';
const LOGO_LINE2 = 'ĐOÀN CSĐN SỐ 1';

/* Thanh tiến trình I–V ở chân trang. Mỗi slide khai báo data-prog="I".."V" (hoặc "mo-dau") */
const PARTS = ['I', 'II', 'III', 'IV', 'V'];

/* Bộ icon (nét vẽ theo màu chữ: currentColor) */
const ICONS = {
  target:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 1.7V10M20 30v8.3M1.7 20H10M30 20h8.3M35 20a15 15 0 1 1-30 0 15 15 0 0 1 30 0ZM28.3 20a8.3 8.3 0 1 1-16.6 0 8.3 8.3 0 0 1 16.6 0Z"/></svg>',
  clock:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.7V20l5.8 4.2M35 20a15 15 0 1 1-30 0 15 15 0 0 1 30 0Z"/></svg>',
  star:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m20 5 4.9 10.2 10.9 1.5-7.9 7.6 1.9 11-9.8-5.1-9.8 5.1 1.9-11-7.9-7.6 10.9-1.5L20 5Z"/></svg>',
  shield:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12.75 18 3.75 3.75 7.5-7.5M18 3l12 4.5v9c0 8.25-5.25 14.25-12 16.5C11.25 30.75 6 24.75 6 16.5v-9L18 3Z"/></svg>',
  doc:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21.75 3H8.25v30h19.5V9l-6-6Zm6 6h-6V3m-9 13.5h10.5m-10.5 5.25h10.5M12.75 27h6"/></svg>',
  group:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9.75 31.5c0-8.25 3.75-12 8.25-12s8.25 3.75 8.25 12M2.25 28.5c0-5.25 2.25-7.5 6-7.5 1.5 0 2.63.38 3.75 1.13M33.75 28.5c0-5.25-2.25-7.5-6-7.5-1.5 0-2.63.38-3.75 1.13M22.5 9.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-10.88 3.75a3.38 3.38 0 1 1-6.75 0 3.38 3.38 0 0 1 6.75 0Zm19.5 0a3.38 3.38 0 1 1-6.75 0 3.38 3.38 0 0 1 6.75 0Z"/></svg>',
  person:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 30.75c0-7.5 4.5-11.25 10.5-11.25s10.5 3.75 10.5 11.25M23.25 10.5a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"/></svg>',
  check:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 18.75 7.5 7.5 13.5-16.5"/></svg>',
  vr:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 16.5h3m27 0h3M4.5 12h27v12h-9l-3-4.5h-3l-3 4.5h-9V12Z"/></svg>',
  flag:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 33V3m0 1.5h21l-4.5 6 4.5 6h-21"/></svg>',
  clock36:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10.5V18l5.25 3.75M31.5 18a13.5 13.5 0 1 1-27 0 13.5 13.5 0 0 1 27 0Z"/></svg>',
  x:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8l16 16M24 8 8 24"/></svg>',
  tick:'<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m9.2 22.9 9.1 9.2 16.5-20.2"/></svg>',
  arrow:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.3 32h45.4M41.3 18.7 54.7 32 41.3 45.3"/></svg>',
  shuffle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22M18 2l4 4-4 4M2 6h1.9c1.5 0 2.9.9 3.6 2.2M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8M18 14l4 4-4 4"/></svg>',
  shieldPlain:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  chevL:'<svg viewBox="0 0 20 16"><path d="M0 0h5.9L10 8l-4.1 8H0l4.1-8L0 0Zm10 0h5.9L20 8l-4.1 8H10l4.1-8L10 0Z" fill="currentColor"/></svg>',
  chevR:'<svg viewBox="0 0 20 16"><path d="M20 0h-5.9L10 8l4.1 8H20l-4.1-8L20 0ZM10 0H4.1L0 8l4.1 8H10L5.9 8 10 0Z" fill="currentColor"/></svg>',
};

if (location.search.includes("tinh")) document.body.classList.add("static");
const stage = document.getElementById('stage');
const slides = [...stage.querySelectorAll('.slide')];
let cur = 0;

/* --- Dựng phần lặp lại: icon, logo, chân trang, tiến trình --- */
document.querySelectorAll('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', ICONS[el.dataset.icon] || ''); });
slides.forEach((s, i) => {
  const chrome = (s.dataset.chrome || '').split(' ');
  if (chrome.includes('logo')) s.insertAdjacentHTML('beforeend',
    `<div class="el logo"><img src="assets/logo_badge.png" alt=""><div><div class="l1">${LOGO_LINE1}</div><div class="l2">${LOGO_LINE2}</div></div></div>`);
  if (chrome.includes('footer')) s.insertAdjacentHTML('beforeend',
    `<div class="el footer"><span class="fl">${FOOTER_TEXT}</span><span class="fn">${String(i + 1).padStart(2, '0')}</span></div>`);
  if (s.dataset.prog) {
    const at = PARTS.indexOf(s.dataset.prog);
    const html = PARTS.map((p, j) => (j ? `<i class="${j <= at ? 'on' : ''}"></i>` : '') +
      `<b class="${j < at ? 'done' : j === at ? 'now' : ''}">${p}</b>`).join('');
    s.insertAdjacentHTML('beforeend', `<div class="el prog" style="top:${s.dataset.progTop || 1016}px">${html}</div>`);
  }
  /* Tự xếp thời điểm xuất hiện theo thứ tự trong slide */
  let k = 0;
  s.querySelectorAll('[data-a]').forEach(el => {
    const d = el.dataset.d != null ? +el.dataset.d : 0.25 + k * 0.14;
    el.style.setProperty('--d', d + 's');
    k++;
  });
});

/* --- Co giãn vừa cửa sổ --- */
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%,-50%) scale(${s})`;
}
addEventListener('resize', fit); fit();

/* --- Chuyển slide --- */
const hud = document.getElementById('hud'), bar = document.getElementById('bar');
function go(n, force) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  if (n === cur && !force) return;
  const prev = slides[cur];
  if (prev !== slides[n]) {
    prev.classList.remove('active'); prev.classList.add('leaving');
    setTimeout(() => prev.classList.remove('leaving'), 850);
  }
  const s = slides[n];
  s.classList.remove('active'); void s.offsetWidth; s.classList.add('active');
  cur = n;
  hud.textContent = `${n + 1} / ${slides.length}`;
  bar.style.width = ((n + 1) / slides.length * 100) + '%';
}
addEventListener('keydown', e => {
  if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') { const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {}); }
  else if (e.key === 'r' || e.key === 'R') go(cur, true);
});
addEventListener('click', e => { (e.clientX > innerWidth * 0.3) ? go(cur + 1) : go(cur - 1); });
let tx = null;
addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive: true});
addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); tx = null; });
let hudT; addEventListener('mousemove', () => { document.body.classList.add('show-hud'); clearTimeout(hudT); hudT = setTimeout(() => document.body.classList.remove('show-hud'), 1800); });

/* Mở link (hoặc tải lại trang) luôn bắt đầu từ slide đầu tiên */
cur = 0;
if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }

/* --- Tải trước toàn bộ ảnh + font rồi mới bắt đầu, để khi trình chiếu không bị giật --- */
(async function preload() {
  const loader = document.getElementById('loader');
  const urls = new Set();
  stage.querySelectorAll('img').forEach(i => urls.add(i.getAttribute('src')));
  stage.querySelectorAll('[style*="url("]').forEach(el => {
    const m = el.getAttribute('style').match(/url\(([^)]+)\)/); if (m) urls.add(m[1].replace(/["']/g, ''));
  });
  ['assets/star_bullet.png', 'assets/star_gold.png'].forEach(u => urls.add(u));
  const list = [...urls]; let done = 0; const kept = window.__preloaded = [];
  const bar = loader && loader.querySelector('i');
  const tick = () => { done++; if (bar) bar.style.width = (done / list.length * 100) + '%'; };
  const load = u => new Promise(res => {
    const im = new Image(); im.src = u; kept.push(im);
    (im.decode ? im.decode() : new Promise((ok, no) => { im.onload = ok; im.onerror = no; }))
      .catch(() => {}).then(() => { tick(); res(); });
  });
  const timeout = new Promise(res => setTimeout(res, 15000)); /* mạng chậm: tối đa 15 giây rồi vẫn chạy */
  await Promise.race([Promise.all([...list.map(load), document.fonts ? document.fonts.ready : null]), timeout]);
  if (loader) { loader.classList.add('done'); setTimeout(() => loader.remove(), 700); }
  go(cur, true);
})();

/* Karteikasten Developer · NPS-Widget ("Würdest du uns weiterempfehlen?" 0-10)
   Einbau: <script src="https://ajaronn.github.io/vokdev/nps-widget.js" data-form="NPS-ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR" */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/nps';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var script = document.currentScript, host = null, timer = null;

  var UI = {
    de: { open: 'Feedback geben', close: 'Schließen', title: 'Weiterempfehlung', q: 'Wie wahrscheinlich ist es, dass du uns weiterempfiehlst?', low: 'Unwahrscheinlich', high: 'Sehr wahrscheinlich', cm: 'Möchtest du uns noch etwas sagen? (optional)', send: 'Absenden', ok: 'Danke für dein Feedback!', change: 'Antwort ändern', eChoose: 'Bitte wähle einen Wert von 0 bis 10.', eSlow: 'Zu viele Anfragen. Bitte warte einen Moment.', eDom: 'Diese Funktion darf auf dieser Webseite nicht genutzt werden.', eFail: 'Senden fehlgeschlagen. Bitte versuche es später noch einmal.', eNet: 'Keine Verbindung. Prüfe dein Internet.' },
    en: { open: 'Give feedback', close: 'Close', title: 'Recommendation', q: 'How likely are you to recommend us to a friend or colleague?', low: 'Not likely', high: 'Very likely', cm: 'Anything else you want to tell us? (optional)', send: 'Submit', ok: 'Thanks for your feedback!', change: 'Change answer', eChoose: 'Please choose a value from 0 to 10.', eSlow: 'Too many requests. Please wait a moment.', eDom: 'This feature may not be used on this website.', eFail: 'Sending failed. Please try again later.', eNet: 'No connection. Check your internet.' },
    'pt-BR': { open: 'Dar feedback', close: 'Fechar', title: 'Recomendação', q: 'Qual a probabilidade de você nos recomendar a um amigo ou colega?', low: 'Improvável', high: 'Muito provável', cm: 'Quer nos contar mais alguma coisa? (opcional)', send: 'Enviar', ok: 'Obrigado pelo seu feedback!', change: 'Alterar resposta', eChoose: 'Escolha um valor de 0 a 10.', eSlow: 'Solicitações demais. Aguarde um momento.', eDom: 'Este recurso não pode ser usado neste site.', eFail: 'Falha ao enviar. Tente novamente mais tarde.', eNet: 'Sem conexão. Verifique sua internet.' }
  };
  var FONTS = { system: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', serif: 'Georgia,"Times New Roman",serif', mono: 'ui-monospace,Menlo,Consolas,monospace' };

  function pickLang(c, force) {
    var l = force || (c.lang && c.lang !== 'auto' ? c.lang : (document.documentElement.lang || navigator.language || 'en'));
    l = String(l).toLowerCase();
    return l.indexOf('pt') === 0 ? 'pt-BR' : l.indexOf('de') === 0 ? 'de' : 'en';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function onColor(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return '#fff';
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#111' : '#fff';
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { } return null; }
  function vid() {
    var v = store('kk_fb_vid'); // gleiche Geräte-ID wie Feedback- und Umfrage-Widget
    if (!v || !/^[a-z0-9]{16,40}$/.test(v)) {
      v = ''; var a = new Uint8Array(16);
      (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
      a.forEach(function (x) { v += (x % 36).toString(36); });
      store('kk_fb_vid', v);
    }
    return v;
  }

  var CSS = ':host{all:initial}*{box-sizing:border-box}.w{--bg:#fff;--fg:#1d1d1f;--mut:#6b6b70;--bd:#d9d9de;--err:#8a1c1c;--errbg:#fde8e8;position:fixed;z-index:2147482970;font:15px/1.45 var(--f);color:var(--fg)}' +
    '.w.dark{--bg:#1e1e21;--fg:#f2f2f4;--mut:#9a9aa1;--bd:#3d3d43;--err:#f3b4b4;--errbg:#472222}' +
    '.w.fab{bottom:calc(16px + env(safe-area-inset-bottom))}.w.fab.r{right:16px}.w.fab.l{left:16px}.w.mod{inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(0,0,0,.45)}.w[hidden]{display:none}' +
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 16px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}.lb[hidden]{display:none}.lb .e{font-size:24px}' +
    'button:focus-visible,textarea:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{width:min(420px,calc(100vw - 24px));max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}.p[hidden]{display:none}' +
    '.fab .p{position:absolute;bottom:68px;max-height:calc(100dvh - 110px)}.fab.r .p{right:0}.fab.l .p{left:0}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer}' +
    '.bd{overflow-y:auto;padding:14px}.q{margin:0 0 12px;font-weight:600;font-size:16px}' +
    '.sc{display:grid;grid-template-columns:repeat(11,1fr);gap:4px}.sc button{height:38px;padding:0;border:1px solid var(--bd);border-radius:calc(var(--r) * .4);background:var(--bg);color:var(--fg);font:600 14px var(--f);cursor:pointer}.sc button:hover{border-color:var(--c)}.sc button.sel{background:var(--c);border-color:var(--c);color:var(--on)}' +
    '.lg{display:flex;justify-content:space-between;gap:8px;margin:6px 0 12px;font-size:12px;color:var(--mut)}' +
    '.cm{margin:0 0 6px;font-size:14px;font-weight:600}.ta{width:100%;min-height:76px;resize:vertical;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:16px var(--f)}.ta[hidden],.cm[hidden]{display:none}' +
    '.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.er{margin:6px 0 0;padding:8px 10px;border-radius:calc(var(--r) * .6);background:var(--errbg);color:var(--err);font-size:13px}.er[hidden]{display:none}' +
    '.sb,.at{width:100%;margin-top:10px;border:0;border-radius:calc(var(--r) * .6);padding:11px;background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer}.sb:disabled{opacity:.55;cursor:default}.at{background:transparent;color:var(--c);border:1px solid var(--c)}' +
    '.done[hidden],form[hidden]{display:none}.ok{text-align:center;padding:4px 0 2px}.ok .e{font-size:36px}.ok p{margin:8px 0}' +
    '.ft{padding:6px 14px 10px;font-size:11px;color:var(--mut);text-align:right}.ft a{color:var(--mut)}' +
    '@media(max-width:380px){.sc{grid-template-columns:repeat(6,1fr)}}';

  function destroy() { if (timer) { clearTimeout(timer); timer = null; } if (host) { host.remove(); host = null; } }
  function post(id, body) {
    body.id = id; body.page = (location.origin + location.pathname).slice(0, 300); body.vid = vid();
    return fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); });
  }

  /* o: {id, cfg, voted, open, lang} */
  function build(o) {
    destroy();
    var id = o.id, c = o.cfg, lang = pickLang(c, o.lang), T = UI[lang];
    var color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#A8442E';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : Math.max(0, Math.min(28, +c.radius || 0));
    var popup = c.mode === 'popup' && !o.open;
    var title = c.title || T.title, emoji = c.emoji || '⭐', question = c.question || T.q;
    var pos = c.position === 'left' ? 'l' : 'r', mk = dark ? ' dark' : '';
    var score = o.voted ? o.voted.score : null, busy = false;

    host = document.createElement('div'); host.id = 'kk-nps-host';
    var sh = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var w = document.createElement('div');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system);

    var btns = ''; for (var i = 0; i <= 10; i++) btns += '<button type="button" data-s="' + i + '" aria-label="' + i + '">' + i + '</button>';
    w.innerHTML = '<div class="p" role="dialog" aria-label="' + esc(title) + '" hidden><div class="h"><span style="font-size:24px">' + esc(emoji) + '</span><div><b>' + esc(title) + '</b></div><button type="button" class="x" aria-label="' + T.close + '">×</button></div>' +
      '<div class="bd"><form novalidate><p class="q">' + esc(question) + '</p><div class="sc" role="group" aria-label="0-10">' + btns + '</div>' +
      '<div class="lg"><span>' + esc(c.low_label || T.low) + '</span><span>' + esc(c.high_label || T.high) + '</span></div>' +
      (c.comment_on ? '<p class="cm" hidden>' + esc(c.comment_label || T.cm) + '</p><textarea class="ta" maxlength="1000" hidden></textarea>' : '') +
      '<div class="hp" aria-hidden="true"><label>Website<input type="text" class="hpf" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="er" role="alert" hidden></div><button type="submit" class="sb">' + T.send + '</button></form><div class="done" hidden></div></div>' +
      '<div class="ft">powered by <a href="' + HOME + '" target="_blank" rel="noopener">Karteikasten Developer</a></div></div>' +
      '<button type="button" class="lb" aria-label="' + T.open + '"><span class="e">' + esc(emoji) + '</span>' + (c.launcher ? '<span>' + esc(c.launcher) + '</span>' : '') + '</button>';
    sh.appendChild(w); document.body.appendChild(host);

    var $ = function (s) { return w.querySelector(s); }, panel = $('.p'), lb = $('.lb'), form = $('form'), er = $('.er'), sb = $('.sb'), done = $('.done'), ta = $('.ta'), cm = $('.cm');
    function err(t) { er.textContent = t; er.hidden = !t; }

    var isOpen = false;
    function setOpen(v) {
      isOpen = v; panel.hidden = !v; lb.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (popup && v) { w.className = 'w mod' + mk; w.hidden = false; lb.hidden = true; }
      else if (popup) { w.className = 'w fab ' + pos + mk; lb.hidden = !c.popup_button; w.hidden = !c.popup_button; }
      else { w.className = 'w fab ' + pos + mk; lb.hidden = false; w.hidden = false; }
    }
    setOpen(false); if (popup) w.hidden = true;

    function select(n) {
      score = n;
      Array.prototype.forEach.call(w.querySelectorAll('.sc button'), function (b) { b.classList.toggle('sel', +b.getAttribute('data-s') === n); b.setAttribute('aria-pressed', +b.getAttribute('data-s') === n ? 'true' : 'false'); });
      if (ta) { ta.hidden = false; cm.hidden = false; }
      err('');
    }
    Array.prototype.forEach.call(w.querySelectorAll('.sc button'), function (b) { b.onclick = function () { select(+b.getAttribute('data-s')); }; });
    if (o.voted) { select(o.voted.score); if (ta) ta.value = o.voted.comment || ''; }

    function dismiss() { store('kk_nps_x_' + id, String(Date.now())); setOpen(false); }
    $('.x').onclick = function () { if (popup) dismiss(); else setOpen(false); };
    lb.onclick = function () { setOpen(!isOpen); };
    if (popup) w.addEventListener('mousedown', function (e) { if (e.target === w) dismiss(); });
    sh.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { popup ? dismiss() : setOpen(false); } });

    function showDone() {
      done.hidden = false; form.hidden = true; done.textContent = '';
      var d = document.createElement('div'); d.className = 'ok';
      d.innerHTML = '<div class="e">✅</div><p>' + esc(c.success || T.ok) + '</p><button type="button" class="at ed">' + T.change + '</button>' + (popup ? '<button type="button" class="at cl">' + T.close + '</button>' : '');
      done.appendChild(d);
      d.querySelector('.ed').onclick = function () { done.hidden = true; form.hidden = false; };
      var cl = d.querySelector('.cl'); if (cl) cl.onclick = function () { setOpen(false); };
    }
    if (o.voted) showDone();

    form.onsubmit = function (e) {
      e.preventDefault(); if (busy) return; err('');
      if (score === null) return err(T.eChoose);
      busy = true; sb.disabled = true;
      post(id, { action: 'vote', score: score, comment: ta ? ta.value.trim() : '', lang: lang, hp: $('.hpf').value })
        .then(function (x) {
          busy = false; sb.disabled = false;
          if (x.ok) { showDone(); return; }
          var k = x.j && x.j.error; err(k === 'slow' ? T.eSlow : k === 'domain' ? T.eDom : T.eFail);
        }).catch(function () { busy = false; sb.disabled = false; err(T.eNet); });
    };

    if (o.open) setOpen(true);
    else if (popup && !o.voted) {
      var x = +store('kk_nps_x_' + id) || 0;
      if (!x || Date.now() - x > 30 * 864e5) timer = setTimeout(function () { setOpen(true); }, Math.max(0, +c.popup_delay || 0) * 1000);
      else setOpen(false);
    }
  }

  function mount(id, opt) {
    opt = opt || {};
    if (!/^[a-z0-9]{4,20}$/.test(id || '')) return;
    post(id, { action: 'config' }).then(function (x) {
      if (!x.ok || !x.j || !x.j.pub) return;
      build({ id: id, cfg: x.j.pub, voted: x.j.voted, open: !!opt.open, lang: opt.lang });
    }).catch(function () { });
  }
  window.KKNps = { mount: mount, destroy: destroy };

  if (script && script.getAttribute('data-form')) {
    var go = function () { mount(script.getAttribute('data-form'), { open: script.getAttribute('data-open') === 'true', lang: script.getAttribute('data-lang') || undefined }); };
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
  }
})();

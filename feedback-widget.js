/* Karteikasten Developer · Feedback-Widget (Sterne-Bewertung + Bewertungen ansehen)
   Einbau: <script src="https://ajaronn.github.io/vokdev/feedback-widget.js" data-form="FORM-ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR" */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/feedback';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var script = document.currentScript, host = null;

  var UI = {
    de: { open: 'Feedback öffnen', close: 'Schließen', title: 'Feedback', intro: 'Wie gefällt dir diese Seite? Gib uns Sterne.', tabRate: 'Bewerten', tabList: 'Bewertungen', stars: 'Sterne', name: 'Name', opt: ' (optional)', comment: 'Dein Kommentar', send: 'Bewertung senden', sending: 'Wird gesendet …', ok: 'Danke für dein Feedback!', edit: 'Bewertung ändern', see: 'Bewertungen ansehen',
      eStar: 'Bitte wähle zuerst Sterne.', eName: 'Bitte gib deinen Namen an.', eComment: 'Bitte schreib einen Kommentar.', eSlow: 'Zu viele Anfragen. Bitte warte einen Moment.', eDom: 'Diese Funktion darf auf dieser Webseite nicht genutzt werden.', eFail: 'Senden fehlgeschlagen. Bitte versuche es später noch einmal.', eNet: 'Keine Verbindung. Prüfe dein Internet.',
      none: 'Noch keine Bewertungen. Sei der Erste!', more: 'Mehr laden', reviews: 'Bewertungen', anon: 'Anonym', chars: 'Zeichen', load: 'Lädt …' },
    en: { open: 'Open feedback', close: 'Close', title: 'Feedback', intro: 'How do you like this page? Give us stars.', tabRate: 'Rate', tabList: 'Reviews', stars: 'stars', name: 'Name', opt: ' (optional)', comment: 'Your comment', send: 'Submit rating', sending: 'Sending …', ok: 'Thanks for your feedback!', edit: 'Change rating', see: 'See reviews',
      eStar: 'Please choose stars first.', eName: 'Please enter your name.', eComment: 'Please write a comment.', eSlow: 'Too many requests. Please wait a moment.', eDom: 'This feature may not be used on this website.', eFail: 'Sending failed. Please try again later.', eNet: 'No connection. Check your internet.',
      none: 'No reviews yet. Be the first!', more: 'Load more', reviews: 'reviews', anon: 'Anonymous', chars: 'characters', load: 'Loading …' },
    'pt-BR': { open: 'Abrir feedback', close: 'Fechar', title: 'Feedback', intro: 'O que você acha desta página? Dê estrelas.', tabRate: 'Avaliar', tabList: 'Avaliações', stars: 'estrelas', name: 'Nome', opt: ' (opcional)', comment: 'Seu comentário', send: 'Enviar avaliação', sending: 'Enviando …', ok: 'Obrigado pelo feedback!', edit: 'Alterar avaliação', see: 'Ver avaliações',
      eStar: 'Escolha as estrelas primeiro.', eName: 'Informe seu nome.', eComment: 'Escreva um comentário.', eSlow: 'Solicitações demais. Aguarde um momento.', eDom: 'Este recurso não pode ser usado neste site.', eFail: 'Falha ao enviar. Tente novamente mais tarde.', eNet: 'Sem conexão. Verifique sua internet.',
      none: 'Ainda sem avaliações. Seja o primeiro!', more: 'Carregar mais', reviews: 'avaliações', anon: 'Anônimo', chars: 'caracteres', load: 'Carregando …' }
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
    var v = store('kk_fb_vid');
    if (!v || !/^[a-z0-9]{16,40}$/.test(v)) {
      v = ''; var a = new Uint8Array(16);
      (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
      a.forEach(function (x) { v += (x % 36).toString(36); });
      store('kk_fb_vid', v);
    }
    return v;
  }
  function stars(n) { var s = ''; for (var i = 1; i <= 5; i++) s += i <= Math.round(n) ? '★' : '☆'; return s; }

  var CSS = ':host{all:initial}*{box-sizing:border-box}.w{--bg:#fff;--fg:#1d1d1f;--mut:#6b6b70;--bd:#d9d9de;--err:#8a1c1c;--errbg:#fde8e8;--gold:#e0a100;position:fixed;bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147482980;font:15px/1.45 var(--f);color:var(--fg)}' +
    '.w.dark{--bg:#1e1e21;--fg:#f2f2f4;--mut:#9a9aa1;--bd:#3d3d43;--err:#f3b4b4;--errbg:#472222;--gold:#f0b823}.w.r{right:16px}.w.l{left:16px}' +
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 16px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}.lb .e{font-size:24px;line-height:1}' +
    '.lb:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{position:absolute;bottom:68px;width:min(var(--pw),calc(100vw - 24px));max-height:calc(100dvh - 110px);display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}.r .p{right:0}.l .p{left:0}.p[hidden]{display:none}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '.tabs{display:flex;border-bottom:1px solid var(--bd)}.tabs button{flex:1;padding:10px;border:0;border-bottom:3px solid transparent;background:transparent;color:var(--mut);font:600 14px var(--f);cursor:pointer}.tabs button[aria-selected=true]{color:var(--fg);border-bottom-color:var(--c)}' +
    '.bd{overflow-y:auto;padding:12px 14px 14px}.in{margin:0 0 10px;color:var(--mut);font-size:14px}' +
    '.sr{display:flex;justify-content:center;gap:4px;margin:6px 0 4px}.st{border:0;background:transparent;font-size:38px;line-height:1;color:var(--bd);cursor:pointer;padding:2px 3px}.st.on{color:var(--gold)}' +
    '.sl{text-align:center;min-height:20px;color:var(--mut);font-size:13px}' +
    'label{display:block;font-weight:600;font-size:13px;margin:10px 0 4px}label small{font-weight:400;color:var(--mut)}' +
    'input[type=text],textarea{width:100%;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:16px var(--f)}textarea{resize:vertical;min-height:90px}' +
    '.cnt{text-align:right;font-size:11px;color:var(--mut)}.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.er{margin:10px 0 0;padding:8px 10px;border-radius:calc(var(--r) * .6);background:var(--errbg);color:var(--err);font-size:13px}.er[hidden]{display:none}' +
    '.sb,.at{width:100%;margin-top:12px;border:0;border-radius:calc(var(--r) * .6);padding:11px;background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer}.sb:disabled{opacity:.55;cursor:default}.at{background:transparent;color:var(--fg);border:1px solid var(--bd);padding:8px;font-weight:400;font-size:14px}' +
    '.ok{text-align:center;padding:20px 8px}.ok .e{font-size:40px}.ok p{margin:10px 0 6px}' +
    '.sm{display:flex;gap:16px;align-items:center;margin-bottom:12px}.big{font-size:40px;font-weight:700;line-height:1}.sm .s{color:var(--gold);font-size:18px;letter-spacing:1px}.sm small{color:var(--mut)}.ds{flex:1}.ds div{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--mut)}.ds i{flex:1;height:6px;border-radius:3px;background:var(--bd);overflow:hidden}.ds i b{display:block;height:100%;background:var(--gold)}.ds span{width:8px;text-align:right}' +
    '.rl{list-style:none;margin:0;padding:0}.rl li{padding:10px 0;border-top:1px solid var(--bd)}.rl .t{display:flex;justify-content:space-between;gap:8px;font-size:13px}.rl .s{color:var(--gold);letter-spacing:1px}.rl .d{color:var(--mut);font-size:12px}.rl p{margin:4px 0 0;font-size:14px;overflow-wrap:anywhere;white-space:pre-wrap}' +
    '.mu{color:var(--mut);text-align:center;padding:16px 0;font-size:14px}' +
    '.ft{padding:6px 14px 10px;font-size:11px;color:var(--mut);text-align:right}.ft a{color:var(--mut)}' +
    '@media(max-width:480px){.p{position:fixed;inset:0;width:100vw;max-height:none;height:100dvh;border-radius:0;border:0}}';

  function destroy() { if (host) { host.remove(); host = null; } }

  function build(id, c, open, forceLang) {
    destroy();
    var lang = pickLang(c, forceLang), T = UI[lang], color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#A8442E';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : Math.max(0, Math.min(28, +c.radius || 0));
    var maxChars = Math.max(50, Math.min(2000, +c.max_chars || 600));
    var nameMode = c.ask_name === 'required' ? 2 : c.ask_name === 'off' ? 0 : 1;
    var comMode = c.ask_comment === 'required' ? 2 : c.ask_comment === 'off' ? 0 : 1;
    var showList = c.show_reviews !== false;
    var page = (location.origin + location.pathname).slice(0, 300);
    var memKey = 'kk_fb_' + id + '_' + (c.scope === 'page' ? page : '');
    var mem = {}; try { mem = JSON.parse(store(memKey) || '{}') || {}; } catch (e) { }
    var rating = +mem.rating >= 1 && +mem.rating <= 5 ? +mem.rating : 0, busy = false, offset = 0;

    host = document.createElement('div'); host.id = 'kk-feedback-host';
    var sh = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var w = document.createElement('div');
    w.className = 'w ' + (c.position === 'left' ? 'l' : 'r') + (dark ? ' dark' : '');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system) + ';--pw:380px';

    var title = c.title || T.title, intro = c.intro || T.intro, emoji = c.emoji || '⭐';
    var starBtns = ''; for (var i = 1; i <= 5; i++) starBtns += '<button type="button" class="st" data-n="' + i + '" aria-label="' + i + ' ' + T.stars + '">★</button>';
    w.innerHTML = '<div class="p" role="dialog" aria-label="' + esc(title) + '" hidden><div class="h"><span style="font-size:24px">' + esc(emoji) + '</span><div><b>' + esc(title) + '</b></div><button type="button" class="x" aria-label="' + T.close + '">×</button></div>' +
      (showList ? '<div class="tabs" role="tablist"><button type="button" role="tab" class="tr" aria-selected="true">' + T.tabRate + '</button><button type="button" role="tab" class="tl" aria-selected="false">' + T.tabList + '</button></div>' : '') +
      '<div class="bd"><div class="vr"><form novalidate><p class="in">' + esc(intro) + '</p><div class="sr" role="group" aria-label="' + T.tabRate + '">' + starBtns + '</div><div class="sl" aria-live="polite"></div>' +
      (nameMode ? '<label for="n">' + T.name + (nameMode === 1 ? '<small>' + T.opt + '</small>' : '') + '</label><input id="n" type="text" maxlength="60" autocomplete="name">' : '') +
      (comMode ? '<label for="m">' + T.comment + (comMode === 1 ? '<small>' + T.opt + '</small>' : '') + '</label><textarea id="m" maxlength="' + maxChars + '"></textarea><div class="cnt"><span class="cn">0</span> / ' + maxChars + '</div>' : '') +
      '<div class="hp" aria-hidden="true"><label>Website<input type="text" class="hpf" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="er" role="alert" hidden></div><button type="submit" class="sb">' + T.send + '</button></form></div>' +
      (showList ? '<div class="vl" hidden></div>' : '') + '</div>' +
      '<div class="ft">powered by <a href="' + HOME + '" target="_blank" rel="noopener">Karteikasten Developer</a></div></div>' +
      '<button type="button" class="lb" aria-label="' + T.open + '"><span class="e">' + esc(emoji) + '</span><span class="av"></span>' + (c.launcher ? '<span>' + esc(c.launcher) + '</span>' : '') + '</button>';
    sh.appendChild(w); document.body.appendChild(host);

    var $ = function (s) { return w.querySelector(s); };
    var panel = $('.p'), form = $('form'), er = $('.er'), sb = $('.sb'), ta = $('#m'), nm = $('#n'), vr = $('.vr'), vl = $('.vl'), lbl = $('.sl');
    if (nm && mem.name) nm.value = mem.name;
    if (ta && mem.comment) { ta.value = mem.comment; $('.cn').textContent = ta.value.length; }

    function err(t) { er.textContent = t; er.hidden = !t; }
    function drawStars(n) {
      Array.prototype.forEach.call(w.querySelectorAll('.st'), function (b) { b.classList.toggle('on', +b.dataset.n <= n); b.setAttribute('aria-pressed', +b.dataset.n === rating ? 'true' : 'false'); });
      lbl.textContent = n ? n + ' / 5 ' + T.stars : '';
    }
    Array.prototype.forEach.call(w.querySelectorAll('.st'), function (b) {
      b.onclick = function () { rating = +b.dataset.n; drawStars(rating); err(''); };
      b.onmouseenter = function () { drawStars(+b.dataset.n); };
      b.onmouseleave = function () { drawStars(rating); };
    });
    drawStars(rating);
    if (ta) ta.oninput = function () { $('.cn').textContent = ta.value.length; };

    function post(body) {
      body.id = id; body.page = page; body.vid = vid();
      return fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); });
    }

    form.onsubmit = function (e) {
      e.preventDefault(); if (busy) return; err('');
      var n = nm ? nm.value.trim() : '', m = ta ? ta.value.trim() : '';
      if (!rating) return err(T.eStar);
      if (nameMode === 2 && !n) return err(T.eName);
      if (comMode === 2 && !m) return err(T.eComment);
      busy = true; sb.disabled = true; sb.textContent = T.sending;
      post({ action: 'submit', lang: lang, rating: rating, name: n, comment: m, hp: $('.hpf').value })
        .then(function (o) {
          if (o.ok && o.j.ok) { store(memKey, JSON.stringify({ rating: rating, name: n, comment: m })); return done(); }
          var k = o.j && o.j.error;
          err(k === 'slow' ? T.eSlow : k === 'domain' ? T.eDom : k === 'rating' ? T.eStar : T.eFail);
        })
        .catch(function () { err(T.eNet); })
        .then(function () { busy = false; sb.disabled = false; sb.textContent = T.send; });
    };

    function done() {
      var d = document.createElement('div'); d.className = 'ok';
      d.innerHTML = '<div class="e">✅</div><p>' + esc(c.success || T.ok) + '</p>' + (showList ? '<button type="button" class="at see">' + T.see + '</button>' : '') + '<button type="button" class="at ed">' + T.edit + '</button>';
      form.hidden = true; vr.appendChild(d);
      d.querySelector('.ed').onclick = function () { d.remove(); form.hidden = false; };
      if (showList) d.querySelector('.see').onclick = function () { d.remove(); form.hidden = false; tab('l'); };
      loadList(true);
    }

    function dateStr(s) { try { return new Date(s).toLocaleDateString(lang === 'pt-BR' ? 'pt-BR' : lang); } catch (e) { return ''; } }
    function loadList(reset) {
      if (reset) offset = 0;
      return post({ action: 'list', offset: offset }).then(function (o) {
        if (!o.ok) throw 0;
        var j = o.j, total = j.count || 0;
        $('.av').textContent = total ? (j.avg || 0).toFixed(1) : '';
        if (!showList) return;
        if (reset) {
          vl.textContent = '';
          if (!total) { vl.innerHTML = '<p class="mu">' + T.none + '</p>'; return; }
          var sm = document.createElement('div'); sm.className = 'sm';
          var dist = ''; for (var k = 5; k >= 1; k--) dist += '<div><span>' + k + '</span><i><b style="width:' + Math.round((j.dist[k - 1] || 0) / total * 100) + '%"></b></i></div>';
          sm.innerHTML = '<div><div class="big">' + (j.avg || 0).toFixed(1) + '</div><div class="s">' + stars(j.avg || 0) + '</div><small>' + total + ' ' + T.reviews + '</small></div><div class="ds">' + dist + '</div>';
          vl.appendChild(sm);
          var ul = document.createElement('ul'); ul.className = 'rl'; vl.appendChild(ul);
          var mb = document.createElement('button'); mb.type = 'button'; mb.className = 'at'; mb.textContent = T.more; mb.hidden = true; vl.appendChild(mb);
          mb.onclick = function () { mb.disabled = true; loadList(false); };
        }
        var ul2 = vl.querySelector('.rl'), more = vl.querySelector('.at'); if (!ul2) return;
        (j.items || []).forEach(function (it) {
          var li = document.createElement('li'), t = document.createElement('div'), p;
          t.className = 't';
          var a = document.createElement('span'); a.innerHTML = '<span class="s">' + stars(it.rating) + '</span> ';
          var nb = document.createElement('b'); nb.textContent = it.name || T.anon; a.appendChild(nb);
          var dd = document.createElement('span'); dd.className = 'd'; dd.textContent = dateStr(it.created_at);
          t.appendChild(a); t.appendChild(dd); li.appendChild(t);
          if (it.comment) { p = document.createElement('p'); p.textContent = it.comment; li.appendChild(p); }
          ul2.appendChild(li);
        });
        offset += (j.items || []).length;
        more.hidden = !j.more; more.disabled = false;
      }).catch(function () { if (showList && reset) vl.innerHTML = '<p class="mu">' + T.eNet + '</p>'; });
    }

    function tab(k) {
      if (!showList) return;
      $('.tr').setAttribute('aria-selected', k === 'r'); $('.tl').setAttribute('aria-selected', k === 'l');
      vr.hidden = k !== 'r'; vl.hidden = k !== 'l';
    }
    if (showList) { $('.tr').onclick = function () { tab('r'); }; $('.tl').onclick = function () { tab('l'); }; vl.innerHTML = '<p class="mu">' + T.load + '</p>'; }

    function toggle(v) { panel.hidden = !v; if (v) loadList(true); }
    $('.lb').onclick = function () { toggle(panel.hidden); };
    $('.x').onclick = function () { toggle(false); };
    loadList(true);   /* Durchschnitt am Knopf anzeigen */
    if (open) toggle(true);
  }

  function mount(o) {
    var run = function () {
      if (o.cfg) return build(o.id, o.cfg, o.open, o.lang);
      fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'config', id: o.id }) })
        .then(function (r) { return r.json(); }).then(function (j) { if (j && j.pub) build(o.id, j.pub, o.open, o.lang); }).catch(function () { });
    };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  }

  window.KKFeedback = { mount: mount, destroy: destroy };
  if (script && script.dataset && script.dataset.form) mount({ id: script.dataset.form, open: script.dataset.open === 'true', lang: script.dataset.lang });
})();

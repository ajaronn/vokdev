/* Karteikasten Developer · Umfrage-Widget (Auswahl-Optionen + "Andere", Knopf oder Popup)
   Einbau: <script src="https://ajaronn.github.io/vokdev/poll-widget.js" data-form="UMFRAGE-ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR" */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/poll';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var script = document.currentScript, host = null, timer = null;

  var UI = {
    de: { open: 'Umfrage öffnen', close: 'Schließen', title: 'Umfrage', other: 'Andere', otherPh: 'Deine Antwort …', send: 'Abstimmen', sending: 'Wird gesendet …', ok: 'Danke für deine Stimme!', change: 'Antwort ändern', votes: 'Stimmen',
      eChoose: 'Bitte wähle eine Option.', eOther: 'Bitte schreib deine Antwort.', eSlow: 'Zu viele Anfragen. Bitte warte einen Moment.', eDom: 'Diese Funktion darf auf dieser Webseite nicht genutzt werden.', eFail: 'Senden fehlgeschlagen. Bitte versuche es später noch einmal.', eNet: 'Keine Verbindung. Prüfe dein Internet.', otherN: 'Andere Antworten' },
    en: { open: 'Open poll', close: 'Close', title: 'Poll', other: 'Other', otherPh: 'Your answer …', send: 'Vote', sending: 'Sending …', ok: 'Thanks for your vote!', change: 'Change answer', votes: 'votes',
      eChoose: 'Please choose an option.', eOther: 'Please write your answer.', eSlow: 'Too many requests. Please wait a moment.', eDom: 'This feature may not be used on this website.', eFail: 'Sending failed. Please try again later.', eNet: 'No connection. Check your internet.', otherN: 'Other answers' },
    'pt-BR': { open: 'Abrir enquete', close: 'Fechar', title: 'Enquete', other: 'Outra', otherPh: 'Sua resposta …', send: 'Votar', sending: 'Enviando …', ok: 'Obrigado pelo seu voto!', change: 'Alterar resposta', votes: 'votos',
      eChoose: 'Escolha uma opção.', eOther: 'Escreva sua resposta.', eSlow: 'Solicitações demais. Aguarde um momento.', eDom: 'Este recurso não pode ser usado neste site.', eFail: 'Falha ao enviar. Tente novamente mais tarde.', eNet: 'Sem conexão. Verifique sua internet.', otherN: 'Outras respostas' }
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
    var v = store('kk_fb_vid'); // gleiche Geräte-ID wie beim Feedback-Widget
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
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 16px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}.lb[hidden]{display:none}.lb .e{font-size:24px;line-height:1}' +
    'button:focus-visible,input:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{width:min(380px,calc(100vw - 24px));max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}.p[hidden]{display:none}' +
    '.fab .p{position:absolute;bottom:68px;max-height:calc(100dvh - 110px)}.fab.r .p{right:0}.fab.l .p{left:0}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '.bd{overflow-y:auto;padding:14px}.q{margin:0 0 10px;font-weight:600;font-size:16px}' +
    '.o{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:0 0 8px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);cursor:pointer;font-weight:400;font-size:15px}.o:hover{border-color:var(--c)}.o input{accent-color:var(--c);width:18px;height:18px;margin:0;flex:none}.o span{overflow-wrap:anywhere}.o.sel{border-color:var(--c);box-shadow:0 0 0 1px var(--c)}' +
    '.ot{width:100%;margin:0 0 8px;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:16px var(--f)}.ot[hidden]{display:none}.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.er{margin:6px 0 0;padding:8px 10px;border-radius:calc(var(--r) * .6);background:var(--errbg);color:var(--err);font-size:13px}.er[hidden]{display:none}' +
    '.sb,.at{width:100%;margin-top:10px;border:0;border-radius:calc(var(--r) * .6);padding:11px;background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer}.sb:disabled{opacity:.55;cursor:default}.at{background:transparent;color:var(--fg);border:1px solid var(--bd);padding:8px;font-weight:400;font-size:14px}' +
    '.done[hidden],form[hidden]{display:none}.ok{text-align:center;padding:4px 0 2px}.ok .e{font-size:36px}.ok p{margin:8px 0}' +
    '.rs{margin:12px 0 0;text-align:left}.rs .r{margin:0 0 8px;font-size:14px}.rs .t{display:flex;justify-content:space-between;gap:8px}.rs .t span{overflow-wrap:anywhere}.rs i{display:block;height:8px;margin-top:3px;border-radius:4px;background:var(--bd);overflow:hidden}.rs i b{display:block;height:100%;background:var(--c)}.rs .m{color:var(--mut);font-size:12px}.rs .my{font-weight:700}' +
    '.ft{padding:6px 14px 10px;font-size:11px;color:var(--mut);text-align:right}.ft a{color:var(--mut)}';

  function destroy() { if (timer) { clearTimeout(timer); timer = null; } if (host) { host.remove(); host = null; } }

  function post(id, body) {
    body.id = id; body.page = (location.origin + location.pathname).slice(0, 300); body.vid = vid();
    return fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); });
  }

  /* o: {id, cfg, voted, preview} */
  function build(o, forceLang) {
    destroy();
    var id = o.id, c = o.cfg, lang = pickLang(c, forceLang), T = UI[lang];
    var color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#A8442E';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : Math.max(0, Math.min(28, +c.radius || 0));
    var popup = c.mode === 'popup' && !o.preview;
    var otherLabel = c.other_label || T.other;
    var title = c.title || T.title, emoji = c.emoji || '📊';
    var voted = o.voted || null, busy = false;
    var pos = c.position === 'left' ? 'l' : 'r', mk = dark ? ' dark' : '';

    host = document.createElement('div'); host.id = 'kk-poll-host';
    var sh = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var w = document.createElement('div');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system);

    var radios = c.options.map(function (t, i) { return '<label class="o"><input type="radio" name="o" value="' + i + '"><span>' + esc(t) + '</span></label>'; }).join('') +
      (c.other_on ? '<label class="o"><input type="radio" name="o" value="other"><span>' + esc(otherLabel) + '</span></label><input class="ot" type="text" maxlength="' + (c.other_max || 200) + '" placeholder="' + esc(T.otherPh) + '" hidden>' : '');
    w.innerHTML = '<div class="p" role="dialog" aria-label="' + esc(title) + '" hidden><div class="h"><span style="font-size:24px">' + esc(emoji) + '</span><div><b>' + esc(title) + '</b></div><button type="button" class="x" aria-label="' + T.close + '">×</button></div>' +
      '<div class="bd"><form novalidate><p class="q">' + esc(c.question) + '</p>' + radios +
      '<div class="hp" aria-hidden="true"><label>Website<input type="text" class="hpf" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="er" role="alert" hidden></div><button type="submit" class="sb">' + T.send + '</button></form><div class="done" hidden></div></div>' +
      '<div class="ft">powered by <a href="' + HOME + '" target="_blank" rel="noopener">Karteikasten Developer</a></div></div>' +
      '<button type="button" class="lb" aria-label="' + T.open + '"><span class="e">' + esc(emoji) + '</span>' + (c.launcher ? '<span>' + esc(c.launcher) + '</span>' : '') + '</button>';
    sh.appendChild(w); document.body.appendChild(host);

    var $ = function (s) { return w.querySelector(s); }, panel = $('.p'), lb = $('.lb'), form = $('form'), er = $('.er'), sb = $('.sb'), done = $('.done'), ot = $('.ot');
    function err(t) { er.textContent = t; er.hidden = !t; }

    /* Zustände: Knopf-Modus = Knopf + Fenster; Popup-Modus = Mitte-Fenster, danach optional kleiner Knopf */
    var isOpen = false;
    function setOpen(v) {
      isOpen = v; panel.hidden = !v;
      if (popup && v) { w.className = 'w mod' + mk; w.hidden = false; lb.hidden = true; }
      else if (popup) { w.className = 'w fab ' + pos + mk; lb.hidden = !c.popup_button; w.hidden = !c.popup_button; }
      else { w.className = 'w fab ' + pos + mk; lb.hidden = false; w.hidden = false; }
    }
    setOpen(false); if (popup) w.hidden = true;

    function sel() { var x = w.querySelector('input[name=o]:checked'); return x ? x.value : null; }
    Array.prototype.forEach.call(w.querySelectorAll('input[name=o]'), function (inp) {
      inp.onchange = function () {
        Array.prototype.forEach.call(w.querySelectorAll('.o'), function (l) { l.classList.toggle('sel', l.firstChild.checked); });
        if (ot) { ot.hidden = sel() !== 'other'; if (!ot.hidden) ot.focus(); }
        err('');
      };
    });
    $('.x').onclick = function () { setOpen(false); };
    lb.onclick = function () { setOpen(true); };
    if (popup) w.addEventListener('mousedown', function (e) { if (e.target === w) setOpen(false); });
    sh.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) setOpen(false); });

    function showResults(res, mine) {
      done.hidden = false; form.hidden = true; done.textContent = '';
      var d = document.createElement('div'); d.className = 'ok';
      var h = '<div class="e">✅</div><p>' + esc(c.success || T.ok) + '</p>';
      if (res && res.total) {
        h += '<div class="rs">';
        var rows = res.items.slice(); if (res.other) rows.push({ text: T.otherN, n: res.other, o: 1 });
        rows.forEach(function (it) {
          var p = Math.round(it.n / res.total * 100), my = mine && !it.o && it.text === mine;
          h += '<div class="r' + (my ? ' my' : '') + '"><div class="t"><span>' + esc(it.text) + (my ? ' ✓' : '') + '</span><span>' + p + '% · ' + it.n + '</span></div><i><b style="width:' + p + '%"></b></i></div>';
        });
        h += '<div class="m">' + res.total + ' ' + T.votes + '</div></div>';
      }
      d.innerHTML = h + '<button type="button" class="at ed">' + T.change + '</button>' + (popup ? '<button type="button" class="at cl">' + T.close + '</button>' : '');
      done.appendChild(d);
      d.querySelector('.ed').onclick = function () { done.hidden = true; form.hidden = false; };
      var cl = d.querySelector('.cl'); if (cl) cl.onclick = function () { setOpen(false); };
    }
    function loadResults(mine) {
      if (!c.show_results) return showResults(null, mine);
      post(id, { action: 'results' }).then(function (x) { showResults(x.ok ? x.j : null, mine); }).catch(function () { showResults(null, mine); });
    }

    form.onsubmit = function (e) {
      e.preventDefault(); if (busy) return; err('');
      var s = sel(); if (s === null) return err(T.eChoose);
      var body = { action: 'vote', lang: lang, hp: $('.hpf').value };
      if (s === 'other') { var tx = ot.value.trim(); if (!tx) return err(T.eOther); body.other = tx; } else body.option = c.options[+s];
      busy = true; sb.disabled = true; sb.textContent = T.sending;
      post(id, body).then(function (x) {
        if (x.ok && x.j.ok) { showResults(x.j.results, body.other ? null : body.option); return; }
        var k = x.j && x.j.error;
        err(k === 'slow' ? T.eSlow : k === 'domain' ? T.eDom : (k === 'option' || k === 'other_off') ? T.eChoose : T.eFail);
      }).catch(function () { err(T.eNet); }).then(function () { busy = false; sb.disabled = false; sb.textContent = T.send; });
    };

    if (voted) loadResults(voted.other ? null : voted.text);
    return { open: function () { setOpen(true); }, idle: function () { setOpen(false); } };
  }

  function ctxInfo(seconds) {
    var v = (+store('kk_poll_visits') || 0) + 1, ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { }
    return { path: location.pathname, title: document.title, lang: document.documentElement.lang || navigator.language || '', device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobil' : 'desktop', hour: String(new Date().getHours()), visits: v, seconds: seconds, referrer: ref };
  }

  function start(id, forceOpen, forceLang) {
    post(id, { action: 'config' }).then(function (x) {
      if (!x.ok || !x.j.pub) return;
      var c = x.j.pub, rev = x.j.rev, voted = x.j.voted;
      var ui = build({ id: id, cfg: c, voted: voted }, forceLang);
      if (forceOpen) { ui.open(); return; }
      if (c.mode !== 'popup') return;
      var seenKey = 'kk_poll_seen_' + id;
      if (voted || (+store(seenKey) || 0) >= rev) { ui.idle(); return; } // schon gesehen oder abgestimmt
      function reveal() { ui.open(); store(seenKey, String(rev)); }
      var delay = (c.popup_delay || 0) * 1000;
      if (c.trigger === 'next_visit') { timer = setTimeout(reveal, delay); }
      else if (c.trigger === 'date') {
        var d = new Date(), today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        if (today >= c.popup_date) timer = setTimeout(reveal, delay);
      } else if (c.trigger === 'ai') {
        timer = setTimeout(function () {
          var ctx = ctxInfo(Math.round(delay / 1000)); store('kk_poll_visits', String(ctx.visits));
          post(id, { action: 'check', ctx: ctx }).then(function (y) { if (y.ok && y.j.show) reveal(); }).catch(function () { });
        }, Math.max(delay, 3000));
      }
    }).catch(function () { });
  }

  window.KKPoll = {
    destroy: destroy,
    mount: function (o) { build({ id: o.id, cfg: o.cfg, preview: true }, o.lang).open(); },
    start: start
  };
  if (script && script.getAttribute('data-form')) {
    var go = function () { start(script.getAttribute('data-form'), script.getAttribute('data-open') === 'true', script.getAttribute('data-lang') || undefined); };
    if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
  }
})();

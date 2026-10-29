/* Karteikasten Developer · KI-Agent Widget
   Einbau: <script src="https://ajaronn.github.io/vokdev/widget.js" data-agent="AGENT-ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR" */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/agent';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var UI = {
    de: { send: 'Senden', ph: 'Deine Frage …', open: 'Chat öffnen', close: 'Schließen', think: 'Schreibt …', contact: 'Kontakt', reset: 'Neuer Chat', welcome: 'Hallo! Wie kann ich helfen?',
      eLimit: 'Der Agent ist gerade ausgelastet. Bitte versuche es später noch einmal.', eKey: 'Der Agent ist nicht richtig eingerichtet.', eFail: 'Der Agent ist gerade nicht erreichbar.', eNet: 'Keine Verbindung. Prüfe dein Internet.', eSlow: 'Etwas zu schnell – bitte kurz warten.', eDom: 'Dieser Agent darf auf dieser Webseite nicht genutzt werden.' },
    en: { send: 'Send', ph: 'Your question …', open: 'Open chat', close: 'Close', think: 'Typing …', contact: 'Contact', reset: 'New chat', welcome: 'Hi! How can I help?',
      eLimit: 'The agent is busy right now. Please try again later.', eKey: 'The agent is not set up correctly.', eFail: 'The agent is not available right now.', eNet: 'No connection. Check your internet.', eSlow: 'A bit fast – please wait a moment.', eDom: 'This agent may not be used on this website.' },
    'pt-BR': { send: 'Enviar', ph: 'Sua pergunta …', open: 'Abrir chat', close: 'Fechar', think: 'Digitando …', contact: 'Contato', reset: 'Novo chat', welcome: 'Olá! Como posso ajudar?',
      eLimit: 'O agente está ocupado agora. Tente novamente mais tarde.', eKey: 'O agente não está configurado corretamente.', eFail: 'O agente não está disponível agora.', eNet: 'Sem conexão. Verifique sua internet.', eSlow: 'Um pouco rápido – aguarde um momento.', eDom: 'Este agente não pode ser usado neste site.' }
  };
  var FONTS = { system: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', serif: 'Georgia,"Times New Roman",serif', mono: 'ui-monospace,Menlo,Consolas,monospace' };
  var host = null, script = document.currentScript;

  function pickLang(c, force) {
    var l = force || (c.lang && c.lang !== 'auto' ? c.lang : (document.documentElement.lang || navigator.language || 'en'));
    l = String(l).toLowerCase();
    return l.indexOf('pt') === 0 ? 'pt-BR' : l.indexOf('de') === 0 ? 'de' : 'en';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g, '<br>');
  }
  function onColor(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#111' : '#fff';
  }

  var CSS = ':host{all:initial}*{box-sizing:border-box}.w{--bg:#fff;--fg:#1d1d1f;--mut:#6b6b70;--bd:#e3e3e6;--bub:#f1f1f3;position:fixed;bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147483000;font:15px/1.45 var(--f);color:var(--fg)}' +
    '.w.dark{--bg:#1e1e21;--fg:#f2f2f4;--mut:#9a9aa1;--bd:#38383d;--bub:#2b2b30}.w.r{right:16px}.w.l{left:16px}' +
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 14px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}' +
    '.lb img{width:34px;height:34px;border-radius:50%;object-fit:cover}.lb .e{font-size:26px;line-height:1}.lb:focus-visible,button:focus-visible,textarea:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{position:absolute;bottom:68px;width:min(var(--pw),calc(100vw - 24px));height:min(var(--ph),calc(100dvh - 110px));display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}' +
    '.r .p{right:0}.l .p{left:0}.p[hidden]{display:none}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h img{width:36px;height:36px;border-radius:50%;object-fit:cover;background:#fff3}.h .e{font-size:26px}' +
    '.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h small{display:block;opacity:.85;font-size:12px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '.m{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}.b{max-width:85%;padding:8px 12px;border-radius:var(--r);word-wrap:break-word;overflow-wrap:anywhere}' +
    '.b.a{align-self:flex-start;background:var(--bub)}.b.u{align-self:flex-end;background:var(--c);color:var(--on)}.b.e2{align-self:flex-start;background:#fde8e8;color:#8a1c1c}.b a{color:inherit;text-decoration:underline}.b code{background:rgba(127,127,127,.25);padding:0 4px;border-radius:4px}' +
    '.s{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}.s button{border:1px solid var(--bd);background:var(--bg);color:var(--fg);padding:6px 10px;border-radius:999px;font:13px var(--f);cursor:pointer}' +
    'form{display:flex;gap:8px;padding:10px;border-top:1px solid var(--bd)}textarea{flex:1;resize:none;height:42px;max-height:100px;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .7);background:var(--bg);color:var(--fg);font:16px var(--f)}' +
    'form button{border:0;border-radius:calc(var(--r) * .7);padding:0 14px;background:var(--c);color:var(--on);font:600 14px var(--f);cursor:pointer}form button:disabled{opacity:.5}' +
    '.f{display:flex;justify-content:space-between;gap:8px;padding:6px 12px 8px;font-size:11px;color:var(--mut)}.f a,.f button{color:var(--mut);background:none;border:0;padding:0;font:11px var(--f);cursor:pointer;text-decoration:underline}' +
    '@media(max-width:480px){.p{position:fixed;inset:0;width:100vw;height:100dvh;border-radius:0;border:0}}';

  function destroy() { if (host) { host.remove(); host = null; } }

  function build(id, c, open, forceLang) {
    destroy();
    var lang = pickLang(c, forceLang), T = UI[lang], color = c.color || '#A8442E', big = c.size === 'large';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : c.radius;
    var key = 'kkag_' + id, hist = [];
    try { hist = JSON.parse(sessionStorage.getItem(key) || '[]'); } catch (e) { }
    var welcome = (lang === 'de' ? c.welcome_de : lang === 'en' ? c.welcome_en : c.welcome_pt) || c.welcome_de || c.welcome_en || c.welcome_pt || T.welcome;

    host = document.createElement('div'); host.id = 'kk-agent-host';
    var sh = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var w = document.createElement('div');
    w.className = 'w ' + (c.position === 'left' ? 'l' : 'r') + (dark ? ' dark' : '');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system) + ';--pw:' + (big ? 440 : 380) + 'px;--ph:' + (big ? 680 : 580) + 'px';
    var icon = c.logo ? '<img src="' + esc(c.logo) + '" alt="">' : '<span class="e">' + esc(c.emoji || '💬') + '</span>';
    w.innerHTML = '<div class="p" role="dialog" aria-label="' + esc(c.name) + '" hidden><div class="h">' + icon + '<div><b>' + esc(c.name) + '</b>' + (c.subtitle ? '<small>' + esc(c.subtitle) + '</small>' : '') + '</div><button type="button" class="x" aria-label="' + T.close + '">×</button></div>' +
      '<div class="m" aria-live="polite"></div><div class="s"></div><form><textarea rows="1" maxlength="1000" placeholder="' + T.ph + '" aria-label="' + T.ph + '"></textarea><button type="submit">' + T.send + '</button></form>' +
      '<div class="f"><span>' + (c.contact ? '<a href="mailto:' + esc(c.contact) + '">' + T.contact + '</a> · ' : '') + '<button type="button" class="rs">' + T.reset + '</button></span><span>powered by <a href="' + HOME + '" target="_blank" rel="noopener">Karteikasten Developer</a></span></div></div>' +
      '<button type="button" class="lb" aria-label="' + T.open + '">' + icon + (c.launcher ? '<span>' + esc(c.launcher) + '</span>' : '') + '</button>';
    sh.appendChild(w);
    document.body.appendChild(host);

    var $ = function (s) { return w.querySelector(s); };
    var panel = $('.p'), msgs = $('.m'), sug = $('.s'), ta = $('textarea'), btn = $('form button'), busy = false;

    function add(cls, text) {
      var d = document.createElement('div'); d.className = 'b ' + cls;
      if (cls === 'a') d.innerHTML = fmt(text); else d.textContent = text;
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
    }
    function save() { try { sessionStorage.setItem(key, JSON.stringify(hist.slice(-20))); } catch (e) { } }
    function paint() {
      msgs.textContent = ''; add('a', welcome);
      hist.forEach(function (m) { add(m.role === 'user' ? 'u' : 'a', m.content); });
      sug.textContent = '';
      if (!hist.length) (c.suggestions || []).forEach(function (s) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = s; b.onclick = function () { send(s); }; sug.appendChild(b);
      });
    }
    function send(text) {
      text = (text || '').trim(); if (!text || busy) return;
      busy = true; btn.disabled = true; sug.textContent = ''; ta.value = '';
      hist.push({ role: 'user', content: text }); add('u', text);
      var th = add('a', T.think);
      fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'chat', id: id, lang: lang, messages: hist.slice(-10) }) })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (o) {
          if (o.ok && o.j.reply) { th.innerHTML = fmt(o.j.reply); hist.push({ role: 'assistant', content: o.j.reply }); save(); }
          else { var e = o.j && o.j.error; th.className = 'b e2'; th.textContent = e === 'limit' ? T.eLimit : e === 'key' ? T.eKey : e === 'slow' ? T.eSlow : e === 'domain' ? T.eDom : T.eFail; hist.pop(); }
        })
        .catch(function () { th.className = 'b e2'; th.textContent = T.eNet; hist.pop(); })
        .then(function () { busy = false; btn.disabled = false; msgs.scrollTop = msgs.scrollHeight; });
    }
    function toggle(v) { panel.hidden = !v; if (v) { msgs.scrollTop = msgs.scrollHeight; } }
    $('.lb').onclick = function () { toggle(panel.hidden); };
    $('.x').onclick = function () { toggle(false); };
    $('.rs').onclick = function () { hist = []; save(); paint(); };
    $('form').onsubmit = function (e) { e.preventDefault(); send(ta.value); };
    ta.onkeydown = function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ta.value); } };
    paint(); toggle(!!open);
  }

  function mount(o) {
    var run = function () {
      if (o.cfg) return build(o.id, o.cfg, o.open, o.lang);
      fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'config', id: o.id }) })
        .then(function (r) { return r.json(); }).then(function (j) { if (j && j.pub) build(o.id, j.pub, o.open, o.lang); }).catch(function () { });
    };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  }

  window.KKAgent = { mount: mount, destroy: destroy };
  if (script && script.dataset && script.dataset.agent) mount({ id: script.dataset.agent, open: script.dataset.open === 'true', lang: script.dataset.lang });
})();

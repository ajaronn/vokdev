/* Karteikasten Developer · Kontakt-Widget
   Einbau: <script src="https://ajaronn.github.io/vokdev/contact-widget.js" data-form="FORM-ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR" */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/contact';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var script = document.currentScript, host = null;

  var UI = {
    de: { open: 'Kontakt öffnen', close: 'Schließen', title: 'Kontakt', intro: 'Schreib uns eine Nachricht – wir melden uns per E-Mail.', name: 'Name', email: 'Deine E-Mail', subject: 'Betreff', msg: 'Deine Nachricht', opt: ' (optional)', send: 'Senden', sending: 'Wird gesendet …', attach: 'Anhang hinzufügen', remove: 'Entfernen',
      ok: 'Danke! Deine Nachricht wurde gesendet.', again: 'Weitere Nachricht',
      eEmail: 'Bitte gib eine gültige E-Mail-Adresse an.', eMsg: 'Bitte schreib eine Nachricht.', eName: 'Bitte gib deinen Namen an.', eMax: 'Maximal {n} Dateien erlaubt.', eSize: 'Die Datei „{f}“ ist zu groß (max. {n} MB).', eType: 'Dateityp von „{f}“ ist nicht erlaubt.',
      eSlow: 'Zu viele Nachrichten. Bitte warte einen Moment.', eDom: 'Dieses Formular darf auf dieser Webseite nicht genutzt werden.', eFail: 'Senden fehlgeschlagen. Bitte versuche es später noch einmal.', eNet: 'Keine Verbindung. Prüfe dein Internet.', chars: 'Zeichen' },
    en: { open: 'Open contact form', close: 'Close', title: 'Contact', intro: 'Send us a message – we will reply by email.', name: 'Name', email: 'Your email', subject: 'Subject', msg: 'Your message', opt: ' (optional)', send: 'Send', sending: 'Sending …', attach: 'Add attachment', remove: 'Remove',
      ok: 'Thanks! Your message has been sent.', again: 'Send another message',
      eEmail: 'Please enter a valid email address.', eMsg: 'Please write a message.', eName: 'Please enter your name.', eMax: 'At most {n} files allowed.', eSize: 'The file “{f}” is too large (max. {n} MB).', eType: 'The file type of “{f}” is not allowed.',
      eSlow: 'Too many messages. Please wait a moment.', eDom: 'This form may not be used on this website.', eFail: 'Sending failed. Please try again later.', eNet: 'No connection. Check your internet.', chars: 'characters' },
    'pt-BR': { open: 'Abrir contato', close: 'Fechar', title: 'Contato', intro: 'Envie uma mensagem – responderemos por e-mail.', name: 'Nome', email: 'Seu e-mail', subject: 'Assunto', msg: 'Sua mensagem', opt: ' (opcional)', send: 'Enviar', sending: 'Enviando …', attach: 'Adicionar anexo', remove: 'Remover',
      ok: 'Obrigado! Sua mensagem foi enviada.', again: 'Enviar outra mensagem',
      eEmail: 'Informe um e-mail válido.', eMsg: 'Escreva uma mensagem.', eName: 'Informe seu nome.', eMax: 'No máximo {n} arquivos.', eSize: 'O arquivo “{f}” é grande demais (máx. {n} MB).', eType: 'O tipo do arquivo “{f}” não é permitido.',
      eSlow: 'Mensagens demais. Aguarde um momento.', eDom: 'Este formulário não pode ser usado neste site.', eFail: 'Falha ao enviar. Tente novamente mais tarde.', eNet: 'Sem conexão. Verifique sua internet.', chars: 'caracteres' }
  };
  var FONTS = { system: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', serif: 'Georgia,"Times New Roman",serif', mono: 'ui-monospace,Menlo,Consolas,monospace' };
  /* Muss zur Backend-Funktion passen */
  var TYPES = { images: ['jpg', 'jpeg', 'png', 'gif', 'webp'], docs: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods'] };
  var BLOCKED = ['exe', 'bat', 'cmd', 'com', 'scr', 'msi', 'js', 'jse', 'vbs', 'vbe', 'jar', 'sh', 'ps1', 'dll', 'apk', 'app', 'lnk', 'reg', 'hta', 'svg', 'html', 'htm'];

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
  function ext(n) { var m = /\.([a-z0-9]+)$/i.exec(n); return m ? m[1].toLowerCase() : ''; }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  var CSS = ':host{all:initial}*{box-sizing:border-box}.w{--bg:#fff;--fg:#1d1d1f;--mut:#6b6b70;--bd:#d9d9de;--err:#8a1c1c;--errbg:#fde8e8;position:fixed;bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147482990;font:15px/1.45 var(--f);color:var(--fg)}' +
    '.w.dark{--bg:#1e1e21;--fg:#f2f2f4;--mut:#9a9aa1;--bd:#3d3d43;--err:#f3b4b4;--errbg:#472222}.w.r{right:16px}.w.l{left:16px}' +
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 16px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}.lb .e{font-size:24px;line-height:1}' +
    '.lb:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{position:absolute;bottom:68px;width:min(var(--pw),calc(100vw - 24px));max-height:calc(100dvh - 110px);display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}.r .p{right:0}.l .p{left:0}.p[hidden]{display:none}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h small{display:block;opacity:.85;font-size:12px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '.bd{overflow-y:auto;padding:12px 14px 14px}.in{margin:0 0 10px;color:var(--mut);font-size:14px}' +
    'label{display:block;font-weight:600;font-size:13px;margin:10px 0 4px}label small{font-weight:400;color:var(--mut)}' +
    'input[type=text],input[type=email],textarea{width:100%;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:16px var(--f)}textarea{resize:vertical;min-height:110px}' +
    '.cnt{text-align:right;font-size:11px;color:var(--mut)}.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.fl{list-style:none;margin:6px 0 0;padding:0}.fl li{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:5px 8px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);margin-top:4px;font-size:13px}.fl span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fl button{border:0;background:none;color:var(--mut);text-decoration:underline;cursor:pointer;font:12px var(--f)}' +
    '.at{margin-top:8px;border:1px dashed var(--bd);background:transparent;color:var(--fg);padding:7px 12px;border-radius:calc(var(--r) * .6);font:13px var(--f);cursor:pointer}' +
    '.er{margin:10px 0 0;padding:8px 10px;border-radius:calc(var(--r) * .6);background:var(--errbg);color:var(--err);font-size:13px}.er[hidden]{display:none}' +
    '.sb{width:100%;margin-top:12px;border:0;border-radius:calc(var(--r) * .6);padding:11px;background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer}.sb:disabled{opacity:.55;cursor:default}' +
    '.ok{text-align:center;padding:24px 8px}.ok .e{font-size:40px}.ok p{margin:10px 0 16px}' +
    '.ft{padding:6px 14px 10px;font-size:11px;color:var(--mut);text-align:right}.ft a{color:var(--mut)}' +
    '@media(max-width:480px){.p{position:fixed;inset:0;width:100vw;max-height:none;height:100dvh;border-radius:0;border:0}}';

  function destroy() { if (host) { host.remove(); host = null; } }

  function build(id, c, open, forceLang) {
    destroy();
    var lang = pickLang(c, forceLang), T = UI[lang], color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#A8442E';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : Math.max(0, Math.min(28, +c.radius || 0));
    var maxChars = Math.max(100, Math.min(5000, +c.max_chars || 1500));
    var att = !!c.attachments, maxFiles = Math.max(1, Math.min(5, +c.max_files || 3)), maxMb = Math.max(1, Math.min(5, +c.max_mb || 5));
    var allowed = c.file_types === 'images' ? TYPES.images : c.file_types === 'docs' ? TYPES.docs : null;
    var nameMode = c.ask_name === 'required' ? 2 : c.ask_name === 'optional' ? 1 : 0;
    var files = [], busy = false;

    host = document.createElement('div'); host.id = 'kk-contact-host';
    var sh = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var w = document.createElement('div');
    w.className = 'w ' + (c.position === 'left' ? 'l' : 'r') + (dark ? ' dark' : '');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system) + ';--pw:400px';

    var title = c.title || T.title, intro = c.intro || T.intro;
    w.innerHTML = '<div class="p" role="dialog" aria-label="' + esc(title) + '" hidden><div class="h"><span style="font-size:24px">' + esc(c.emoji || '✉️') + '</span><div><b>' + esc(title) + '</b></div><button type="button" class="x" aria-label="' + T.close + '">×</button></div>' +
      '<div class="bd"><form novalidate><p class="in">' + esc(intro) + '</p>' +
      (nameMode ? '<label for="n">' + T.name + (nameMode === 1 ? '<small>' + T.opt + '</small>' : '') + '</label><input id="n" type="text" maxlength="80" autocomplete="name">' : '') +
      '<label for="e">' + T.email + '</label><input id="e" type="email" maxlength="200" autocomplete="email" inputmode="email">' +
      (c.ask_subject ? '<label for="s">' + T.subject + '<small>' + T.opt + '</small></label><input id="s" type="text" maxlength="120">' : '') +
      '<label for="m">' + T.msg + '</label><textarea id="m" maxlength="' + maxChars + '"></textarea><div class="cnt"><span class="cn">0</span> / ' + maxChars + '</div>' +
      (att ? '<input type="file" class="fi" multiple hidden' + (allowed ? ' accept="' + allowed.map(function (x) { return '.' + x; }).join(',') + '"' : '') + '><button type="button" class="at">📎 ' + T.attach + '</button><ul class="fl"></ul>' : '') +
      '<div class="hp" aria-hidden="true"><label>Website<input type="text" class="hpf" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="er" role="alert" hidden></div><button type="submit" class="sb">' + T.send + '</button></form></div>' +
      '<div class="ft">powered by <a href="' + HOME + '" target="_blank" rel="noopener">Karteikasten Developer</a></div></div>' +
      '<button type="button" class="lb" aria-label="' + T.open + '"><span class="e">' + esc(c.emoji || '✉️') + '</span>' + (c.launcher ? '<span>' + esc(c.launcher) + '</span>' : '') + '</button>';
    sh.appendChild(w); document.body.appendChild(host);

    var $ = function (s) { return w.querySelector(s); };
    var panel = $('.p'), form = $('form'), er = $('.er'), sb = $('.sb'), ta = $('#m'), list = $('.fl'), fi = $('.fi');

    function err(t) { er.textContent = t; er.hidden = !t; }
    function drawFiles() {
      if (!list) return; list.textContent = '';
      files.forEach(function (f, i) {
        var li = document.createElement('li'), s = document.createElement('span'), b = document.createElement('button');
        s.textContent = f.name + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)';
        b.type = 'button'; b.textContent = T.remove; b.onclick = function () { files.splice(i, 1); drawFiles(); };
        li.appendChild(s); li.appendChild(b); list.appendChild(li);
      });
    }
    function checkFile(f) {
      var e = ext(f.name);
      if (!e || BLOCKED.indexOf(e) >= 0 || (allowed && allowed.indexOf(e) < 0)) return fill(T.eType, { f: f.name });
      if (f.size > maxMb * 1024 * 1024) return fill(T.eSize, { f: f.name, n: maxMb });
      return '';
    }
    if (att) {
      $('.at').onclick = function () { fi.click(); };
      fi.onchange = function () {
        err('');
        Array.prototype.forEach.call(fi.files, function (f) {
          if (files.length >= maxFiles) return err(fill(T.eMax, { n: maxFiles }));
          var m = checkFile(f); if (m) return err(m);
          files.push(f);
        });
        fi.value = ''; drawFiles();
      };
    }
    ta.oninput = function () { $('.cn').textContent = ta.value.length; };

    function readB64(f) {
      return new Promise(function (res, rej) {
        var rd = new FileReader();
        rd.onload = function () { res({ name: f.name, type: f.type || '', data: String(rd.result).split(',')[1] || '' }); };
        rd.onerror = rej; rd.readAsDataURL(f);
      });
    }
    form.onsubmit = function (e) {
      e.preventDefault(); if (busy) return; err('');
      var email = $('#e').value.trim(), msg = ta.value.trim(), nm = $('#n') ? $('#n').value.trim() : '';
      if (nameMode === 2 && !nm) return err(T.eName);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(T.eEmail);
      if (!msg) return err(T.eMsg);
      busy = true; sb.disabled = true; sb.textContent = T.sending;
      Promise.all(files.map(readB64)).then(function (fs) {
        return fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
          action: 'send', id: id, lang: lang, name: nm, email: email, subject: $('#s') ? $('#s').value.trim() : '', message: msg, files: fs, hp: $('.hpf').value, page: location.href.slice(0, 300)
        }) });
      }).then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (o) {
          if (o.ok && o.j.ok) return done();
          var k = o.j && o.j.error;
          err(k === 'slow' ? T.eSlow : k === 'domain' ? T.eDom : k === 'email' ? T.eEmail : k === 'file_type' ? fill(T.eType, { f: o.j.file || '' }) : k === 'file_size' ? fill(T.eSize, { f: o.j.file || '', n: maxMb }) : k === 'max_files' ? fill(T.eMax, { n: maxFiles }) : T.eFail);
        })
        .catch(function () { err(T.eNet); })
        .then(function () { busy = false; sb.disabled = false; sb.textContent = T.send; });
    };
    function done() {
      var bd = $('.bd'); bd.textContent = '';
      var d = document.createElement('div'); d.className = 'ok';
      d.innerHTML = '<div class="e">✅</div><p>' + esc(c.success || T.ok) + '</p><button type="button" class="at">' + T.again + '</button>';
      d.querySelector('button').onclick = function () { build(id, c, true, forceLang); };
      bd.appendChild(d);
    }
    function toggle(v) { panel.hidden = !v; if (v) { var f = $('#e'); if (f && window.innerWidth > 480) f.focus(); } }
    $('.lb').onclick = function () { toggle(panel.hidden); };
    $('.x').onclick = function () { toggle(false); };
    toggle(!!open);
  }

  function mount(o) {
    var run = function () {
      if (o.cfg) return build(o.id, o.cfg, o.open, o.lang);
      fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'config', id: o.id }) })
        .then(function (r) { return r.json(); }).then(function (j) { if (j && j.pub) build(o.id, j.pub, o.open, o.lang); }).catch(function () { });
    };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  }

  window.KKContact = { mount: mount, destroy: destroy };
  if (script && script.dataset && script.dataset.form) mount({ id: script.dataset.form, open: script.dataset.open === 'true', lang: script.dataset.lang });
})();

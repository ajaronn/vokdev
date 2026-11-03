/* Karteikasten Developer · Formular- & Popup-Widget
   Einbau: <script src="https://ajaronn.github.io/vokdev/survey-widget.js" data-survey="ID" defer></script>
   Optional: data-open="true" (startet offen), data-lang="de|en|pt-BR"
   Eigener Knopf auf deiner Seite: <button onclick="KKSurvey.open()">…</button> */
(function () {
  'use strict';
  var BASE = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/survey';
  var HOME = 'https://ajaronn.github.io/vokdev/';
  var script = document.currentScript, host = null, timer = null, cur = null;

  var UI = {
    de: { open: 'Öffnen', close: 'Schließen', next: 'Weiter', back: 'Zurück', submit: 'Absenden', sending: 'Wird gesendet …', ok: 'Danke für deine Antwort!', again: 'Erneut ausfüllen', step: 'Frage {a} von {b}', req: 'Pflichtfrage', other: 'Andere', otherPh: 'Deine Antwort …', choose: 'Bitte wählen …', title: 'Formular',
      eReq: 'Bitte beantworte diese Frage.', eInv: 'Bitte prüfe deine Eingabe.', eSlow: 'Zu viele Anfragen. Bitte warte einen Moment.', eDom: 'Diese Funktion darf auf dieser Webseite nicht genutzt werden.', eFail: 'Senden fehlgeschlagen. Bitte versuche es später noch einmal.', eNet: 'Keine Verbindung. Prüfe dein Internet.' },
    en: { open: 'Open', close: 'Close', next: 'Next', back: 'Back', submit: 'Submit', sending: 'Sending …', ok: 'Thanks for your answers!', again: 'Fill in again', step: 'Question {a} of {b}', req: 'Required', other: 'Other', otherPh: 'Your answer …', choose: 'Please choose …', title: 'Form',
      eReq: 'Please answer this question.', eInv: 'Please check your input.', eSlow: 'Too many requests. Please wait a moment.', eDom: 'This feature may not be used on this website.', eFail: 'Sending failed. Please try again later.', eNet: 'No connection. Check your internet.' },
    'pt-BR': { open: 'Abrir', close: 'Fechar', next: 'Avançar', back: 'Voltar', submit: 'Enviar', sending: 'Enviando …', ok: 'Obrigado pelas suas respostas!', again: 'Preencher de novo', step: 'Pergunta {a} de {b}', req: 'Obrigatória', other: 'Outra', otherPh: 'Sua resposta …', choose: 'Escolha …', title: 'Formulário',
      eReq: 'Responda a esta pergunta.', eInv: 'Verifique o que você digitou.', eSlow: 'Solicitações demais. Aguarde um momento.', eDom: 'Este recurso não pode ser usado neste site.', eFail: 'Falha ao enviar. Tente novamente mais tarde.', eNet: 'Sem conexão. Verifique sua internet.' }
  };
  var FONTS = { system: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', serif: 'Georgia,"Times New Roman",serif', mono: 'ui-monospace,Menlo,Consolas,monospace' };

  function pickLang(c, force) {
    var l = force || (c.lang && c.lang !== 'auto' ? c.lang : (document.documentElement.lang || navigator.language || 'en'));
    l = String(l).toLowerCase();
    return l.indexOf('pt') === 0 ? 'pt-BR' : l.indexOf('de') === 0 ? 'de' : 'en';
  }
  function onColor(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return '#fff';
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#111' : '#fff';
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { } return null; }
  function vid() {
    var v = store('kk_fb_vid'); // gleiche Geräte-ID wie bei Feedback und Umfrage
    if (!v || !/^[a-z0-9]{16,40}$/.test(v)) {
      v = ''; var a = new Uint8Array(16);
      (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
      a.forEach(function (x) { v += (x % 36).toString(36); });
      store('kk_fb_vid', v);
    }
    return v;
  }
  function safeUrl(u, img) { u = String(u || ''); return (img ? /^https:\/\//i : /^(https?:\/\/|mailto:|tel:)/i).test(u) && !/[\s<>"']/.test(u); }
  function E(t, p, k) {
    var e = document.createElement(t);
    for (var a in p) { var v = p[a]; if (v == null || v === false) continue; if (a === 'text') e.textContent = v; else if (a === 'cls') e.className = v; else if (a.slice(0, 2) === 'on') e[a] = v; else e.setAttribute(a, v === true ? '' : v); }
    (k || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  var CSS = ':host{all:initial}*{box-sizing:border-box}[hidden]{display:none!important}' +
    '.w{--bg:#fff;--fg:#1d1d1f;--mut:#6b6b70;--bd:#d9d9de;--err:#8a1c1c;--errbg:#fde8e8;position:fixed;z-index:2147482970;font:15px/1.45 var(--f);color:var(--fg)}' +
    '.w.dark{--bg:#1e1e21;--fg:#f2f2f4;--mut:#9a9aa1;--bd:#3d3d43;--err:#f3b4b4;--errbg:#472222}' +
    '.w.fab{bottom:calc(16px + env(safe-area-inset-bottom))}.w.fab.r{right:16px}.w.fab.l{left:16px}' +
    '.w.mod{inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(0,0,0,.45)}' +
    '.w.cd{bottom:calc(16px + env(safe-area-inset-bottom))}.w.cd.r{right:16px}.w.cd.l{left:16px}.w.tp{top:0;left:0;right:0;padding:10px}.w.tp .p{width:min(640px,100%);margin:0 auto}' +
    '.lb{display:flex;align-items:center;gap:8px;min-width:56px;height:56px;padding:0 16px;border:0;border-radius:var(--rl);background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.28)}.lb .e{font-size:24px;line-height:1}' +
    'button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,a:focus-visible{outline:3px solid var(--c);outline-offset:2px}' +
    '.p{width:min(400px,calc(100vw - 24px));max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden}' +
    '.fab .p{position:absolute;bottom:68px;max-height:calc(100dvh - 110px)}.fab.r .p{right:0}.fab.l .p{left:0}' +
    '.h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--c);color:var(--on)}.h .he{font-size:24px}.h div{flex:1;min-width:0}.h b{display:block;font-size:16px}.h button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '.bd{overflow-y:auto;padding:14px}' +
    '.qb{margin:0 0 14px}.qt{font-weight:600;font-size:16px;margin:0 0 4px}.rq{color:var(--c)}.qd{color:var(--mut);font-size:13px;margin:0 0 8px}.ds{margin:0 0 12px;color:var(--mut);white-space:pre-line}' +
    '.o{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:0 0 8px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);cursor:pointer;font-size:15px}.o:hover{border-color:var(--c)}.o input{accent-color:var(--c);width:18px;height:18px;margin:0;flex:none}.o span{overflow-wrap:anywhere}.o.sel{border-color:var(--c);box-shadow:0 0 0 1px var(--c)}' +
    '.ot{width:100%;margin:0 0 8px;padding:9px 10px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:16px var(--f)}textarea.ot{min-height:84px;resize:vertical}' +
    '.sc,.rt{display:flex;gap:6px;flex-wrap:wrap}.sb2{min-width:40px;height:40px;border:1px solid var(--bd);border-radius:calc(var(--r) * .6);background:var(--bg);color:var(--fg);font:600 15px var(--f);cursor:pointer}.sb2.on{background:var(--c);color:var(--on);border-color:var(--c)}' +
    '.sl{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--mut);margin-top:4px}.st{font-size:32px;line-height:1;padding:0 3px;border:0;background:none;color:var(--bd);cursor:pointer}.st.on{color:#f5b301}' +
    '.pg{margin:0 0 12px}.pg i{display:block;height:6px;border-radius:3px;background:var(--bd);overflow:hidden}.pg i b{display:block;height:100%;background:var(--c);transition:width .25s}.pg .m{display:block;margin-top:4px;font-size:12px;color:var(--mut)}' +
    '.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}.er{margin:6px 0 0;padding:8px 10px;border-radius:calc(var(--r) * .6);background:var(--errbg);color:var(--err);font-size:13px}' +
    '.nv{display:flex;gap:8px;margin-top:10px}.sb,.at{flex:1;border:0;border-radius:calc(var(--r) * .6);padding:11px;background:var(--c);color:var(--on);font:600 15px var(--f);cursor:pointer}.sb:disabled{opacity:.55;cursor:default}.at{background:transparent;color:var(--fg);border:1px solid var(--bd);font-weight:400;font-size:14px}' +
    '.ok{text-align:center}.ok .e{font-size:36px}.ok p{margin:8px 0}.ok .at{display:block;width:100%;margin-top:8px}' +
    '.im{display:block;width:100%;max-height:200px;object-fit:cover;border-radius:calc(var(--r) * .6);margin:0 0 12px}.tx{margin:0;white-space:pre-line;overflow-wrap:anywhere}' +
    '.bts{display:flex;flex-direction:column;gap:8px;margin-top:14px}.bts:empty{display:none}.bt{display:block;text-align:center;text-decoration:none;padding:12px 16px;border-radius:calc(var(--r) * .6);border:2px solid var(--c);font:600 15px var(--f);overflow-wrap:anywhere}' +
    '.bt.f{background:var(--c);color:var(--on)}.bt.o{background:transparent;color:var(--c)}.bt.s{background:color-mix(in srgb,var(--c) 15%,transparent);color:var(--c);border-color:transparent}.bt:hover{filter:brightness(1.08)}' +
    '.ft{padding:6px 14px 10px;font-size:11px;color:var(--mut);text-align:right}.ft a{color:var(--mut)}' +
    '.w.page2{position:static;display:block;min-height:100vh;min-height:100dvh;padding:24px 12px 40px}' +
    '.page2 .p{width:min(640px,100%);margin:0 auto;max-height:none;overflow:visible;position:static;background:transparent;border:0;box-shadow:none;border-radius:0}' +
    '.page2 .h{display:block;padding:24px 24px 20px;margin:0 0 12px;background:var(--bg);color:var(--fg);border:1px solid var(--bd);border-top:10px solid var(--c);border-radius:var(--r)}' +
    '.page2 .h .he{display:block;font-size:30px;margin:0 0 6px}.page2 .h b{font-size:30px;line-height:1.2;font-weight:600;overflow-wrap:anywhere}.page2 .h .hd{margin:12px 0 0;font-size:15px;color:var(--mut);white-space:pre-line;overflow-wrap:anywhere}' +
    '.page2 .bd{overflow:visible;padding:0;background:transparent}' +
    '.page2 .qb,.page2 .ok{background:var(--bg);border:1px solid var(--bd);border-radius:var(--r);padding:20px 24px;margin:0 0 12px}.page2 .ok{padding:32px 24px}' +
    '.page2 .qt{font-size:16px;margin:0 0 6px}.page2 .qd{margin:0 0 12px}' +
    '.page2 .ot{border:0;border-bottom:1px solid var(--bd);border-radius:0;background:transparent;padding:8px 2px;margin:0 0 4px}.page2 .ot:focus{outline:0;border-bottom:2px solid var(--c);padding-bottom:7px}' +
    '.page2 select.ot{border:1px solid var(--bd);border-radius:calc(var(--r) * .6);padding:10px}.page2 textarea.ot{min-height:70px}' +
    '.page2 .o{border:0;border-radius:8px;padding:9px 6px;margin:0}.page2 .o:hover{background:color-mix(in srgb,var(--c) 8%,transparent)}.page2 .o.sel{box-shadow:none}.page2 .o input{width:20px;height:20px}' +
    '.page2 .nv{margin:16px 0 0}.page2 .sb{flex:none;padding:11px 28px;border-radius:calc(var(--r) * .6)}.page2 .er{margin:0 0 12px}' +
    '.page2 .ft{padding:16px 0 0;text-align:center;background:transparent}' +
    '@media(max-width:480px){.w.page2{padding:12px 8px 32px}.page2 .h,.page2 .qb,.page2 .ok{padding:16px}.page2 .h b{font-size:24px}}';

  function destroy() { if (timer) { clearTimeout(timer); timer = null; } if (host) { host.remove(); host = null; } cur = null; }

  function post(id, body) {
    body.id = id; body.page = (location.origin + location.pathname).slice(0, 300); body.vid = vid();
    return fetch(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); });
  }

  /* o: {id, cfg, kind, voted, preview, asAuto, dry} */
  function build(o, fl) {
    destroy();
    var id = o.id, c = o.cfg, kind = o.kind, lang = pickLang(c, fl), T = UI[lang];
    var color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#A8442E';
    var dark = c.theme === 'dark' || (c.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var r = c.radius == null ? 14 : Math.max(0, Math.min(28, +c.radius || 0));
    var page = !!o.page, auto = !page && c.mode === 'popup' && (!o.preview || o.asAuto);
    var place = !auto ? 'fab' : kind === 'popup' ? (c.place || 'center') : 'center';
    var openCls = { center: 'mod', br: 'cd r', bl: 'cd l', top: 'tp' }[place] || 'mod';
    var send = o.dry ? function () { return Promise.resolve({ ok: true, j: { ok: true } }); } : post;
    var title = c.title != null && c.title !== '' ? c.title : (kind === 'form' ? T.title : '');
    var emoji = c.emoji || (kind === 'popup' ? '📣' : '📝');
    var pos = c.position === 'left' ? 'l' : 'r', mk = dark ? ' dark' : '';

    host = document.createElement('div'); host.id = 'kk-survey-host'; if (page) host.style.display = 'block';
    var sh = host.attachShadow({ mode: 'open' });
    sh.appendChild(E('style', { text: CSS }));
    var w = E('div');
    w.style.cssText = '--c:' + color + ';--on:' + onColor(color) + ';--r:' + r + 'px;--rl:' + Math.min(r * 2, 28) + 'px;--f:' + (FONTS[c.font] || FONTS.system);
    var xb = E('button', { type: 'button', 'aria-label': T.close, text: '×' });
    var bd = E('div', { cls: 'bd' });
    var panel = E('div', { cls: 'p', role: 'dialog', 'aria-label': title || T.title, hidden: true }, [
      E('div', { cls: 'h' }, [E('span', { cls: 'he', text: emoji }), E('div', null, [E('b', { text: title })]), xb]), bd,
      E('div', { cls: 'ft' }, ['powered by ', E('a', { href: HOME, target: '_blank', rel: 'noopener', text: 'Karteikasten Developer' })])]);
    var lb = E('button', { type: 'button', cls: 'lb', 'aria-label': T.open }, [E('span', { cls: 'e', text: emoji }), c.launcher ? E('span', { text: c.launcher }) : null]);
    w.appendChild(panel); w.appendChild(lb); sh.appendChild(w); document.body.appendChild(host);

    var isOpen = false;
    function setOpen(v) {
      if (page) { isOpen = true; panel.hidden = false; w.className = 'w page2' + mk; lb.hidden = true; xb.hidden = true; return; }
      isOpen = v; panel.hidden = !v; lb.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (auto && v) { w.className = 'w ' + openCls + mk; lb.hidden = true; w.hidden = false; }
      else if (auto) { w.className = 'w fab ' + pos + mk; lb.hidden = !c.popup_button; w.hidden = !c.popup_button; }
      else { w.className = 'w fab ' + pos + mk; lb.hidden = false; w.hidden = false; }
    }
    setOpen(false); if (auto) w.hidden = true;
    xb.onclick = function () { setOpen(false); };
    lb.onclick = function () { setOpen(!isOpen); };
    if (place === 'center') w.addEventListener('mousedown', function (e) { if (e.target === w) setOpen(false); });
    sh.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) setOpen(false); });

    /* ---------- Popup mit Text, Bild und Knöpfen ---------- */
    function buildPopup() {
      bd.textContent = '';
      if (c.image && safeUrl(c.image, true)) bd.appendChild(E('img', { cls: 'im', src: c.image, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }));
      if (c.text) bd.appendChild(E('p', { cls: 'tx', text: c.text }));
      var bs = E('div', { cls: 'bts' });
      (c.buttons || []).forEach(function (b) {
        if (!b.label || !safeUrl(b.url)) return;
        bs.appendChild(E('a', { cls: 'bt ' + (b.style === 'outline' ? 'o' : b.style === 'soft' ? 's' : 'f'), href: b.url, target: b.new ? '_blank' : null, rel: b.new ? 'noopener noreferrer' : null, text: b.label }));
      });
      bd.appendChild(bs);
    }

    /* ---------- Formular ---------- */
    function qBlock(q) {
      var el = E('div', { cls: 'qb' }), g, t = q.type;
      el.appendChild(E('div', { cls: 'qt' }, [q.title, q.required ? E('span', { cls: 'rq', text: ' *', title: T.req }) : null]));
      if (q.desc) el.appendChild(E('div', { cls: 'qd', text: q.desc }));
      if (t === 'short' || t === 'email' || t === 'number' || t === 'date') {
        var inp = E('input', { cls: 'ot', type: t === 'short' ? 'text' : t, maxlength: t === 'short' ? 300 : null, 'aria-label': q.title });
        el.appendChild(inp); g = function () { return inp.value.trim(); };
      } else if (t === 'long') {
        var ta = E('textarea', { cls: 'ot', maxlength: 3000, 'aria-label': q.title });
        el.appendChild(ta); g = function () { return ta.value.trim(); };
      } else if (t === 'dropdown') {
        var se = E('select', { cls: 'ot', 'aria-label': q.title }, [E('option', { value: '', text: T.choose })].concat((q.options || []).map(function (op) { return E('option', { value: op, text: op }); })));
        el.appendChild(se); g = function () { return se.value; };
      } else if (t === 'single' || t === 'multi') {
        var multi = t === 'multi', ins = [], nm = 'q' + q.id, oin = null, otx = null;
        var refresh = function () {
          ins.concat(oin ? [oin] : []).forEach(function (x) { x.parentNode.classList.toggle('sel', x.checked); });
          if (otx) otx.hidden = !oin.checked;
        };
        (q.options || []).forEach(function (op) {
          var x = E('input', { type: multi ? 'checkbox' : 'radio', name: nm, value: op, onchange: refresh });
          ins.push(x); el.appendChild(E('label', { cls: 'o' }, [x, E('span', { text: op })]));
        });
        if (q.other) {
          oin = E('input', { type: multi ? 'checkbox' : 'radio', name: nm, value: '', onchange: function () { refresh(); if (!otx.hidden) otx.focus(); } });
          otx = E('input', { cls: 'ot', type: 'text', maxlength: 200, placeholder: T.otherPh, 'aria-label': q.other_label || T.other, hidden: true });
          el.appendChild(E('label', { cls: 'o' }, [oin, E('span', { text: q.other_label || T.other })])); el.appendChild(otx);
        }
        g = function () {
          var v = []; ins.forEach(function (x) { if (x.checked) v.push(x.value); });
          if (oin && oin.checked && otx.value.trim()) v.push(otx.value.trim());
          return multi ? v : (v[0] || '');
        };
      } else { // scale, rating
        var val = null, btns = [], isS = t === 'scale', lo = isS ? q.min : 1, hi = isS ? q.max : 5;
        var row = E('div', { cls: isS ? 'sc' : 'rt', role: 'group', 'aria-label': q.title });
        var mark = function () { btns.forEach(function (b, k) { var n = lo + k; b.className = (isS ? 'sb2' : 'st') + ((isS ? n === val : (val != null && n <= val)) ? ' on' : ''); b.setAttribute('aria-pressed', n === val ? 'true' : 'false'); }); };
        for (var n = lo; n <= hi; n++) (function (n) {
          var b = E('button', { type: 'button', text: isS ? String(n) : '★', 'aria-label': String(n), onclick: function () { val = (val === n && !q.required) ? null : n; mark(); } });
          btns.push(b); row.appendChild(b);
        })(n);
        mark(); el.appendChild(row);
        if (isS && (q.min_label || q.max_label)) el.appendChild(E('div', { cls: 'sl' }, [E('span', { text: q.min_label || '' }), E('span', { text: q.max_label || '' })]));
        g = function () { return val == null ? '' : val; };
      }
      function check() {
        var v = g(), empty = v === '' || v == null || (Array.isArray(v) && !v.length);
        if (empty) return q.required ? T.eReq : '';
        if (t === 'email' && !/^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/.test(v)) return T.eInv;
        if (t === 'number' && !isFinite(Number(v))) return T.eInv;
        return '';
      }
      return { q: q, el: el, get: g, check: check };
    }

    function showDone() {
      bd.textContent = '';
      bd.appendChild(E('div', { cls: 'ok' }, [E('div', { cls: 'e', text: '✅' }), E('p', { text: c.success || T.ok }),
        E('button', { type: 'button', cls: 'at', text: T.again, onclick: buildForm }),
        auto ? E('button', { type: 'button', cls: 'at', text: T.close, onclick: function () { setOpen(false); } }) : null]));
    }

    function buildForm() {
      bd.textContent = '';
      var qs = c.questions || [], steps = !page && c.layout !== 'page' && qs.length > 1, idx = 0, blocks = qs.map(qBlock);
      if (c.description && !page) bd.appendChild(E('p', { cls: 'ds', text: c.description }));
      var pb = E('b'), pm = E('span', { cls: 'm' });
      if (steps && c.show_progress !== false) bd.appendChild(E('div', { cls: 'pg' }, [E('i', null, [pb]), pm]));
      blocks.forEach(function (b) { bd.appendChild(b.el); });
      var er = E('div', { cls: 'er', role: 'alert', hidden: true }), hp = E('input', { type: 'text', tabindex: '-1', autocomplete: 'off' });
      var back = E('button', { type: 'button', cls: 'at', text: T.back }), nx = E('button', { type: 'button', cls: 'sb' });
      bd.appendChild(E('div', { cls: 'hp', 'aria-hidden': 'true' }, [hp])); bd.appendChild(er); bd.appendChild(E('div', { cls: 'nv' }, [back, nx]));
      function err(m) { er.textContent = m; er.hidden = !m; }
      function lastStep() { return !steps || idx === blocks.length - 1; }
      function show() {
        blocks.forEach(function (b, i) { b.el.hidden = steps && i !== idx; });
        back.hidden = !steps || idx === 0; nx.textContent = lastStep() ? T.submit : T.next;
        pb.style.width = Math.round((idx + 1) / blocks.length * 100) + '%'; pm.textContent = T.step.replace('{a}', idx + 1).replace('{b}', blocks.length); err('');
      }
      back.onclick = function () { if (idx > 0) { idx--; show(); } };
      var busy = false;
      nx.onclick = function () {
        if (busy) return;
        if (!lastStep()) { var m = blocks[idx].check(); if (m) return err(m); idx++; return show(); }
        var ans = {}, bad = -1, msg = '';
        blocks.forEach(function (b, i) {
          var m = b.check(); if (m && bad < 0) { bad = i; msg = m; }
          var v = b.get(); if (v !== '' && v != null && !(Array.isArray(v) && !v.length)) ans[b.q.id] = v;
        });
        if (bad >= 0) { if (steps) { idx = bad; show(); } return err(msg); }
        busy = true; nx.disabled = true; nx.textContent = T.sending;
        send(id, { action: 'submit', lang: lang, hp: hp.value, answers: ans }).then(function (x) {
          if (x.ok && x.j.ok) { showDone(); return; }
          var k = x.j && x.j.error;
          err(k === 'domain' ? T.eDom : k === 'slow' ? T.eSlow : k === 'required' ? T.eReq : k === 'invalid' ? T.eInv : T.eFail);
        }).catch(function () { err(T.eNet); }).then(function () { busy = false; nx.disabled = false; if (nx.isConnected) nx.textContent = lastStep() ? T.submit : T.next; });
      };
      show();
    }

    if (page) {
      if (c.description && kind === 'form') panel.querySelector('.h div').appendChild(E('div', { cls: 'hd', text: c.description }));
      document.title = title || T.title;
      document.body.style.margin = '0';
      document.body.style.background = dark ? '#121214' : 'color-mix(in srgb,' + color + ' 10%,#f6f6f8)';
    }
    if (kind === 'popup') buildPopup(); else if (o.voted) showDone(); else buildForm();
    return { open: function () { setOpen(true); }, idle: function () { setOpen(false); } };
  }

  function start(id, forceOpen, fl) {
    post(id, { action: 'config' }).then(function (x) {
      if (!x.ok || !x.j.pub) return;
      var c = x.j.pub, rev = x.j.rev, kind = x.j.kind;
      cur = build({ id: id, cfg: c, kind: kind, voted: x.j.voted }, fl);
      var ui = cur;
      if (forceOpen) { ui.open(); return; }
      if (c.mode !== 'popup') return;
      var key = 'kk_sv_seen_' + id, seen = {}; try { seen = JSON.parse(store(key) || '{}') || {}; } catch (e) { }
      var freq = kind === 'popup' ? (c.freq || 'once') : 'once', was = (seen.r || 0) >= rev;
      if (x.j.voted || (was && (freq === 'once' || (freq === 'days' && Date.now() - (seen.t || 0) < (c.freq_days || 7) * 864e5)))) { ui.idle(); return; }
      function reveal() { ui.open(); store(key, JSON.stringify({ r: rev, t: Date.now() })); }
      var delay = (c.popup_delay || 0) * 1000;
      if (c.trigger === 'date') {
        var d = new Date(), today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        if (today >= c.popup_date) timer = setTimeout(reveal, delay); else ui.idle();
      } else timer = setTimeout(reveal, delay);
    }).catch(function () { });
  }

  /* Eigene Formularseite (wie Google Forms): zeigt das Formular als ganze Seite, ohne Knopf und Popup */
  function page(id, fl, onFail) {
    post(id, { action: 'config' }).then(function (x) {
      if (!x.ok || !x.j.pub) { if (onFail) onFail(x.j && x.j.error); return; }
      cur = build({ id: id, cfg: x.j.pub, kind: x.j.kind, voted: false, page: true }, fl);
    }).catch(function () { if (onFail) onFail('net'); });
  }

  window.KKSurvey = {
    page: page,
    destroy: destroy,
    start: start,
    open: function () { if (cur) cur.open(); },
    mount: function (o) { cur = build({ id: 'preview', cfg: o.cfg, kind: o.kind, preview: true, asAuto: !!o.asAuto, dry: true }, o.lang); cur.open(); }
  };
  if (script && script.getAttribute('data-survey')) {
    var go = function () { start(script.getAttribute('data-survey'), script.getAttribute('data-open') === 'true', script.getAttribute('data-lang') || undefined); };
    if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
  }
})();

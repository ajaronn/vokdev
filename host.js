/* Web-Hosting-Seite: Login, Upload nach Supabase Storage, Veröffentlichen über Edge Function "publish".
   Kein supabase-js nötig (CSP: script-src 'self'), nur fetch. */
(function () {
  'use strict';
  var SB = 'https://qujcvvxdvpqnsfgvleid.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1amN2dnhkdnBxbnNmZ3ZsZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODQ3OTcsImV4cCI6MjEwNTY2MDc5N30.aNsVqELIJTSDIuJOEj6CL_ii2NL6JUBjZRDb3ZtcTWY';
  var CLIENT_ID = '56a57017-9aa6-4798-b5e9-4bdcf7963781';   // gleicher OAuth-Client wie app.js
  var REDIRECT = 'https://ajaronn.github.io/vokdev/';
  var SITE_BASE = 'https://ajaronn.github.io/web/';
  var LS_SESSION = 'kkdev_session', LS_LANG = 'kk_lang';

  var T = {
    de: { needLogin: 'Melde dich mit deinem Karteikasten-Konto an, um Seiten hochzuladen.', loginKk: 'Mit Karteikasten fortfahren', title: 'Web-Hosting', intro: 'Lade deine Webseite (HTML, CSS, JS, Bilder) hoch. Sie wird automatisch veröffentlicht.', login: 'Anmelden', signup: 'Registrieren', logout: 'Abmelden', email: 'E-Mail', password: 'Passwort (mind. 8 Zeichen)', new: 'Seite hochladen', name: 'Name der Seite (a–z, 0–9, -)', files: 'Dateien auswählen', folder: 'oder ganzen Ordner auswählen', rules: 'Pflicht: index.html. Erlaubt: html, css, js, json, txt, svg, png, jpg, gif, webp, ico, woff/woff2. Max. 100 Dateien, 5 MB pro Datei, 20 MB gesamt, 3 Seiten pro Konto. Du bist für deine Inhalte verantwortlich; Missbrauch führt zur Sperrung.', publish: 'Veröffentlichen', mine: 'Meine Seiten', del: 'Löschen', confirmDel: 'Seite wirklich löschen?', none: 'Noch keine Seiten.', upl: 'Lade hoch…', pub: 'Veröffentliche…', done: 'Fertig! Erreichbar unter (kann 1–2 Minuten dauern):', checkMail: 'Bitte bestätige deine E-Mail und melde dich dann an.', loggedAs: 'Angemeldet als ', preview: 'Adresse: ',
      e_unauthorized: 'Bitte erneut anmelden.', e_bad_slug: 'Ungültiger oder reservierter Name.', e_slug_taken: 'Dieser Name ist schon vergeben.', e_bad_path: 'Ungültiger Dateipfad.', e_bad_type: 'Dateityp nicht erlaubt.', e_no_index: 'index.html fehlt.', e_bad_count: 'Zu viele oder keine Dateien.', e_too_big: 'Datei zu groß (max. 5 MB).', e_too_big_total: 'Gesamtgröße zu groß (max. 20 MB).', e_limit_sites: 'Maximal 3 Seiten pro Konto.', e_blocked: 'Diese Seite wurde gesperrt.', e_missing_file: 'Eine Datei fehlt, bitte erneut hochladen.', e_generic: 'Fehler. Bitte später erneut versuchen.', e_login: 'Anmeldung fehlgeschlagen.' },
    en: { needLogin: 'Sign in with your Karteikasten account to upload sites.', loginKk: 'Continue with Karteikasten', title: 'Web hosting', intro: 'Upload your website (HTML, CSS, JS, images). It is published automatically.', login: 'Sign in', signup: 'Sign up', logout: 'Sign out', email: 'Email', password: 'Password (min. 8 characters)', new: 'Upload a site', name: 'Site name (a–z, 0–9, -)', files: 'Choose files', folder: 'or choose a whole folder', rules: 'Required: index.html. Allowed: html, css, js, json, txt, svg, png, jpg, gif, webp, ico, woff/woff2. Max. 100 files, 5 MB per file, 20 MB total, 3 sites per account. You are responsible for your content; abuse leads to a ban.', publish: 'Publish', mine: 'My sites', del: 'Delete', confirmDel: 'Really delete this site?', none: 'No sites yet.', upl: 'Uploading…', pub: 'Publishing…', done: 'Done! Available at (may take 1–2 minutes):', checkMail: 'Please confirm your email, then sign in.', loggedAs: 'Signed in as ', preview: 'Address: ',
      e_unauthorized: 'Please sign in again.', e_bad_slug: 'Invalid or reserved name.', e_slug_taken: 'This name is already taken.', e_bad_path: 'Invalid file path.', e_bad_type: 'File type not allowed.', e_no_index: 'index.html is missing.', e_bad_count: 'Too many files or none.', e_too_big: 'File too large (max. 5 MB).', e_too_big_total: 'Total size too large (max. 20 MB).', e_limit_sites: 'Maximum 3 sites per account.', e_blocked: 'This site has been blocked.', e_missing_file: 'A file is missing, please upload again.', e_generic: 'Error. Please try again later.', e_login: 'Sign-in failed.' },
    'pt-BR': { needLogin: 'Entre com sua conta Karteikasten para enviar sites.', loginKk: 'Continuar com o Karteikasten', title: 'Hospedagem web', intro: 'Envie seu site (HTML, CSS, JS, imagens). Ele é publicado automaticamente.', login: 'Entrar', signup: 'Cadastrar', logout: 'Sair', email: 'E-mail', password: 'Senha (mín. 8 caracteres)', new: 'Enviar um site', name: 'Nome do site (a–z, 0–9, -)', files: 'Escolher arquivos', folder: 'ou escolher uma pasta inteira', rules: 'Obrigatório: index.html. Permitido: html, css, js, json, txt, svg, png, jpg, gif, webp, ico, woff/woff2. Máx. 100 arquivos, 5 MB por arquivo, 20 MB no total, 3 sites por conta. Você é responsável pelo seu conteúdo; abuso leva a bloqueio.', publish: 'Publicar', mine: 'Meus sites', del: 'Excluir', confirmDel: 'Excluir este site mesmo?', none: 'Nenhum site ainda.', upl: 'Enviando…', pub: 'Publicando…', done: 'Pronto! Disponível em (pode levar 1–2 minutos):', checkMail: 'Confirme seu e-mail e depois entre.', loggedAs: 'Conectado como ', preview: 'Endereço: ',
      e_unauthorized: 'Entre novamente.', e_bad_slug: 'Nome inválido ou reservado.', e_slug_taken: 'Este nome já está em uso.', e_bad_path: 'Caminho de arquivo inválido.', e_bad_type: 'Tipo de arquivo não permitido.', e_no_index: 'Falta o index.html.', e_bad_count: 'Arquivos demais ou nenhum.', e_too_big: 'Arquivo grande demais (máx. 5 MB).', e_too_big_total: 'Tamanho total grande demais (máx. 20 MB).', e_limit_sites: 'Máximo de 3 sites por conta.', e_blocked: 'Este site foi bloqueado.', e_missing_file: 'Falta um arquivo, envie novamente.', e_generic: 'Erro. Tente novamente mais tarde.', e_login: 'Falha ao entrar.' }
  };

  var $ = function (id) { return document.getElementById(id); };
  var lang = 'de';
  if (T[window.kkLang]) lang = window.kkLang; else { try { var l = localStorage.getItem(LS_LANG); if (T[l]) lang = l; } catch (e) {} }
  function t(k) { return (T[lang] && T[lang][k]) || T.de[k] || k; }
  function applyLang() {
    document.documentElement.lang = lang; document.title = t('title') + ' – Karteikasten Developer';
    document.querySelectorAll('[data-t]').forEach(function (n) { n.textContent = t(n.getAttribute('data-t')); });
    updatePreview(); if (session) loadList();
  }

  var session = null;
  try { session = JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); } catch (e) {}
  function saveSession(s) {
    session = s;
    try { s ? localStorage.setItem(LS_SESSION, JSON.stringify(s)) : localStorage.removeItem(LS_SESSION); } catch (e) {}
  }

  function msg(text, cls) { var m = $('msg'); m.textContent = text || ''; m.className = cls || ''; }
  function errText(code) { return t('e_' + code) !== 'e_' + code ? t('e_' + code) : t('e_generic'); }

  function api(path, opts) {
    opts = opts || {};
    var h = Object.assign({ apikey: KEY, Authorization: 'Bearer ' + (session ? session.access_token : KEY) }, opts.headers || {});
    return fetch(SB + path, Object.assign({}, opts, { headers: h }));
  }

  function jwt(tk) { try { var p = tk.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(atob(p + '='.repeat((4 - p.length % 4) % 4))); } catch (e) { return {}; } }
  function b64url(buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function rand(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return b64url(a); }

  // Token ggf. erneuern (gleiche Sitzung wie die Developer-Seite: localStorage "kkdev_session")
  async function ensureSession() {
    if (!session) return false;
    if (session.expires_at - Date.now() > 60000) return true;
    try {
      var r = await fetch(SB + '/auth/v1/oauth/token', { method: 'POST', headers: { apikey: KEY, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: session.refresh_token, client_id: CLIENT_ID }).toString() });
      var j = await r.json();
      if (!r.ok) throw 0;
      saveSession({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000 });
      return true;
    } catch (e) { saveSession(null); return false; }
  }

  // Anmeldung über Karteikasten (OAuth + PKCE), Abschluss macht app.js und leitet zurück zu host.html
  async function login() {
    var verifier = rand(48), state = rand(16);
    var hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    try { sessionStorage.setItem('kkdev_pkce', JSON.stringify({ v: verifier, s: state, r: '#/apps' })); sessionStorage.setItem('kkdev_return', 'host.html'); } catch (e) {}
    var q = new URLSearchParams({ response_type: 'code', client_id: CLIENT_ID, redirect_uri: REDIRECT, scope: 'email profile', state: state, code_challenge: b64url(hash), code_challenge_method: 'S256' });
    location.assign(SB + '/auth/v1/oauth/authorize?' + q);
  }

  function show() {
    $('auth').hidden = !!session; $('app').hidden = !session;
    if (session) { $('who').textContent = t('loggedAs') + (jwt(session.access_token).email || ''); loadList(); }
  }

  function cleanSlug() { return $('slug').value.trim().toLowerCase(); }
  function updatePreview() { var s = cleanSlug(); $('url-preview').textContent = s ? t('preview') + SITE_BASE + s + '/' : ''; }

  async function loadList() {
    if (!(await ensureSession())) { show(); return; }
    var r = await api('/rest/v1/sites?select=slug,files,blocked&order=updated_at.desc');
    var ul = $('list'); ul.textContent = '';
    var rows = r.ok ? await r.json() : [];
    if (!rows.length) { var li = document.createElement('li'); li.textContent = t('none'); ul.appendChild(li); return; }
    rows.forEach(function (s) {
      var li = document.createElement('li'), a = document.createElement('a'), b = document.createElement('button');
      a.href = SITE_BASE + s.slug + '/'; a.textContent = s.slug; a.target = '_blank'; a.rel = 'noopener';
      b.className = 'alt'; b.textContent = t('del');
      b.onclick = async function () {
        if (!confirm(t('confirmDel'))) return;
        var res = await call({ action: 'delete', slug: s.slug });
        if (res.error) alert(errText(res.error)); loadList();
      };
      li.appendChild(a); li.appendChild(b); ul.appendChild(li);
    });
  }

  async function call(body) {
    await ensureSession();
    var r = await api('/functions/v1/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json().catch(function () { return { error: 'generic' }; });
  }

  function collect() {
    var out = [], seen = {};
    function add(f, p) { if (p && !seen[p]) { seen[p] = 1; out.push({ file: f, path: p }); } }
    Array.prototype.forEach.call($('files').files, function (f) { add(f, f.name); });
    Array.prototype.forEach.call($('folder').files, function (f) {
      var p = f.webkitRelativePath || f.name; add(f, p.split('/').slice(1).join('/') || f.name);
    });
    return out;
  }

  async function publish() {
    var slug = cleanSlug(), list = collect(), btn = $('btn-pub');
    if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug)) { msg(errText('bad_slug'), 'err'); return; }
    if (!list.some(function (x) { return x.path === 'index.html'; })) { msg(errText('no_index'), 'err'); return; }
    if (!(await ensureSession())) { show(); return; }
    btn.disabled = true; msg(t('upl'));
    try {
      var uid = jwt(session.access_token).sub;
      for (var i = 0; i < list.length; i++) {
        var x = list[i], enc = x.path.split('/').map(encodeURIComponent).join('/');
        var r = await api('/storage/v1/object/sites/' + uid + '/' + slug + '/' + enc, { method: 'POST', headers: { 'x-upsert': 'true', 'Content-Type': x.file.type || 'application/octet-stream' }, body: x.file });
        if (!r.ok) throw { code: r.status === 413 ? 'too_big' : 'generic' };
        msg(t('upl') + ' ' + (i + 1) + '/' + list.length);
      }
      msg(t('pub'));
      var res = await call({ action: 'publish', slug: slug, files: list.map(function (x) { return x.path; }) });
      if (res.error) throw { code: res.error };
      msg(t('done') + ' ' + res.url, 'ok'); loadList();
    } catch (e) { msg(errText(e.code || 'generic'), 'err'); }
    btn.disabled = false;
  }

  $('btn-login').onclick = login;
  $('btn-logout').onclick = function () { saveSession(null); show(); };
  $('btn-pub').onclick = publish;
  $('slug').oninput = updatePreview;
  applyLang(); show();
})();

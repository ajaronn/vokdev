/* Karteikasten Developer – Single-Page-App (Hash-Routing).
   Anmeldung: eigener OAuth-2.1-Flow (Authorization Code + PKCE) gegen den Karteikasten-OAuth-Server (Supabase Auth).
   Bewusst OHNE supabase-js: Die Seite liegt auf demselben Origin (ajaronn.github.io) wie die Karteikasten-App; ein
   eigener Speicherschlüssel verhindert, dass die Sitzungen sich gegenseitig überschreiben. */
(function () {
  'use strict';
  var CONFIG = {
    SUPABASE_URL: 'https://qujcvvxdvpqnsfgvleid.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1amN2dnhkdnBxbnNmZ3ZsZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODQ3OTcsImV4cCI6MjEwNTY2MDc5N30.aNsVqELIJTSDIuJOEj6CL_ii2NL6JUBjZRDb3ZtcTWY',
    CLIENT_ID: '56a57017-9aa6-4798-b5e9-4bdcf7963781',   // siehe SETUP.md, Schritt 4
    REDIRECT_URI: 'https://ajaronn.github.io/vokdev/',
    MAIN_APP: 'https://ajaronn.github.io/vokabeln/'
  };
  var API_BASE = CONFIG.SUPABASE_URL + '/functions/v1/dev-api/v1';
  var APPS_API = CONFIG.SUPABASE_URL + '/functions/v1/dev-apps';
  var SCOPES = {
    'profile.read': ['Profil lesen', 'Name und Benutzername des Nutzers'],
    'lists.read': ['Listen lesen', 'Listen mit Namen und Sprachen'],
    'lists.create': ['Listen erstellen', 'Neue Listen anlegen'],
    'lists.update': ['Listen bearbeiten', 'Umbenennen, Sprachen ändern'],
    'lists.delete': ['Listen löschen', 'Ganze Listen entfernen (sensibel)'],
    'vocab.read': ['Vokabeln lesen', 'Wörter, Übersetzungen, Kommentare'],
    'vocab.write': ['Vokabeln erstellen und bearbeiten', 'Wörter hinzufügen und ändern'],
    'progress.read': ['Lernfortschritt lesen', 'Boxen und Trefferquote']
  };
  var view = document.getElementById('view'), userbox = document.getElementById('userbox');

  /* ---------- Helfer ---------- */
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k]; if (v == null || v === false) return;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function mount(nodes) { view.textContent = ''; nodes.forEach(function (n) { view.appendChild(n); }); kkTranslateTree(view); window.scrollTo(0, 0); }
  function httpsUrl(u) { try { var x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } }
  function b64url(buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function rand(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return b64url(a); }
  function jwt(t) { try { var p = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(atob(p + '='.repeat((4 - p.length % 4) % 4))); } catch (e) { return {}; } }
  function code(text) { return el('code', { text: text }); }
  function pre(text) { return el('pre', null, [el('code', { text: text })]); }

  /* ---------- OAuth (PKCE) ---------- */
  var SKEY = 'kkdev_session';
  function getSession() { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } }
  function setSession(s) { try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch (e) { } }
  function configured() { return CONFIG.CLIENT_ID.indexOf('HIER_') !== 0; }
  function login() {
    if (!configured()) { alert(kkT('Der Developer-OAuth-Client ist noch nicht eingetragen (app.js → CONFIG.CLIENT_ID).')); return; }
    var verifier = rand(48), state = rand(16);
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)).then(function (h) {
      sessionStorage.setItem('kkdev_pkce', JSON.stringify({ v: verifier, s: state, r: location.hash || '#/apps' }));
      var q = new URLSearchParams({ response_type: 'code', client_id: CONFIG.CLIENT_ID, redirect_uri: CONFIG.REDIRECT_URI, scope: 'email profile',
        state: state, code_challenge: b64url(h), code_challenge_method: 'S256' });
      location.assign(CONFIG.SUPABASE_URL + '/auth/v1/oauth/authorize?' + q);
    });
  }
  function tokenRequest(params) {
    return fetch(CONFIG.SUPABASE_URL + '/auth/v1/oauth/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', apikey: CONFIG.ANON_KEY },
      body: new URLSearchParams(params).toString() }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error_description || j.error || 'Token-Fehler'); return j; }); })
      .then(function (j) { var s = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000 }; setSession(s); return s; });
  }
  function handleCallback() {
    var q = new URLSearchParams(location.search);
    if (!q.has('code') && !q.has('error')) return Promise.resolve();
    var saved; try { saved = JSON.parse(sessionStorage.getItem('kkdev_pkce') || 'null'); sessionStorage.removeItem('kkdev_pkce'); } catch (e) { }
    history.replaceState(null, '', CONFIG.REDIRECT_URI + (saved && saved.r || '#/apps'));
    if (q.get('error')) { setTimeout(function () { toast('err', q.get('error') === 'access_denied' ? 'Anmeldung abgebrochen.' : 'Anmeldung fehlgeschlagen.'); }, 0); return Promise.resolve(); }
    if (!saved || saved.s !== q.get('state')) { setTimeout(function () { toast('err', 'Ungültiger Anmeldestatus. Bitte erneut anmelden.'); }, 0); return Promise.resolve(); }
    return tokenRequest({ grant_type: 'authorization_code', code: q.get('code'), redirect_uri: CONFIG.REDIRECT_URI, client_id: CONFIG.CLIENT_ID, code_verifier: saved.v })
      .catch(function (e) { setTimeout(function () { toast('err', kkT('Anmeldung fehlgeschlagen: {m}', { m: e.message })); }, 0); });
  }
  function accessToken() {
    var s = getSession(); if (!s) return Promise.resolve(null);
    if (s.expires_at - Date.now() > 60000) return Promise.resolve(s.access_token);
    return tokenRequest({ grant_type: 'refresh_token', refresh_token: s.refresh_token, client_id: CONFIG.CLIENT_ID })
      .then(function (n) { return n.access_token; }).catch(function () { setSession(null); return null; });
  }
  function logout() { setSession(null); renderUser(); location.hash = '#/'; route(); }

  function call(base, path, opts) {
    opts = opts || {};
    return accessToken().then(function (t) {
      if (!t) throw new Error(kkT('Nicht angemeldet.'));
      return fetch(base + path, { method: opts.method || 'GET', headers: { authorization: 'Bearer ' + t, 'content-type': 'application/json' }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var c = j.error && j.error.code, m = c ? kkT('err:' + c) : ''; if (!m || m === 'err:' + c) m = j.error && j.error.message || 'Error ' + r.status; var e = new Error(m); e.code = c; throw e; } return j; });
    });
  }

  /* ---------- Meldungen ---------- */
  var toastBox = el('div', { 'aria-live': 'polite', class: 'sr' });
  function toast(kind, text) {
    var n = el('div', { class: 'notice ' + kind, role: kind === 'err' ? 'alert' : 'status', text: kkT(text) });
    view.insertBefore(n, view.firstChild); setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 7000);
  }

  /* ---------- Kopf ---------- */
  function renderUser() {
    userbox.textContent = '';
    var s = getSession();
    if (s) { var c = jwt(s.access_token); userbox.appendChild(el('span', { class: 'small muted', text: c.email || 'Angemeldet' })); userbox.appendChild(document.createTextNode(' ')); userbox.appendChild(el('button', { class: 'btn small', onclick: logout, text: 'Abmelden' })); }
    else userbox.appendChild(el('button', { class: 'btn small primary', onclick: login, text: 'Mit Karteikasten fortfahren' }));
    kkTranslateTree(userbox);
  }
  function markNav(r) { document.querySelectorAll('.top nav a').forEach(function (a) { if (a.dataset.r === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }

  /* ---------- Seiten ---------- */
  function pageHome() {
    var s = getSession();
    mount([
      el('section', { class: 'hero' }, [
        el('p', { class: 'hand', text: 'Für Entwickler' }),
        el('h1', { text: 'Baue mit Karteikasten' }),
        el('p', { class: 'muted', text: 'Lass Nutzer sich mit ihrem Karteikasten-Konto anmelden und gib deiner App – mit ihrer Erlaubnis – Zugriff auf Listen, Vokabeln und Lernfortschritt.' }),
        el('div', { class: 'btns', style: null }, [
          el('button', { class: 'btn primary', onclick: s ? function () { location.hash = '#/apps'; } : login, text: s ? 'Meine Apps' : 'Mit Karteikasten fortfahren' }),
          el('a', { class: 'btn', href: '#/docs', text: 'Dokumentation lesen' })])
      ]),
      el('div', { class: 'grid' }, [
        card('Mit Karteikasten fortfahren', 'Standard-OAuth 2.0 mit PKCE. Nutzer sehen eine Zustimmungsseite mit Logo und Namen deiner App und entscheiden, was sie erlauben.'),
        card('REST-API', 'Listen lesen, erstellen, bearbeiten und löschen. Vokabeln lesen, erstellen und ändern. Lernfortschritt abrufen.'),
        card('Sicher & kontrollierbar', 'Nutzer können Berechtigungen einzeln abwählen und den Zugriff jederzeit widerrufen. Zum Erstellen von Apps ist 2FA Pflicht.')
      ]),
      el('section', { class: 'card' }, [el('h2', { text: 'So funktioniert es' }), el('ol', null, [
        el('li', { text: 'Melde dich mit deinem Karteikasten-Konto an und lege unter „Meine Apps“ eine App an.' }),
        el('li', { text: 'Trage Weiterleitungs-URI, Logo und die benötigten Berechtigungen ein.' }),
        el('li', { text: 'Baue den Login-Button nach der Dokumentation ein – fertig.' })])])
    ]);
  }
  function card(t, d) { return el('section', { class: 'card' }, [el('h3', { text: t }), el('p', { class: 'muted', text: d })]); }

  function pageDocs() {
    var B = CONFIG.SUPABASE_URL;
    function ep(m, p, d) { return el('div', null, [el('div', { class: 'ep' }, [el('span', { class: 'm ' + m, text: m }), el('b', { text: p })]), el('p', { class: 'muted small', text: d })]); }
    var rows = Object.keys(SCOPES).map(function (k) { return el('tr', null, [el('td', null, [code(k)]), el('td', { text: SCOPES[k][0] }), el('td', { class: 'muted', text: SCOPES[k][1] })]); });
    mount([
      el('h1', { text: 'Dokumentation' }),
      el('section', { class: 'card' }, [el('h2', { text: '1. Anmelden mit Karteikasten (OAuth 2.0 + PKCE)' }),
        el('p', { text: 'Registriere deine App unter „Meine Apps“. Du erhältst eine client_id. Leite Nutzer dann zum Autorisierungs-Endpunkt:' }),
        pre('GET ' + B + '/auth/v1/oauth/authorize\n  ?response_type=code\n  &client_id=DEINE_CLIENT_ID\n  &redirect_uri=https://deine-app.example/callback\n  &scope=email%20profile\n  &state=ZUFALLSWERT\n  &code_challenge=BASE64URL(SHA256(code_verifier))\n  &code_challenge_method=S256'),
        el('p', { text: 'Nicht angemeldete Nutzer melden sich bei Karteikasten an oder erstellen ein Konto. Danach sehen sie die Zustimmungsseite. Mit dem Code holst du die Tokens:' }),
        pre('POST ' + B + '/auth/v1/oauth/token\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code&code=...&redirect_uri=...\n&client_id=DEINE_CLIENT_ID&code_verifier=...'),
        el('p', { class: 'muted small', text: 'Vertrauliche Clients (Server) authentifizieren sich zusätzlich mit client_secret (HTTP Basic). Refresh: grant_type=refresh_token. PKCE ist Pflicht. Weiterleitungs-URIs müssen exakt übereinstimmen.' }),
        el('p', { class: 'small' }, [document.createTextNode('Discovery: '), code(B + '/.well-known/oauth-authorization-server/auth/v1')])]),
      el('section', { class: 'card' }, [el('h2', { text: '2. Berechtigungen' }),
        el('p', { text: 'Du deklarierst beim Anlegen, welche Berechtigungen deine App maximal braucht. Nutzer sehen sie auf der Zustimmungsseite und können einzelne abwählen. Fordere nur an, was du brauchst.' }),
        el('table', null, [el('thead', null, [el('tr', null, [el('th', { text: 'Scope' }), el('th', { text: 'Bezeichnung' }), el('th', { text: 'Umfang' })])]), el('tbody', null, rows)])]),
      el('section', { class: 'card' }, [el('h2', { text: '3. REST-API' }),
        el('p', { class: 'small' }, [document.createTextNode('Basis-URL: '), code(API_BASE)]),
        pre('curl ' + API_BASE + '/lists \\\n  -H "Authorization: Bearer ACCESS_TOKEN"'),
        ep('GET', '/me', 'Profil (profile.read)'), ep('GET', '/lists', 'Alle Listen (lists.read)'), ep('POST', '/lists', 'Liste erstellen: {"name","lang_a","lang_b"} (lists.create)'),
        ep('GET', '/lists/{id}', 'Eine Liste (lists.read)'), ep('PATCH', '/lists/{id}', 'Liste ändern (lists.update)'), ep('DELETE', '/lists/{id}', 'Liste löschen (lists.delete)'),
        ep('GET', '/lists/{id}/vocab?limit=200&offset=0', 'Vokabeln lesen (vocab.read; mit Fortschritt, wenn progress.read erlaubt)'),
        ep('POST', '/lists/{id}/vocab', 'Vokabel(n) hinzufügen: {"a","b","phonetic","comment","chapter","starred"} oder Array, max. 500 (vocab.write)'),
        ep('PATCH', '/lists/{id}/vocab/{vocabId}', 'Vokabel ändern (vocab.write)'),
        ep('GET', '/progress', 'Fortschritt aller Listen (progress.read)'), ep('GET', '/lists/{id}/progress', 'Fortschritt einer Liste (progress.read)')]),
      el('section', { class: 'card' }, [el('h2', { text: '4. Fehler & Limits' }),
        el('p', { text: 'Fehler: {"error":{"code","message"}}. 401 Token ungültig · 403 fehlende Berechtigung oder widerrufen · 429 Rate-Limit (120 Anfragen/Minute je Nutzer und App) · 409 gleichzeitige Änderung (erneut versuchen).' }),
        el('p', { class: 'muted small', text: 'Limits: 200 Listen, 5000 Vokabeln je Liste. Änderungen über die API erscheinen in der Karteikasten-App nach dem nächsten Laden/Synchronisieren.' })]),
      el('section', { class: 'card' }, [el('h2', { text: '5. Ausprobieren' }),
        el('p', { text: 'Mit der Test-App kannst du Anmeldung und API direkt im Browser testen.' }),
        el('a', { class: 'btn', href: '#/test', text: 'Zur Test-App' })])
    ]);
  }

  function pageTest() {
    var testUrl = CONFIG.REDIRECT_URI + 'test.html';
    var nodes = [
      el('h1', { text: 'Test-App' }),
      el('section', { class: 'card' }, [
        el('p', { text: 'Mit der Test-App probierst du aus, wie sich eine fremde App mit „Mit Karteikasten fortfahren“ anmeldet und die REST-API nutzt – ohne eigene Webseite bauen zu müssen.' }),
        el('ol', { class: 'steps' }, [
          el('li', { text: 'Lege unter „Meine Apps“ eine App vom Typ „Öffentlich“ an.' }),
          el('li', {}, [document.createTextNode(kkT('Trage als Weiterleitungs-URI exakt diese Adresse ein:') + ' '), code(testUrl)]),
          el('li', { text: 'Wähle die Berechtigungen, die du testen willst.' }),
          el('li', { text: 'Öffne die Test-App, trage die client_id ein und melde dich an. Danach kannst du API-Anfragen senden.' })
        ]),
        el('div', { class: 'btns' }, [el('a', { class: 'btn primary', href: 'test.html', text: 'Test-App öffnen' }), el('a', { class: 'btn', href: '#/apps', text: 'Meine Apps' })])
      ])
    ];
    if (!getSession()) {
      nodes.push(el('section', { class: 'card center' }, [el('p', { class: 'muted', text: 'Melde dich an, um deine Apps hier direkt zum Testen auszuwählen.' }),
        el('button', { class: 'btn primary', onclick: login, text: 'Mit Karteikasten fortfahren' })]));
      mount(nodes); return;
    }
    var box = el('section', { class: 'card' }, [el('h2', { text: 'Deine Apps testen' }), el('div', { class: 'spinner' })]);
    nodes.push(box); mount(nodes);
    call(APPS_API, '/apps').then(function (r) {
      var apps = (r.data || []).filter(function (a) { return a.client_type === 'public' && a.status === 'active'; });
      box.textContent = ''; box.appendChild(el('h2', { text: 'Deine Apps testen' }));
      if (!apps.length) { box.appendChild(el('p', { class: 'muted', text: 'Du hast noch keine öffentliche App.' })); kkTranslateTree(box); return; }
      var list = el('div', { class: 'tgrid' });
      apps.forEach(function (a) {
        var lu = httpsUrl(a.logo_url), ok = (a.redirect_uris || []).indexOf(testUrl) >= 0;
        list.appendChild(el('div', { class: 'trow' }, [lu ? el('img', { class: 'logo', src: lu, alt: '' }) : el('div', { class: 'logo', text: a.name[0].toUpperCase() }),
          el('div', { class: 'grow' }, [el('b', { text: a.name }), el('p', { class: 'hint', text: ok ? 'Weiterleitungs-URI der Test-App ist eingetragen.' : 'Die Weiterleitungs-URI der Test-App fehlt noch (Bearbeiten).' })]),
          el('a', { class: 'btn small' + (ok ? ' primary' : ''), href: 'test.html?client_id=' + encodeURIComponent(a.client_id), text: 'Mit dieser App testen' })]));
      });
      box.appendChild(list); kkTranslateTree(box);
    }).catch(function (e) { box.textContent = ''; box.appendChild(el('div', { class: 'notice err', text: kkT('Konnte nicht geladen werden: {m}', { m: e.message }) })); });
  }

  function pageApps() {
    if (!getSession()) {
      mount([el('section', { class: 'card center' }, [el('h1', { text: 'Meine Apps' }), el('p', { class: 'muted', text: 'Melde dich mit deinem Karteikasten-Konto an.' }),
        el('button', { class: 'btn primary', onclick: login, text: 'Mit Karteikasten fortfahren' })])]); return;
    }
    mount([el('div', { class: 'spinner' })]);
    Promise.all([call(APPS_API, '/status'), call(APPS_API, '/apps')]).then(function (r) { drawApps(r[0], r[1].data); })
      .catch(function (e) { mount([el('div', { class: 'notice err', text: kkT('Konnte nicht geladen werden: {m}', { m: e.message }) }), el('button', { class: 'btn small', onclick: pageApps, text: 'Erneut versuchen' })]); });
  }

  function drawApps(status, apps) {
    var nodes = [el('h1', { text: 'Meine Apps' })];
    if (!status.two_factor) nodes.push(el('div', { class: 'notice warn' }, [
      document.createTextNode('Zum Erstellen und Ändern von Apps muss die Zwei-Faktor-Authentifizierung aktiviert sein. Aktiviere sie in Karteikasten unter Einstellungen → Konto. '),
      el('a', { href: CONFIG.MAIN_APP, text: 'Karteikasten öffnen' })]));
    nodes.push(el('div', { class: 'btns' }, [el('button', { class: 'btn primary', disabled: !status.two_factor || apps.length >= status.max_apps, onclick: function () { form(null, status); }, text: '+ Neue App' })]));
    if (!apps.length) nodes.push(el('section', { class: 'card center' }, [el('p', { class: 'muted', text: 'Du hast noch keine Apps.' })]));
    apps.forEach(function (a) {
      var lu = httpsUrl(a.logo_url);
      nodes.push(el('section', { class: 'card' }, [
        el('div', { class: 'approw' }, [lu ? el('img', { class: 'logo', src: lu, alt: '' }) : el('div', { class: 'logo', text: a.name[0].toUpperCase() }),
          el('div', { class: 'grow' }, [el('h2', { text: a.name }), el('span', { class: 'tag', text: a.client_type === 'public' ? 'öffentlich (PKCE)' : 'vertraulich' }), a.status !== 'active' ? el('span', { class: 'tag', text: ' gesperrt' }) : null]),
          el('button', { class: 'btn small', onclick: function () { form(a, status); }, text: 'Bearbeiten' })]),
        el('p', { class: 'kv' }, [document.createTextNode('Client-ID: '), code(a.client_id || '–')]),
        el('p', { class: 'kv' }, [document.createTextNode('Berechtigungen: '), document.createTextNode(a.scopes.join(', '))]),
        el('p', { class: 'kv' }, [document.createTextNode('Weiterleitung: '), document.createTextNode(a.redirect_uris.join(', '))])]));
    });
    mount(nodes);
  }

  function form(app, status) {
    var edit = !!app; app = app || { scopes: ['profile.read'], redirect_uris: [], client_type: 'public' };
    var f = {
      name: el('input', { type: 'text', id: 'f_name', maxlength: 60, value: app.name || '', required: true }),
      description: el('textarea', { id: 'f_desc', maxlength: 300, text: app.description || '' }),
      dev: el('input', { type: 'text', id: 'f_dev', maxlength: 80, value: app.developer_name || '' }),
      site: el('input', { type: 'url', id: 'f_site', value: app.website_url || '', placeholder: 'https://', required: true }),
      priv: el('input', { type: 'url', id: 'f_priv', value: app.privacy_url || '', placeholder: 'https://' }),
      terms: el('input', { type: 'url', id: 'f_terms', value: app.terms_url || '', placeholder: 'https://' }),
      redir: el('textarea', { id: 'f_redir', text: (app.redirect_uris || []).join('\n'), placeholder: 'https://deine-app.example/callback', required: true }),
      logo: el('input', { type: 'file', id: 'f_logo', accept: 'image/png,image/jpeg,image/webp' })
    };
    var scopeBoxes = Object.keys(SCOPES).map(function (k) { return el('input', { type: 'checkbox', id: 'sc_' + k, value: k, checked: app.scopes.indexOf(k) >= 0 }); });
    var typeSel = el('select', { id: 'f_type', disabled: edit }, [el('option', { value: 'public', text: 'Öffentlich – Browser/Mobile-App (PKCE, kein Secret)' }), el('option', { value: 'confidential', text: 'Vertraulich – eigener Server (mit Secret)' })]);
    typeSel.value = app.client_type;
    var preview = el('div', { class: 'preview', 'aria-label': 'Vorschau der Zustimmungsseite' });
    var logoData = null;

    function drawPreview() {
      preview.textContent = '';
      var lu = logoData ? logoData.url : httpsUrl(app.logo_url), nm = f.name.value || 'Deine App';
      var chosen = scopeBoxes.filter(function (b) { return b.checked; });
      preview.appendChild(el('p', { class: 'hand muted center', text: 'Vorschau Zustimmungsseite' }));
      preview.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'pair' }, [lu ? el('img', { class: 'logo', src: lu, alt: '' }) : el('div', { class: 'logo', text: nm[0].toUpperCase() }), el('span', { class: 'arrow', text: '→' }), el('img', { class: 'logo', src: 'icon-192.png', alt: '' })]),
        el('h2', { class: 'center', text: kkT('{name} möchte auf dein Karteikasten-Konto zugreifen', { name: nm }) }),
        f.description.value ? el('p', { class: 'center muted small', text: f.description.value }) : null,
        el('div', { class: 'header-rule' }),
        el('ul', { class: 'scopes' }, chosen.map(function (b) { return el('li', null, [el('input', { type: 'checkbox', checked: true, disabled: true }), el('label', null, [el('b', { text: SCOPES[b.value][0] }), el('span', { class: 'd', text: SCOPES[b.value][1] })])]); })),
        el('div', { class: 'notice warn', text: 'Diese App wurde nicht von Karteikasten geprüft.' }),
        el('div', { class: 'btns' }, [el('span', { class: 'btn', text: 'Ablehnen' }), el('span', { class: 'btn primary', text: 'Erlauben' })])]));
      kkTranslateTree(preview);
    }
    f.logo.addEventListener('change', function () {
      var file = f.logo.files[0]; if (!file) return;
      if (file.size > 256 * 1024 || !/^image\/(png|jpeg|webp)$/.test(file.type)) { toast('err', 'Logo: PNG, JPG oder WebP bis 256 KB.'); f.logo.value = ''; return; }
      var rd = new FileReader(); rd.onload = function () { logoData = { url: rd.result, b64: String(rd.result).split(',')[1] }; drawPreview(); }; rd.readAsDataURL(file);
    });
    [f.name, f.description].forEach(function (i) { i.addEventListener('input', drawPreview); });
    scopeBoxes.forEach(function (b) { b.addEventListener('change', drawPreview); });

    var secretBox = el('div'), done = false;
    var saveBtn = el('button', { class: 'btn primary', type: 'submit', text: edit ? 'Speichern' : 'App erstellen' });
    var fm = el('form', { novalidate: true, onsubmit: function (ev) {
      ev.preventDefault(); if (done) { pageApps(); return; } saveBtn.disabled = true;
      var body = { name: f.name.value.trim(), description: f.description.value.trim(), developer_name: f.dev.value.trim(), website_url: f.site.value.trim(), privacy_url: f.priv.value.trim(), terms_url: f.terms.value.trim(),
        redirect_uris: f.redir.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean), scopes: scopeBoxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }), client_type: typeSel.value };
      call(APPS_API, edit ? '/apps/' + app.id : '/apps', { method: edit ? 'PATCH' : 'POST', body: body }).then(function (res) {
        var id = edit ? app.id : res.id;
        return (logoData ? call(APPS_API, '/apps/' + id + '/logo', { method: 'POST', body: { data: logoData.b64 } }) : Promise.resolve()).then(function () { return res; });
      }).then(function (res) {
        if (res && res.client_secret) { secretBox.textContent = ''; secretBox.appendChild(el('div', { class: 'notice warn' }, [el('b', { text: 'Client-Secret (wird nur jetzt angezeigt): ' }), code(res.client_secret)])); saveBtn.disabled = false; saveBtn.textContent = 'Fertig'; done = true; }
        else { pageApps(); }
      }).catch(function (e) { saveBtn.disabled = false; toast('err', e.message); });
    } }, [
      field('Name der App', f.name, 'f_name', 'Darf „Karteikasten“ nicht enthalten.'), field('Kurzbeschreibung', f.description, 'f_desc'), field('Entwickler / Organisation', f.dev, 'f_dev'),
      field('Webseite', f.site, 'f_site'), field('Datenschutzerklärung (URL)', f.priv, 'f_priv'), field('Nutzungsbedingungen (URL)', f.terms, 'f_terms'),
      field('Logo (PNG/JPG/WebP, max. 256 KB, quadratisch)', f.logo, 'f_logo'),
      field('Weiterleitungs-URIs (eine pro Zeile)', f.redir, 'f_redir', 'https, exakte Übereinstimmung, keine Wildcards. http nur für localhost.'),
      field('App-Typ', typeSel, 'f_type', edit ? 'Der Typ lässt sich nachträglich nicht ändern.' : null),
      el('fieldset', { class: 'card' }, [el('legend', { class: 'hand', text: 'Berechtigungen' })].concat(Object.keys(SCOPES).map(function (k, i) {
        return el('div', { class: 'chk' }, [scopeBoxes[i], el('label', { for: 'sc_' + k }, [el('b', { text: SCOPES[k][0] }), document.createTextNode(' – '), el('span', { text: SCOPES[k][1] })])]); }))),
      secretBox,
      el('div', { class: 'btns' }, [saveBtn, el('button', { class: 'btn', type: 'button', onclick: pageApps, text: 'Abbrechen' })])
    ]);
    var extra = [];
    if (edit && app.client_type === 'confidential') extra.push(el('button', { class: 'btn small', type: 'button', onclick: function () { if (!confirm(kkT('Neues Secret erzeugen? Das alte wird ungültig.'))) return; call(APPS_API, '/apps/' + app.id + '/secret', { method: 'POST' }).then(function (r) { secretBox.textContent = ''; secretBox.appendChild(el('div', { class: 'notice warn' }, [el('b', { text: 'Neues Secret: ' }), code(r.client_secret)])); }).catch(function (e) { toast('err', e.message); }); }, text: 'Secret erneuern' }));
    if (edit) extra.push(el('button', { class: 'btn small danger', type: 'button', onclick: function () { if (!confirm(kkT('App „{n}“ endgültig löschen? Alle Nutzerzugriffe enden.', { n: app.name }))) return; call(APPS_API, '/apps/' + app.id, { method: 'DELETE' }).then(pageApps).catch(function (e) { toast('err', e.message); }); }, text: 'App löschen' }));
    drawPreview();
    mount([el('h1', { text: edit ? 'App bearbeiten' : 'Neue App' }), el('div', { class: 'two' }, [el('div', { class: 'card' }, [fm, el('div', { class: 'btns' }, extra)]), el('div', { class: 'sticky' }, [preview])])]);
  }
  function field(label, input, id, hint) { return el('div', null, [el('label', { class: 'f', for: id, text: label }), input, hint ? el('p', { class: 'hint', text: hint }) : null]); }

  /* ---------- Routing ---------- */
  function route() {
    var r = (location.hash || '#/').replace(/^#\/?/, '').split('/')[0] || 'home';
    markNav(r === 'docs' || r === 'apps' || r === 'test' ? r : 'home'); renderUser();
    document.title = kkT(r === 'docs' ? 'Dokumentation – Karteikasten Developer' : r === 'apps' ? 'Meine Apps – Karteikasten Developer' : r === 'test' ? 'Test-App – Karteikasten Developer' : 'Karteikasten Developer');
    if (r === 'docs') pageDocs(); else if (r === 'apps') pageApps(); else if (r === 'test') pageTest(); else pageHome();
  }
  document.querySelector('.top .in').appendChild(kkLangSelect());
  window.addEventListener('hashchange', route);
  handleCallback().then(route);
})();

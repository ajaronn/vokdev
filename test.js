/* Karteikasten Developer – Test-App.
   Simuliert eine Dritt-App (öffentlicher Client, OAuth 2.0 Authorization Code + PKCE) und testet die REST-API.
   Läuft komplett im Browser, es werden keine Daten an Dritte gesendet. */
(function () {
  'use strict';
  var SB = 'https://qujcvvxdvpqnsfgvleid.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1amN2dnhkdnBxbnNmZ3ZsZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODQ3OTcsImV4cCI6MjEwNTY2MDc5N30.aNsVqELIJTSDIuJOEj6CL_ii2NL6JUBjZRDb3ZtcTWY';
  var API = SB + '/functions/v1/dev-api/v1';
  var REDIR = location.origin + location.pathname;
  var KEY = 'ajaronn_test_app';
  var $ = function (i) { return document.getElementById(i); };

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } return null; }
  function b64(buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function rnd(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return b64(a); }
  function msg(text, kind) { var m = $('msg'); m.textContent = text ? kkT(text) : ''; m.className = 'notice ' + (kind || 'err') + (text ? '' : ' hidden'); if (text && m.scrollIntoView) m.scrollIntoView({ block: 'center' }); }
  function show(x) { $('res').firstChild.textContent = typeof x === 'string' ? x : JSON.stringify(x, null, 2); }
  function pretty(t) { try { return JSON.stringify(JSON.parse(t), null, 2); } catch (e) { return t; } }

  var jf = $('jsfail'); if (jf) jf.parentNode.removeChild(jf);
  $('redir').textContent = REDIR;
  $('langbox').appendChild(kkLangSelect());

  var q = new URLSearchParams(location.search);
  var pre = q.get('client_id');
  $('cid').value = (pre && /^[A-Za-z0-9_-]{8,80}$/.test(pre)) ? pre : (ls(KEY + '_cid') || '');

  function token() { return ls(KEY + '_tok'); }
  function refreshState() {
    var t = token(), st = $('state');
    $('api').classList.toggle('hidden', !t);
    $('out').classList.toggle('hidden', !t);
    st.classList.toggle('hidden', !t);
    if (t) st.textContent = kkT('Angemeldet – Access-Token gespeichert (nur in diesem Browser).');
  }

  $('login').onclick = function () {
    var cid = $('cid').value.trim();
    if (!cid) { msg('Bitte zuerst die client_id eintragen.'); $('cid').focus(); return; }
    ls(KEY + '_cid', cid);
    var v = rnd(48), st = rnd(16);
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function (h) {
      try { sessionStorage.setItem(KEY, JSON.stringify({ v: v, s: st })); } catch (e) { }
      location.assign(SB + '/auth/v1/oauth/authorize?' + new URLSearchParams({ response_type: 'code', client_id: cid, redirect_uri: REDIR, scope: 'email profile', state: st, code_challenge: b64(h), code_challenge_method: 'S256' }));
    });
  };
  $('out').onclick = function () { ls(KEY + '_tok', null); show('–'); msg(''); refreshState(); };

  function call(method, path, body) {
    show(kkT('Lädt …'));
    var o = { method: method, headers: { authorization: 'Bearer ' + token() } };
    if (body) { o.headers['content-type'] = 'application/json'; o.body = body; }
    return fetch(API + path, o).then(function (r) { return r.text().then(function (t) { show(r.status + ' ' + r.statusText + '\n\n' + (t ? pretty(t) : '(leer)')); }); })
      .catch(function (e) { show(kkT('Netzwerkfehler: {m}', { m: e.message })); });
  }
  document.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { call(b.dataset.m, b.dataset.p); }; });
  $('mk').onclick = function () { call('POST', '/lists', JSON.stringify({ name: 'API-Testliste' })); };
  $('rsend').onclick = function () {
    var p = $('rpath').value.trim(); if (p.charAt(0) !== '/') p = '/' + p;
    var b = $('rbody').value.trim();
    if (b) { try { JSON.parse(b); } catch (e) { show(kkT('Der JSON-Body ist ungültig.')); return; } }
    call($('rmeth').value, p, b || null);
  };

  function callback() {
    if (!q.has('code') && !q.has('error')) return;
    var s = {}; try { s = JSON.parse(sessionStorage.getItem(KEY) || '{}'); sessionStorage.removeItem(KEY); } catch (e) { }
    history.replaceState(null, '', REDIR);
    if (q.get('error')) { msg(q.get('error') === 'access_denied' ? 'Abgelehnt: Der Zugriff wurde nicht erlaubt.' : kkT('Fehler: {m}', { m: q.get('error_description') || q.get('error') })); return; }
    if (!s.s || s.s !== q.get('state')) { msg('Ungültiger Anmeldestatus (state). Bitte erneut anmelden.'); return; }
    fetch(SB + '/auth/v1/oauth/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', apikey: ANON },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: q.get('code'), redirect_uri: REDIR, client_id: ls(KEY + '_cid') || '', code_verifier: s.v }).toString() })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.access_token) { ls(KEY + '_tok', j.access_token); msg('Anmeldung erfolgreich.', 'ok'); refreshState(); } else msg(kkT('Fehler: {m}', { m: j.error_description || j.error || JSON.stringify(j) })); })
      .catch(function (e) { msg(kkT('Netzwerkfehler: {m}', { m: e.message })); });
  }
  callback();
  refreshState();
  kkTranslateTree(document.body);
})();

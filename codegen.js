/* Karteikasten Developer – Code-Generator und Starter-Vorlage (läuft komplett im Browser). */
(function () {
  'use strict';
  var SB = 'https://qujcvvxdvpqnsfgvleid.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1amN2dnhkdnBxbnNmZ3ZsZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODQ3OTcsImV4cCI6MjEwNTY2MDc5N30.aNsVqELIJTSDIuJOEj6CL_ii2NL6JUBjZRDb3ZtcTWY';
  var LOGO_URL = 'https://ajaronn.github.io/vokdev/icon-192.png';

  var T = {};
  T.js = String.raw`// Mit Karteikasten fortfahren – OAuth 2.0 + PKCE, läuft im Browser
const CLIENT_ID = '__CID__';
const REDIRECT_URI = '__REDIR__';
const SB = '__SB__';
const ANON_KEY = '__ANON__';

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const random = (n) => b64url(crypto.getRandomValues(new Uint8Array(n)));

// 1) Beim Klick auf den Login-Button aufrufen
async function login() {
  const verifier = random(48), state = random(16);
  const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  sessionStorage.setItem('kk_pkce', JSON.stringify({ verifier, state }));
  location.assign(SB + '/auth/v1/oauth/authorize?' + new URLSearchParams({
    response_type: 'code', client_id: CLIENT_ID, redirect_uri: REDIRECT_URI,
    scope: 'email profile', state, code_challenge: challenge, code_challenge_method: 'S256'
  }));
}

// 2) Beim Laden der Weiterleitungs-Seite aufrufen: liefert das Access-Token oder null
async function handleCallback() {
  const q = new URLSearchParams(location.search);
  if (!q.has('code')) return null;
  const saved = JSON.parse(sessionStorage.getItem('kk_pkce') || '{}');
  sessionStorage.removeItem('kk_pkce');
  history.replaceState(null, '', REDIRECT_URI);
  if (!saved.state || saved.state !== q.get('state')) throw new Error('state stimmt nicht');
  const r = await fetch(SB + '/auth/v1/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', apikey: ANON_KEY },
    body: new URLSearchParams({
      grant_type: 'authorization_code', code: q.get('code'), redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID, code_verifier: saved.verifier
    })
  });
  const tokens = await r.json();
  if (!tokens.access_token) throw new Error(tokens.error_description || tokens.error);
  return tokens.access_token;   // tokens.refresh_token zum Erneuern aufbewahren
}

// 3) API aufrufen
async function api(path, token, options = {}) {
  const r = await fetch(SB + '/functions/v1/dev-api/v1' + path, {
    ...options,
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }
  });
  return r.json();
}

// Beispiel:
// const token = await handleCallback();
// if (token) console.log(await api('/lists', token));`;

  T.py = String.raw`# Mit Karteikasten fortfahren – OAuth 2.0 + PKCE in Python (pip install requests)
import base64, hashlib, secrets, urllib.parse
import requests

CLIENT_ID = '__CID__'
CLIENT_SECRET = '__SECRET__'   # nur bei vertraulichen Apps, niemals im Browser oder in Git
REDIRECT_URI = '__REDIR__'
SB = '__SB__'
ANON_KEY = '__ANON__'

def start_login():
    """Gibt (url, verifier, state) zurück. verifier und state in der Sitzung speichern, Nutzer auf url leiten."""
    verifier = secrets.token_urlsafe(48)
    state = secrets.token_urlsafe(16)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()
    url = SB + '/auth/v1/oauth/authorize?' + urllib.parse.urlencode({
        'response_type': 'code', 'client_id': CLIENT_ID, 'redirect_uri': REDIRECT_URI,
        'scope': 'email profile', 'state': state,
        'code_challenge': challenge, 'code_challenge_method': 'S256',
    })
    return url, verifier, state

def exchange_code(code, verifier):
    """Tauscht den code von der Weiterleitung gegen Tokens. Vorher state vergleichen!"""
    r = requests.post(
        SB + '/auth/v1/oauth/token',
        headers={'apikey': ANON_KEY},
        data={'grant_type': 'authorization_code', 'code': code, 'redirect_uri': REDIRECT_URI,
              'client_id': CLIENT_ID, 'code_verifier': verifier},
        __AUTH__
    )
    r.raise_for_status()
    return r.json()   # access_token, refresh_token, expires_in

def api(path, token, method='GET', json=None):
    r = requests.request(method, SB + '/functions/v1/dev-api/v1' + path, json=json,
                         headers={'Authorization': 'Bearer ' + token})
    return r.json() if r.content else None

# Beispiel:
# url, verifier, state = start_login()
# ... Nutzer zu url schicken, auf REDIRECT_URI kommt ?code=...&state=...
# tokens = exchange_code(code, verifier)
# print(api('/lists', tokens['access_token']))`;

  T.php = String.raw`<?php
// Mit Karteikasten fortfahren – OAuth 2.0 + PKCE in PHP (mit cURL-Erweiterung)
session_start();
const CLIENT_ID = '__CID__';
const CLIENT_SECRET = '__SECRET__';   // nur bei vertraulichen Apps, niemals öffentlich ablegen
const REDIRECT_URI = '__REDIR__';
const SB = '__SB__';
const ANON_KEY = '__ANON__';

function b64url($bin) { return rtrim(strtr(base64_encode($bin), '+/', '-_'), '='); }

// 1) Nutzer zum Login schicken
function start_login() {
    $verifier = b64url(random_bytes(48));
    $state = b64url(random_bytes(16));
    $_SESSION['kk_verifier'] = $verifier;
    $_SESSION['kk_state'] = $state;
    $query = http_build_query([
        'response_type' => 'code', 'client_id' => CLIENT_ID, 'redirect_uri' => REDIRECT_URI,
        'scope' => 'email profile', 'state' => $state,
        'code_challenge' => b64url(hash('sha256', $verifier, true)), 'code_challenge_method' => 'S256',
    ]);
    header('Location: ' . SB . '/auth/v1/oauth/authorize?' . $query);
    exit;
}

// 2) Auf der Weiterleitungs-Seite: code gegen Tokens tauschen
function exchange_code($code, $state) {
    if (!hash_equals($_SESSION['kk_state'] ?? '', $state)) { throw new Exception('state stimmt nicht'); }
    $ch = curl_init(SB . '/auth/v1/oauth/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['apikey: ' . ANON_KEY],
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'authorization_code', 'code' => $code, 'redirect_uri' => REDIRECT_URI,
            'client_id' => CLIENT_ID, 'code_verifier' => $_SESSION['kk_verifier'],
        ]),__AUTH__
    ]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $res;   // access_token, refresh_token, expires_in
}

// 3) API aufrufen
function api($path, $token, $method = 'GET', $body = null) {
    $ch = curl_init(SB . '/functions/v1/dev-api/v1' . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $body ? json_encode($body) : null,
    ]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $res;
}

// Beispiel (auf der Weiterleitungs-Seite):
// $tokens = exchange_code($_GET['code'], $_GET['state']);
// print_r(api('/lists', $tokens['access_token']));`;

  T.curl = String.raw`# Mit Karteikasten fortfahren – OAuth 2.0 + PKCE mit der Kommandozeile (bash, openssl, curl)

# 1) Verifier und Challenge erzeugen
VERIFIER=$(openssl rand -base64 48 | tr '+/' '-_' | tr -d '=\n')
CHALLENGE=$(printf '%s' "$VERIFIER" | openssl dgst -sha256 -binary | openssl base64 | tr '+/' '-_' | tr -d '=\n')

# 2) Diese URL im Browser öffnen, anmelden und zustimmen
echo "__SB__/auth/v1/oauth/authorize?response_type=code&client_id=__CID__&redirect_uri=__REDIRENC__&scope=email%20profile&state=abc123&code_challenge=$CHALLENGE&code_challenge_method=S256"

# 3) Aus der Adresszeile nach der Weiterleitung den Wert hinter ?code= kopieren
CODE=HIER_DEN_CODE_EINTRAGEN

# 4) Code gegen Tokens tauschen
curl -s -X POST "__SB__/auth/v1/oauth/token" \
  -H "apikey: __ANON__" __AUTH__
  -d grant_type=authorization_code \
  -d code="$CODE" \
  -d redirect_uri="__REDIR__" \
  -d client_id="__CID__" \
  -d code_verifier="$VERIFIER"

# 5) API aufrufen (access_token aus Schritt 4 einsetzen)
TOKEN=HIER_DAS_ACCESS_TOKEN_EINTRAGEN
curl -s "__SB__/functions/v1/dev-api/v1/lists" -H "Authorization: Bearer $TOKEN"`;

  T.html = String.raw`<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meine Karteikasten-App</title>
<style>
  body{font-family:Georgia,serif;max-width:640px;margin:40px auto;padding:0 16px;line-height:1.5}
  .kk-login{display:inline-flex;align-items:center;gap:10px;font:inherit;font-weight:700;font-size:17px;padding:10px 18px;border-radius:6px;border:2px solid #A8442E;background:#A8442E;color:#FBF6EA;cursor:pointer}
  .kk-login img{width:22px;height:22px;border-radius:22%}
  pre{background:#241A10;color:#F0E5C8;padding:14px;border-radius:6px;overflow:auto}
</style>
</head>
<body>
<h1>Meine Karteikasten-App</h1>
<p id="info">Nicht angemeldet.</p>
<button class="kk-login" id="login" type="button"><img src="__LOGO__" alt=""><span>Mit Karteikasten fortfahren</span></button>
<h2>Meine Listen</h2>
<pre id="out">–</pre>
<script>
__JS__

document.getElementById('login').onclick = login;
(async () => {
  try {
    let token = await handleCallback();
    if (token) sessionStorage.setItem('kk_token', token); else token = sessionStorage.getItem('kk_token');
    if (!token) return;
    document.getElementById('info').textContent = 'Angemeldet.';
    document.getElementById('out').textContent = JSON.stringify(await api('/lists', token), null, 2);
  } catch (e) { document.getElementById('out').textContent = 'Fehler: ' + e.message; }
})();
</script>
</body>
</html>
`;

  function enc(s) { return encodeURIComponent(s); }
  window.kkGenCode = function (lang, o) {
    var conf = o.type === 'confidential';
    var t = T[lang], auth = '';
    if (lang === 'py') auth = conf ? "auth=(CLIENT_ID, CLIENT_SECRET)," : '';
    if (lang === 'php') auth = conf ? '\n        CURLOPT_USERPWD => CLIENT_ID . \':\' . CLIENT_SECRET,' : '';
    if (lang === 'curl') auth = conf ? '-u "__CID__:DEIN_CLIENT_SECRET" \\' : '\\';
    var out = t.split('__AUTH__').join(auth);
    if (lang === 'py' && !conf) out = out.replace(/\n        \n    \)/, '\n    )').replace('        \n', '');
    if (!conf) out = out.replace(/^CLIENT_SECRET = .*\n/m, '').replace(/^const CLIENT_SECRET = .*\n/m, '');
    return out.split('__CID__').join(o.clientId || 'DEINE_CLIENT_ID').split('__SECRET__').join('DEIN_CLIENT_SECRET')
      .split('__REDIRENC__').join(enc(o.redirect)).split('__REDIR__').join(o.redirect)
      .split('__SB__').join(SB).split('__ANON__').join(ANON);
  };
  window.kkStarterHtml = function (o, logo) {
    var js = window.kkGenCode('js', { clientId: o.clientId, redirect: o.redirect, type: 'public' });
    return T.html.split('__JS__').join(js).split('__LOGO__').join(logo || LOGO_URL);
  };
  window.kkButtonSnippet = function () {
    return '<style>\n.kk-login{display:inline-flex;align-items:center;gap:10px;font:inherit;font-weight:700;font-size:17px;\n  padding:10px 18px;border-radius:6px;border:2px solid #A8442E;background:#A8442E;color:#FBF6EA;cursor:pointer}\n.kk-login img{width:22px;height:22px;border-radius:22%}\n</style>\n<button class="kk-login" type="button" onclick="login()">\n  <img src="' + LOGO_URL + '" alt="">\n  <span>Mit Karteikasten fortfahren</span>\n</button>';
  };
})();

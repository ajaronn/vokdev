/* Karteikasten Developer – Zusatzseiten: FAQ, API-Konsole, Scope-Rechner (mit Zustimmungs-Vorschau), App-Statistik.
   Wird von app.js über window.kkDev (Helfer) und window.kkExtras (diese Seiten) eingebunden. */
(function () {
  'use strict';
  function D() { return window.kkDev; }
  function el(t, a, k) { return D().el(t, a, k); }
  function T(s, v) { return window.kkT ? kkT(s, v) : s; }
  function pre(t, cls) { var p = D().pre(t); if (cls) p.className = cls; return p; }

  /* kleine Zusatz-Styles (nutzt die vorhandenen CSS-Variablen) */
  var css = document.createElement('style');
  css.textContent =
    'details.faq{border:1.5px solid var(--border);border-radius:var(--radius);background:var(--bg);margin:0 0 10px;padding:0 14px}' +
    'details.faq summary{cursor:pointer;font-weight:700;padding:12px 0}details.faq[open] summary{border-bottom:1px solid var(--border);margin-bottom:10px}' +
    '.row2{display:grid;grid-template-columns:140px 1fr;gap:10px}@media(max-width:560px){.row2{grid-template-columns:1fr}}' +
    '.bars{display:flex;align-items:flex-end;gap:3px;height:140px;margin:10px 0 4px;border-bottom:1.5px solid var(--border)}' +
    '.bars .b{flex:1;background:var(--rust);min-height:2px;border-radius:3px 3px 0 0;position:relative}' +
    '.bars .b i{position:absolute;left:0;right:0;bottom:0;background:var(--err);border-radius:3px 3px 0 0;display:block}' +
    '.stat{display:inline-block;margin:0 22px 8px 0}.stat b{display:block;font-family:var(--hand);font-size:34px;line-height:1}';
  document.head.appendChild(css);

  /* ---------- FAQ ---------- */
  var FAQ = [
    ['„redirect_uri passt nicht“ / invalid redirect_uri',
      'Die Weiterleitungs-URI muss Zeichen für Zeichen mit der unter „Meine Apps“ eingetragenen übereinstimmen: Schema (https), Host, Pfad und ein abschließender Schrägstrich zählen mit. Typische Fehler: http statt https, fehlendes oder zusätzliches „/“ am Ende, andere Groß-/Kleinschreibung. Trage die URI exakt so ein, wie deine App sie beim Autorisieren sendet.'],
    ['„PKCE fehlt“ / code_challenge fehlt',
      'PKCE ist Pflicht. Die Autorisierungs-Anfrage braucht code_challenge und code_challenge_method=S256, und die Token-Anfrage das passende code_verifier. Das Verifier-Geheimnis erzeugst du pro Anmeldung neu (43–128 Zeichen) und merkst es bis zur Token-Anfrage. Beispielcode findest du im Code-Generator.'],
    ['403 – fehlende Berechtigung oder Zugriff widerrufen',
      'Ein 403 heißt: Dein Token hat den nötigen Scope nicht, oder der Nutzer hat den Zugriff unter „Verbundene Apps“ widerrufen bzw. einzelne Berechtigungen abgewählt. Behandle 403 nie als Netzwerkfehler. Zeige eine Meldung, bitte den Nutzer, sich neu anzumelden, und fordere nur Scopes an, die du wirklich brauchst.'],
    ['Refresh-Token abgelaufen oder ungültig',
      'Refresh-Tokens werden bei Widerruf ungültig. Auch ein bereits benutztes Refresh-Token kann abgelehnt werden, wenn der Server sie rotiert. Speichere immer das neue Refresh-Token aus der Antwort. Schlägt der Refresh fehl, leite den Nutzer zur erneuten Anmeldung.'],
    ['401 – Token ungültig',
      'Das Access-Token ist abgelaufen, falsch kopiert oder gehört zu einer anderen App. Hole mit dem Refresh-Token ein neues. Prüfe, dass der Header genau „Authorization: Bearer TOKEN“ lautet (ohne Anführungszeichen).'],
    ['429 – zu viele Anfragen',
      'Es gilt ein Limit von 120 Anfragen pro Minute je Nutzer und App. Warte bei 429 und versuche es mit wachsenden Pausen (Backoff) erneut. Fasse viele Vokabeln in einer POST-Anfrage zusammen (bis 500 pro Aufruf).'],
    ['409 – gleichzeitige Änderung',
      'Jemand (z. B. der Nutzer in der Karteikasten-App) hat dieselbe Sache gleichzeitig geändert. Lade die Daten neu und wende deine Änderung noch einmal an.'],
    ['Meine Änderungen erscheinen nicht in der Karteikasten-App',
      'Änderungen über die API sind erst nach dem nächsten Laden bzw. Synchronisieren in der App sichtbar. Lade die App neu.'],
    ['Die Anmeldung öffnet sich, aber „Zustimmen“ fehlt oder die Seite ist leer',
      'Prüfe, ob client_id stimmt und die App den Status „aktiv“ hat. Erscheint die Seite in einem Frame, wird sie aus Sicherheitsgründen blockiert. Öffne die Anmeldung immer als normale Seite oder Popup, nie in einem iframe.'],
    ['Warum kann ich keine App anlegen?',
      'Zum Erstellen und Ändern von Apps muss die Zwei-Faktor-Authentifizierung aktiviert sein (Karteikasten → Einstellungen → Konto). Außerdem gibt es eine Obergrenze für die Zahl deiner Apps.']
  ];
  function pageFaq() {
    D().mount([el('h1', { text: 'FAQ & Troubleshooting' }),
      el('section', { class: 'card' }, [el('p', { class: 'muted', text: 'Die häufigsten Probleme bei Anmeldung und API – mit Lösung.' })].concat(
        FAQ.map(function (q) { return el('details', { class: 'faq' }, [el('summary', { text: q[0] }), el('p', { text: q[1] })]); }))),
      el('section', { class: 'card' }, [el('p', { text: 'Nichts gefunden?' }), el('div', { class: 'btns' }, [el('a', { class: 'btn', href: '#/support', text: 'Zum Support' }), el('a', { class: 'btn', href: '#/console', text: 'In der API-Konsole testen' })])])]);
  }

  /* ---------- API-Konsole ---------- */
  var EPS = [
    ['GET', '/me', ''], ['GET', '/lists', ''],
    ['POST', '/lists', '{"name":"Spanisch","lang_a":"de","lang_b":"es"}'],
    ['GET', '/lists/{id}', ''], ['PATCH', '/lists/{id}', '{"name":"Neuer Name"}'], ['DELETE', '/lists/{id}', ''],
    ['GET', '/lists/{id}/vocab?limit=50&offset=0', ''],
    ['POST', '/lists/{id}/vocab', '{"a":"Haus","b":"casa","comment":""}'],
    ['PATCH', '/lists/{id}/vocab/{vocabId}', '{"comment":"Notiz"}'],
    ['GET', '/progress', ''], ['GET', '/lists/{id}/progress', '']
  ];
  function pageConsole() {
    var saved = ''; try { saved = localStorage.getItem('ajaronn_test_app_tok') || ''; } catch (e) { }
    var sel = el('select', { id: 'c_ep' }, EPS.map(function (e, i) { return el('option', { value: i, text: e[0] + ' ' + e[1] }); }));
    var method = el('select', { id: 'c_m' }, ['GET', 'POST', 'PATCH', 'DELETE'].map(function (m) { return el('option', { value: m, text: m }); }));
    var path = el('input', { type: 'text', id: 'c_p', value: '/me', autocomplete: 'off' });
    var body = el('textarea', { id: 'c_b', spellcheck: 'false' });
    var tok = el('input', { type: 'password', id: 'c_t', value: saved, autocomplete: 'off', placeholder: 'Access-Token' });
    var status = el('p', { class: 'small muted', 'aria-live': 'polite' });
    var out = pre('', 'out'), curl = pre('');
    function fill() { var e = EPS[sel.value]; method.value = e[0]; path.value = e[1]; body.value = e[2]; mkCurl(); }
    function mkCurl() {
      var c = 'curl -X ' + method.value + ' "' + D().API_BASE + path.value + '" \\\n  -H "Authorization: Bearer ACCESS_TOKEN"';
      if (method.value !== 'GET' && method.value !== 'DELETE' && body.value.trim()) c += ' \\\n  -H "Content-Type: application/json" \\\n  -d \'' + body.value.trim().replace(/'/g, "'\\''") + '\'';
      curl.firstChild.textContent = c;
    }
    [method, path, body].forEach(function (n) { n.addEventListener('input', mkCurl); });
    sel.addEventListener('change', fill);
    var send = el('button', { class: 'btn primary', type: 'button', text: 'Anfrage senden', onclick: function () {
      var t = tok.value.trim(); if (!t) { status.textContent = T('Bitte zuerst ein Access-Token eintragen.'); return; }
      if (/\{\w+\}/.test(path.value)) { status.textContent = T('Ersetze die Platzhalter in {…} durch echte IDs.'); return; }
      if (method.value === 'DELETE' && !confirm(T('Wirklich löschen? Das lässt sich nicht rückgängig machen.'))) return;
      var o = { method: method.value, headers: { authorization: 'Bearer ' + t } };
      if (method.value === 'POST' || method.value === 'PATCH') { o.headers['content-type'] = 'application/json'; o.body = body.value; }
      var t0 = performance.now(); status.textContent = '…'; out.firstChild.textContent = '';
      fetch(D().API_BASE + path.value, o).then(function (r) {
        return r.text().then(function (txt) {
          var pretty = txt; try { pretty = JSON.stringify(JSON.parse(txt), null, 2); } catch (e) { }
          status.textContent = r.status + ' ' + r.statusText + ' · ' + Math.round(performance.now() - t0) + ' ms';
          out.firstChild.textContent = pretty || T('(leere Antwort)');
        });
      }).catch(function (e) { status.textContent = T('Netzwerkfehler: {m}', { m: e.message }); });
    } });
    function f(l, n, id) { return el('div', null, [el('label', { class: 'f', for: id, text: l }), n]); }
    D().mount([el('h1', { text: 'API-Konsole' }),
      el('section', { class: 'card' }, [
        el('p', { text: 'Sende Anfragen an die Karteikasten-API und sieh sofort die Antwort. Du brauchst ein Access-Token einer App, die der Nutzer freigegeben hat. Am einfachsten erhältst du es mit der Test-App; es wird dann hier automatisch eingetragen.' }),
        el('div', { class: 'btns' }, [el('a', { class: 'btn small', href: '#/test', text: 'Zur Test-App' })]),
        f('Access-Token', tok, 'c_t'), f('Beispiel wählen', sel, 'c_ep'),
        el('div', { class: 'row2' }, [f('Methode', method, 'c_m'), f('Pfad', path, 'c_p')]),
        f('Body (JSON, nur POST/PATCH)', body, 'c_b'),
        el('div', { class: 'btns' }, [send]), status, out]),
      el('section', { class: 'card' }, [el('h2', { text: 'Dasselbe als curl' }), curl])]);
    fill();
  }

  /* ---------- Scope-Rechner + Zustimmungs-Vorschau ---------- */
  var TASKS = [
    ['Name und Benutzername des Nutzers anzeigen', ['profile.read']],
    ['Listen des Nutzers anzeigen', ['lists.read']],
    ['Neue Listen anlegen', ['lists.create', 'lists.read']],
    ['Listen umbenennen / Sprachen ändern', ['lists.update', 'lists.read']],
    ['Listen löschen', ['lists.delete', 'lists.read']],
    ['Vokabeln anzeigen', ['vocab.read', 'lists.read']],
    ['Vokabeln hinzufügen oder ändern', ['vocab.write', 'lists.read']],
    ['Lernfortschritt anzeigen', ['progress.read', 'lists.read']]
  ];
  function pageScopes() {
    var SC = D().SCOPES, order = Object.keys(SC);
    var boxes = TASKS.map(function (t, i) { return el('input', { type: 'checkbox', id: 'sk_' + i }); });
    var appName = el('input', { type: 'text', id: 'sk_name', value: 'Meine App', maxlength: '40' });
    var result = el('div'), consent = el('div');
    function calc() {
      var set = {}; TASKS.forEach(function (t, i) { if (boxes[i].checked) t[1].forEach(function (s) { set[s] = 1; }); });
      var list = order.filter(function (s) { return set[s]; });
      result.textContent = '';
      if (!list.length) { result.appendChild(el('p', { class: 'muted', text: 'Wähle oben, was deine App tun soll.' })); }
      else {
        result.appendChild(el('p', { class: 'small' }, [T('Minimal nötige Berechtigungen:') + ' ', el('code', { text: list.join(' ') })]));
        result.appendChild(el('p', { class: 'small' }, [T('Für die Autorisierungs-URL (scope=…):') + ' ', el('code', { text: list.join('%20') })]));
        if (set['lists.delete']) result.appendChild(el('div', { class: 'notice warn', text: 'Vorsicht: „Listen löschen“ wirkt auf Nutzer bedrohlich und senkt die Zustimmungsrate. Brauchst du das wirklich? Ein Löschen in der Karteikasten-App selbst reicht oft.' }));
        if (list.length > 5) result.appendChild(el('div', { class: 'notice warn', text: 'Das sind viele Berechtigungen. Nutzer können einzelne abwählen, also baue deine App so, dass sie damit umgehen kann.' }));
      }
      consent.textContent = '';
      if (list.length) {
        consent.appendChild(el('p', { class: 'muted small', text: 'So sehen Nutzer die Zustimmungsseite (vereinfachte Vorschau):' }));
        consent.appendChild(el('h3', { text: (appName.value || 'Meine App') + ' ' + T('möchte auf dein Karteikasten-Konto zugreifen') }));
        consent.appendChild(el('ul', { class: 'scopes' }, list.map(function (s) {
          return el('li', { class: s === 'lists.delete' ? 'danger' : '' }, [el('input', { type: 'checkbox', checked: true, 'aria-label': SC[s][0] }), el('label', null, [el('b', { text: SC[s][0] }), el('span', { class: 'd', text: SC[s][1] })])]);
        })));
        consent.appendChild(el('div', { class: 'btns' }, [el('button', { class: 'btn', type: 'button', disabled: true, text: 'Ablehnen' }), el('button', { class: 'btn primary', type: 'button', disabled: true, text: 'Zulassen' })]));
      }
    }
    boxes.forEach(function (b) { b.addEventListener('change', calc); }); appName.addEventListener('input', calc);
    D().mount([el('h1', { text: 'Scope-Rechner' }),
      el('section', { class: 'card' }, [el('p', { text: 'Kreuze an, was deine App können soll. Du bekommst die kleinste passende Liste an Berechtigungen. Fordere nie mehr an als nötig.' }),
        el('ul', { class: 'scopes' }, TASKS.map(function (t, i) { return el('li', null, [boxes[i], el('label', { for: 'sk_' + i, text: t[0] })]); })), result]),
      el('section', { class: 'card' }, [el('h2', { text: 'Zustimmungs-Vorschau' }),
        el('label', { class: 'f', for: 'sk_name', text: 'Name deiner App' }), appName, consent])]);
    calc();
  }

  /* ---------- App-Statistik ---------- */
  function pageStats(id) {
    var back = el('a', { class: 'btn small', href: '#/apps', text: '← Meine Apps' });
    D().mount([el('h1', { text: 'App-Statistik' }), el('div', { class: 'spinner' })]);
    D().call(D().APPS_API, '/apps/' + encodeURIComponent(id) + '/stats').then(function (r) {
      var s = r.data || r, days = s.days || [], max = 1;
      days.forEach(function (d) { if (d.requests > max) max = d.requests; });
      var tot = s.requests_total != null ? s.requests_total : days.reduce(function (a, d) { return a + (d.requests || 0); }, 0);
      var err = s.errors_total != null ? s.errors_total : days.reduce(function (a, d) { return a + (d.errors || 0); }, 0);
      var rate = tot ? (err / tot * 100).toFixed(1).replace('.', window.kkLang === 'en' ? '.' : ',') + ' %' : '–';
      D().mount([el('h1', { text: 'App-Statistik' }), el('div', { class: 'btns' }, [back]),
        el('section', { class: 'card' }, [
          el('span', { class: 'stat' }, [el('b', { text: String(s.users != null ? s.users : '–') }), 'Nutzer']),
          el('span', { class: 'stat' }, [el('b', { text: String(tot) }), 'Anfragen (30 Tage)']),
          el('span', { class: 'stat' }, [el('b', { text: rate }), 'Fehlerquote']),
          days.length ? el('div', { class: 'bars', role: 'img', 'aria-label': T('Anfragen pro Tag') }, days.map(function (d) {
            var b = el('div', { class: 'b', title: d.day + ': ' + d.requests + ' / ' + (d.errors || 0) + ' ' + T('Fehler'), style: 'height:' + Math.max(2, Math.round((d.requests || 0) / max * 100)) + '%' });
            if (d.errors) b.appendChild(el('i', { style: 'height:' + Math.round(d.errors / Math.max(1, d.requests) * 100) + '%' })); return b;
          })) : el('p', { class: 'muted', text: 'Noch keine Anfragen in den letzten 30 Tagen.' }),
          el('p', { class: 'muted small', text: 'Balken = Anfragen pro Tag, roter Anteil = Fehler (Status ab 400).' })])]);
    }).catch(function (e) {
      D().mount([el('h1', { text: 'App-Statistik' }), el('div', { class: 'btns' }, [back]),
        el('div', { class: 'notice warn', text: 'Statistiken sind noch nicht verfügbar (' + e.message + '). Sobald die Server-Seite GET /apps/{id}/stats bereitstellt, erscheinen sie hier automatisch.' })]);
    });
  }

  window.kkExtras = { faq: pageFaq, console: pageConsole, scopes: pageScopes, stats: pageStats };
})();

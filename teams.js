/* Teams, Projekte, Test-Modus, Änderungsverlauf – Seite "#/teams".
   Wird von app.js über window.kkTeams.render(ctx) aufgerufen (siehe ANLEITUNG.md). */
(function () {
  'use strict';
  var ROLES = { owner: 'Besitzer', editor: 'Bearbeiter', viewer: 'Nur ansehen' };
  var TEXT = {
    created: 'hat die App erstellt', field_changed: 'hat ein Feld geändert', redirect_added: 'hat Redirect-URI ergänzt',
    redirect_removed: 'hat Redirect-URI entfernt', scope_added: 'hat Berechtigung ergänzt', scope_removed: 'hat Berechtigung entfernt',
    logo_changed: 'hat das Logo geändert', secret_regenerated: 'hat das Secret erneuert', published: 'hat die App veröffentlicht',
    unpublished: 'hat die App zurück in den Test-Modus gesetzt', test_user_added: 'hat Testnutzer hinzugefügt',
    test_user_removed: 'hat Testnutzer entfernt', project_set: 'hat die App einem Projekt zugeordnet', project_removed: 'hat die App aus dem Projekt genommen'
  };
  var FIELDS = { name: 'Name', description: 'Beschreibung', website_url: 'Webseite', privacy_url: 'Datenschutz-URL', terms_url: 'Nutzungsbedingungen-URL', developer_name: 'Entwicklername' };

  function R(k) { return kkT(ROLES[k]); }
  function histText(c) {
    var d = c.details || {}, t = kkT(TEXT[c.action] || c.action);
    if (c.action === 'field_changed') t += ': ' + kkT(FIELDS[d.field] || d.field) + ' → „' + (d.to || '') + '“';
    else if (d.value) t += ': ' + d.value;
    return c.actor_name + ' ' + t;
  }

  window.kkTeams = {
    render: function (ctx) {
      var el = ctx.el, view = ctx.view, call = ctx.call, toast = ctx.toast;
      var teams = [], apps = [], openHist = {}, histData = {}, testData = {}, prefs = {}, chat = null;

      function fail(e) { toast('err', e.message); }
      function act(p, o) { return call(p, o).then(load).catch(fail); }
      function btn(text, fn, cls) { return el('button', { class: 'btn small ' + (cls || ''), type: 'button', onclick: fn, text: text }); }
      function input(ph, type) { return el('input', { type: type || 'text', placeholder: ph, 'aria-label': ph, maxlength: type === 'email' ? 254 : 60 }); }
      function row(kids) { return el('div', { class: 'btns', style: 'align-items:center;margin:6px 0' }, kids); }
      function roleSelect(cur, withNone, fn) {
        var s = el('select', { 'aria-label': 'Rolle' });
        if (withNone) s.appendChild(el('option', { value: 'none', text: 'Kein Zugriff' }));
        Object.keys(ROLES).reverse().forEach(function (k) { s.appendChild(el('option', { value: k, text: R(k) })); });
        s.value = cur || 'none'; s.addEventListener('change', function () { fn(s.value); }); return s;
      }

      /* ---------- Teams ---------- */
      function projectBox(team, p) {
        var isOwner = p.my_role === 'owner';
        var kids = [el('h4', { text: p.name + ' · ' + R(p.my_role) }), p.description ? el('p', { class: 'hint', text: p.description }) : null];
        team.members.forEach(function (mem) {
          var pm = p.members.filter(function (x) { return x.user_id === mem.user_id; })[0];
          var label = (mem.name || mem.email) + (mem.role === 'owner' ? ' (' + kkT('Team-Besitzer') + ')' : '');
          if (!isOwner || mem.role === 'owner') { kids.push(el('p', { class: 'small', text: label + ': ' + (mem.role === 'owner' ? kkT('Besitzer') : pm ? R(pm.role) : kkT('Kein Zugriff')) })); return; }
          kids.push(row([el('span', { text: label }), roleSelect(pm && pm.role, true, function (v) {
            act('/projects/' + p.id + '/members/' + mem.user_id, v === 'none' ? { method: 'DELETE' } : { method: 'PUT', body: { role: v } });
          })]));
        });
        var cv = p.chat_viewers || 'write', isViewer = p.my_role === 'viewer';
        if (!(isViewer && cv === 'none')) kids.push(btn('💬 Chat', function () { openChat('project:' + p.id, team.name + ' / ' + p.name, isOwner, !(isViewer && cv === 'read')); }));
        if (isOwner) {
          var cs = el('select', { 'aria-label': 'Chat für Personen mit „Nur ansehen“' });
          [['write', 'Schreiben und lesen'], ['read', 'Nur lesen'], ['none', 'Nichts sehen']].forEach(function (o) { cs.appendChild(el('option', { value: o[0], text: o[1] })); });
          cs.value = cv;
          cs.addEventListener('change', function () { act('/projects/' + p.id, { method: 'PATCH', body: { chat_viewers: cs.value } }); });
          kids.push(row([el('span', { text: 'Chat für Personen mit „Nur ansehen“:' }), cs]));
        }
        if (isOwner) kids.push(btn('Projekt löschen', function () { if (confirm(kkT('Projekt „{n}“ löschen? Apps bleiben erhalten.', { n: p.name }))) act('/projects/' + p.id, { method: 'DELETE' }); }, 'danger'));
        return el('div', { class: 'card', style: 'margin:10px 0' }, kids);
      }
      function teamCard(t) {
        var owner = t.my_role === 'owner', kids = [el('h3', { text: t.name }), el('p', { class: 'hint', text: kkT('Deine Rolle im Team: {r}', { r: kkT(owner ? 'Besitzer' : 'Mitglied') }) })];
        kids.push(btn('💬 Team-Chat', function () { openChat('team:' + t.id, t.name, owner); }, 'primary'));
        kids.push(el('h4', { text: 'Mitglieder' }));
        t.members.forEach(function (m) {
          var me = ctx.myId && m.user_id === ctx.myId, mo = m.role === 'owner';
          var r = [el('span', { text: (m.name || '') + ' <' + m.email + '>' + (mo ? ' · ' + kkT('Besitzer') : '') })];
          if (owner && !me) r.push(btn(mo ? 'Besitzer-Rolle entziehen' : 'Zum Besitzer machen', function () {
            if (confirm(kkT(mo ? 'Besitzer-Rolle von „{n}“ entziehen?' : '„{n}“ zum Team-Besitzer machen? Besitzer haben Vollzugriff.', { n: m.name || m.email })))
              act('/teams/' + t.id + '/members/' + m.user_id + '/role', { method: 'PUT', body: { role: mo ? 'member' : 'owner' } });
          }));
          if ((owner && !mo) || me) r.push(btn(me ? 'Verlassen' : 'Entfernen', function () { if (confirm(kkT('Wirklich?'))) act('/teams/' + t.id + '/members/' + m.user_id, { method: 'DELETE' }); }, 'danger'));
          kids.push(row(r));
        });
        if (owner) {
          t.invites.forEach(function (i) { kids.push(row([el('span', { class: 'muted', text: kkT('Eingeladen: {e}', { e: i.email }) }), btn('Zurückziehen', function () { act('/teams/' + t.id + '/invites/' + i.id, { method: 'DELETE' }); })])); });
          var mail = input('E-Mail der Person', 'email');
          var ls = el('select', { 'aria-label': 'Sprache der Einladung' });
          [['de', 'Deutsch'], ['en', 'English'], ['pt-BR', 'Português']].forEach(function (l) { ls.appendChild(el('option', { value: l[0], text: l[1] })); });
          ls.value = window.kkLang || 'de';
          kids.push(row([mail, ls, btn('Per E-Mail einladen', function () {
            call('/teams/' + t.id + '/invites', { method: 'POST', body: { email: mail.value, lang: ls.value } }).then(function () { toast('ok', 'Einladung gesendet.'); load(); }).catch(fail);
          }, 'primary')]));
        }
        kids.push(el('h4', { text: 'Projekte' }));
        t.projects.forEach(function (p) { kids.push(projectBox(t, p)); });
        if (!t.projects.length) kids.push(el('p', { class: 'hint', text: 'Noch keine Projekte, auf die du Zugriff hast.' }));
        if (owner) {
          var pn = input('Projektname');
          kids.push(row([pn, btn('Projekt erstellen', function () { act('/teams/' + t.id + '/projects', { method: 'POST', body: { name: pn.value } }); })]));
          kids.push(btn('Team löschen', function () { if (confirm(kkT('Team „{n}“ endgültig löschen?', { n: t.name }))) act('/teams/' + t.id, { method: 'DELETE' }); }, 'danger'));
        }
        return el('section', { class: 'card', style: 'margin:14px 0' }, kids);
      }

      /* ---------- Apps: Test-Modus, Projekt, Verlauf ---------- */
      function appCard(a) {
        var role = a.my_role, canEdit = role === 'editor' || role === 'owner', isOwner = role === 'owner', live = a.release_status === 'live';
        var kids = [el('h3', { text: a.name + ' · ' + kkT(live ? 'Live' : 'Test-Modus') + ' · ' + R(role) })];
        if (isOwner) {
          var sel = el('select', { 'aria-label': 'Projekt' }); sel.appendChild(el('option', { value: '', text: '(kein Projekt)' }));
          teams.forEach(function (t) { t.projects.forEach(function (p) { if (p.my_role !== 'viewer') sel.appendChild(el('option', { value: p.id, text: t.name + ' / ' + p.name })); }); });
          sel.value = a.project_id || '';
          sel.addEventListener('change', function () { act('/apps/' + a.id + '/project', { method: 'POST', body: { project_id: sel.value || null } }); });
          kids.push(row([el('span', { text: 'Projekt:' }), sel]));
          kids.push(row([btn(live ? 'Zurück in den Test-Modus' : 'Veröffentlichen', function () {
            if (!live && !confirm(kkT('App für ALLE Nutzer freigeben?'))) return;
            act('/apps/' + a.id + '/' + (live ? 'unpublish' : 'publish'), { method: 'POST' });
          }, live ? '' : 'primary')]));
        }
        if (!live) {
          kids.push(el('h4', { text: 'Testnutzer (max. 10)' }));
          var td = testData[a.id];
          if (!td) { call('/apps/' + a.id + '/test-users').then(function (r) { testData[a.id] = r; draw(); }).catch(fail); kids.push(el('p', { class: 'hint', text: 'Lädt …' })); }
          else {
            td.data.forEach(function (u) { kids.push(row([el('span', { text: u.email }), canEdit ? btn('Entfernen', function () { delete testData[a.id]; act('/apps/' + a.id + '/test-users/' + encodeURIComponent(u.email), { method: 'DELETE' }); }) : null])); });
            if (!td.data.length) kids.push(el('p', { class: 'hint', text: 'Keine Testnutzer. Nur du und dein Team können die App verbinden.' }));
            if (canEdit) { var em = input('E-Mail des Testnutzers', 'email'); kids.push(row([em, btn('Hinzufügen', function () { delete testData[a.id]; act('/apps/' + a.id + '/test-users', { method: 'POST', body: { email: em.value } }); })])); }
          }
        }
        kids.push(btn(openHist[a.id] ? 'Verlauf ausblenden' : 'Änderungsverlauf', function () {
          openHist[a.id] = !openHist[a.id];
          if (openHist[a.id]) call('/apps/' + a.id + '/history').then(function (r) { histData[a.id] = r.data; draw(); }).catch(fail); else draw();
        }));
        if (openHist[a.id] && histData[a.id]) {
          var ul = el('ul', { class: 'small' });
          histData[a.id].forEach(function (c) { ul.appendChild(el('li', { text: new Date(c.created_at).toLocaleString(kkLocale()) + ' – ' + histText(c) })); });
          if (!histData[a.id].length) ul.appendChild(el('li', { text: 'Noch keine Einträge.' }));
          kids.push(ul);
        }
        return el('section', { class: 'card', style: 'margin:14px 0' }, kids);
      }

      /* ---------- Chat (Abfrage alle 3 Sekunden) ---------- */
      function closeChat() { if (chat) { clearInterval(chat.timer); chat.box.remove(); chat = null; } }
      function hhmm(s) { return new Date(s).toLocaleTimeString(kkLocale(), { hour: '2-digit', minute: '2-digit' }); }
      function openChat(channel, title, canMod, canWrite) {
        closeChat();
        var list = el('div', { style: 'flex:1;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:6px' });
        var input = el('input', { type: 'text', placeholder: 'Nachricht schreiben …', 'aria-label': 'Nachricht', maxlength: 1000, style: 'flex:1;min-width:0' });
        var sendBtn = btn('Senden', function () { send(); }, 'primary');
        var empty = el('p', { class: 'hint', text: 'Noch keine Nachrichten.' }); list.appendChild(empty);
        var head = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)' }, [el('b', { text: '💬 ' + title }), btn('✕', closeChat)]);
        var box = el('div', { role: 'dialog', 'aria-label': 'Chat', style: 'position:fixed;left:0;right:0;bottom:0;max-width:560px;margin:0 auto;height:60vh;z-index:50;display:flex;flex-direction:column;background:var(--bg);color:var(--ink);border:2px solid var(--ink);border-radius:14px 14px 0 0;box-shadow:0 -4px 20px rgba(0,0,0,.3)' },
          [head, list, el('div', { style: 'display:flex;gap:6px;padding:8px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))' }, [input, sendBtn])]);
        document.body.appendChild(box);
        var c = chat = { box: box, channel: channel, last: 0, timer: null };
        function setWrite(w) {
          input.disabled = !w; sendBtn.disabled = !w;
          input.setAttribute('placeholder', kkT(w ? 'Nachricht schreiben …' : 'Du kannst in diesem Chat nur lesen.'));
        }
        setWrite(canWrite !== false);
        kkTranslateTree(box);
        function add(msgs) {
          var stick = list.scrollHeight - list.scrollTop - list.clientHeight < 80 || !c.last;
          msgs.forEach(function (m) {
            if (m.id <= c.last) return;
            c.last = m.id; if (empty.parentNode) empty.remove();
            var mine = ctx.myId && m.user_id === ctx.myId;
            var bub = el('div', { style: 'max-width:85%;padding:6px 10px;border-radius:10px;white-space:pre-wrap;word-break:break-word;background:' + (mine ? 'var(--ok-bg)' : 'var(--rule)') + ';align-self:' + (mine ? 'flex-end' : 'flex-start') }, [
              el('div', { class: 'small muted', text: (mine ? '' : m.author_name + ' · ') + hhmm(m.created_at) }), el('div', { text: m.body })]);
            if (mine || canMod) bub.appendChild(el('button', { type: 'button', class: 'small', 'aria-label': 'Löschen', title: 'Löschen', text: '×', style: 'margin-left:8px;border:0;background:none;color:var(--muted);cursor:pointer', onclick: function () { call('/chat/' + m.id, { method: 'DELETE' }).then(function () { bub.remove(); }).catch(fail); } }));
            list.appendChild(bub);
          });
          if (stick) list.scrollTop = list.scrollHeight;
        }
        function poll() {
          if (chat !== c) return;
          if (location.hash.indexOf('#/teams') !== 0) return closeChat();
          if (document.hidden) return;
          call('/chat?channel=' + encodeURIComponent(channel) + '&after=' + c.last).then(function (r) { if (chat === c) { setWrite(r.can_write !== false); add(r.data); } }).catch(function (e) { if (e && e.code === 'chat_hidden') closeChat(); });
        }
        function send() {
          var v = input.value.trim(); if (!v) return;
          call('/chat', { method: 'POST', body: { channel: channel, body: v } }).then(function (r) { input.value = ''; add([r.data]); list.scrollTop = list.scrollHeight; }).catch(fail);
        }
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });
        poll(); c.timer = setInterval(poll, 3000); input.focus();
      }

      /* ---------- Benachrichtigungen ---------- */
      function prefsCard() {
        function save() { call('/notif-prefs', { method: 'PUT', body: prefs }).then(function () { toast('ok', 'Gespeichert.'); }).catch(fail); }
        function cb(key, label) {
          var i = el('input', { type: 'checkbox' }); i.checked = !!prefs[key];
          i.addEventListener('change', function () { prefs[key] = i.checked; save(); });
          return el('label', { style: 'display:block;margin:6px 0' }, [i, el('span', { text: ' ' + label })]);
        }
        var ls = el('select', { 'aria-label': 'Sprache der Mails' });
        [['de', 'Deutsch'], ['en', 'English'], ['pt-BR', 'Português']].forEach(function (l) { ls.appendChild(el('option', { value: l[0], text: l[1] })); });
        ls.value = prefs.lang || window.kkLang || 'de';
        ls.addEventListener('change', function () { prefs.lang = ls.value; save(); });
        return el('section', { class: 'card', style: 'margin:14px 0' }, [
          el('h3', { text: 'Benachrichtigungen per E-Mail' }),
          el('p', { class: 'hint', text: 'Du bekommst Mails, wenn du Besitzer einer App bist (App-, Projekt- oder Team-Besitzer).' }),
          cb('on_changes', 'Wenn jemand anderes eine App ändert oder veröffentlicht'),
          cb('on_secret', 'Wenn jemand das Secret erneuert'),
          cb('on_errors', 'Wenn die Fehlerquote einer App stark steigt'),
          row([el('span', { text: 'Sprache der Mails' }), ls])]);
      }

      /* ---------- Zeichnen ---------- */
      function draw() {
        view.textContent = '';
        view.appendChild(el('h1', { text: 'Teams & Apps' }));
        var tn = input('Name des neuen Teams');
        view.appendChild(row([tn, btn('Team erstellen', function () { act('/teams', { method: 'POST', body: { name: tn.value } }); }, 'primary')]));
        view.appendChild(prefsCard());
        teams.forEach(function (t) { view.appendChild(teamCard(t)); });
        view.appendChild(el('h2', { text: 'Apps: Test-Modus & Verlauf' }));
        view.appendChild(el('p', { class: 'hint', text: 'Neue Apps starten im Test-Modus: Nur eingetragene Testnutzer, du und dein Team dürfen sie verbinden.' }));
        apps.forEach(function (a) { view.appendChild(appCard(a)); });
        if (!apps.length) view.appendChild(el('p', { class: 'hint', text: 'Du hast noch keine Apps (erstelle sie unter „Meine Apps“).' }));
        kkTranslateTree(view);
      }
      function load() {
        return Promise.all([call('/teams'), call('/apps'), call('/notif-prefs')]).then(function (r) { teams = r[0].data; apps = r[1].data; prefs = r[2]; draw(); }).catch(fail);
      }

      if (!ctx.getSession()) { view.textContent = ''; view.appendChild(el('p', { text: 'Bitte oben anmelden, um Teams zu nutzen.' })); return; }
      var inv = (location.hash.match(/[?&]invite=([A-Za-z0-9-]+)/) || [])[1];
      if (inv) {
        call('/invites/accept', { method: 'POST', body: { token: inv } })
          .then(function () { history.replaceState(null, '', '#/teams'); toast('ok', 'Du bist dem Team beigetreten.'); })
          .catch(fail).then(load);
      } else load();
    }
  };
})();

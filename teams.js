/* Teams, Projekte, Test-Modus, Verlauf, Benachrichtigungen, Chat – Seite "#/teams".
   Wird von app.js über window.kkTeams.render(ctx) aufgerufen. Gestaltung: teams.css (keine Inline-Styles). */
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
      var teams = [], apps = [], polls = [], nps = [], histData = {}, testData = {}, prefs = {}, chat = null, openSet = {};

      function fail(e) { toast('err', e.message); }
      function act(p, o) { return call(p, o).then(load).catch(fail); }
      function btn(text, fn, cls) { return el('button', { class: 'btn small ' + (cls || ''), type: 'button', onclick: fn, text: text }); }
      function field(ph) { return el('input', { type: 'text', inputmode: 'email', autocomplete: 'off', placeholder: ph, 'aria-label': ph, maxlength: 254 }); }
      function textField(ph) { return el('input', { type: 'text', autocomplete: 'off', placeholder: ph, 'aria-label': ph, maxlength: 60 }); }
      function row(kids) { return el('div', { class: 'tm-row' }, kids); }
      function badge(text, cls) { return el('span', { class: 'tm-badge ' + (cls || ''), text: text }); }
      function sec(title, kids) { return el('div', { class: 'tm-sec' }, [el('h4', { text: title })].concat(kids)); }
      function who(name, sub, extra) { return el('div', { class: 'tm-who' }, [el('b', { text: name }), sub ? el('small', { text: sub }) : null, extra || null]); }
      function person(whoEl, actions) { return el('div', { class: 'tm-person' }, [whoEl, actions && actions.length ? el('div', { class: 'tm-actions' }, actions) : null]); }
      // Ausklappbarer Bereich, merkt sich seinen Zustand über Neuzeichnen hinweg
      function det(id, title, kids, defOpen, onOpen) {
        var open = openSet[id] != null ? openSet[id] : !!defOpen;
        var d = el('details', { class: 'tm-d', open: open }, [el('summary', { text: title }), el('div', { class: 'tm-body' }, kids)]);
        d.addEventListener('toggle', function () { openSet[id] = d.open; if (d.open && onOpen) onOpen(); });
        return d;
      }
      function roleSelect(cur, withNone, fn) {
        var s = el('select', { 'aria-label': 'Rolle' });
        if (withNone) s.appendChild(el('option', { value: 'none', text: 'Kein Zugriff' }));
        ['viewer', 'editor', 'owner'].forEach(function (k) { s.appendChild(el('option', { value: k, text: R(k) })); });
        s.value = cur || 'none'; s.addEventListener('change', function () { fn(s.value); }); return s;
      }
      function langSelect(label) {
        var ls = el('select', { 'aria-label': label });
        [['de', 'Deutsch'], ['en', 'English'], ['pt-BR', 'Português']].forEach(function (l) { ls.appendChild(el('option', { value: l[0], text: l[1] })); });
        return ls;
      }

      /* ---------- Benachrichtigungen ---------- */
      function prefsCard() {
        function save() { call('/notif-prefs', { method: 'PUT', body: prefs }).then(function () { toast('ok', 'Gespeichert.'); }).catch(fail); }
        function cb(key, label) {
          var i = el('input', { type: 'checkbox' }); i.checked = !!prefs[key];
          i.addEventListener('change', function () { prefs[key] = i.checked; save(); });
          return el('label', { class: 'tm-check' }, [i, el('span', { text: label })]);
        }
        var ls = langSelect('Sprache der Mails'); ls.value = prefs.lang || window.kkLang || 'de';
        ls.addEventListener('change', function () { prefs.lang = ls.value; save(); });
        return det('prefs', 'Benachrichtigungen per E-Mail', [
          el('p', { class: 'tm-note', text: 'Du bekommst Mails, wenn du Besitzer einer App bist (App-, Projekt- oder Team-Besitzer).' }),
          cb('on_changes', 'Wenn jemand anderes eine App ändert oder veröffentlicht'),
          cb('on_secret', 'Wenn jemand das Secret erneuert'),
          cb('on_errors', 'Wenn die Fehlerquote einer App stark steigt'),
          row([el('label', { text: 'Sprache der Mails' }), ls])
        ], false);
      }

      /* ---------- Teams ---------- */
      function projectBox(team, p) {
        var isOwner = p.my_role === 'owner', cv = p.chat_viewers || 'write', isViewer = p.my_role === 'viewer';
        var kids = [];
        if (p.description) kids.push(el('p', { class: 'tm-note', text: p.description }));
        if (!(isViewer && cv === 'none')) kids.push(row([btn('💬 Chat', function () { openChat('project:' + p.id, team.name + ' / ' + p.name, isOwner, !(isViewer && cv === 'read')); }, 'primary')]));
        var canMake = !isViewer;
        var ak = apps.filter(function (x) { return x.project_id === p.id; }).map(function (x) {
          var lv = x.release_status === 'live';
          return person(who(x.name, null, badge(kkT(lv ? 'Live' : 'Test-Modus'), lv ? 'live' : 'test')), canMake ? [el('a', { class: 'btn small', href: '#/apps?edit=' + x.id, text: 'Bearbeiten' })] : []);
        });
        if (!ak.length) ak.push(el('p', { class: 'tm-note', text: 'Noch keine Apps in diesem Projekt.' }));
        if (canMake) ak.push(row([el('a', { class: 'btn small primary', href: '#/apps?project=' + p.id, text: '+ Neue App' })]));
        kids.push(sec('Apps im Projekt', ak));
        var fk = (p.forms || []).map(function (f) {
          return person(who(f.title), canMake ? [el('a', { class: 'btn small', href: 'contact.html?edit=' + f.id, text: 'Bearbeiten' })] : []);
        });
        if (!fk.length) fk.push(el('p', { class: 'tm-note', text: 'Noch keine Formulare in diesem Projekt.' }));
        if (canMake) fk.push(row([el('a', { class: 'btn small primary', href: 'contact.html?project=' + p.id, text: '+ Neues Formular' })]));
        kids.push(sec('Kontaktformulare im Projekt', fk));
        function extra(title, items, page, emptyText, newText) {
          var xs = (items || []).map(function (f) { return person(who(f.title), canMake ? [el('a', { class: 'btn small', href: page + '?edit=' + f.id, text: 'Bearbeiten' })] : []); });
          if (!xs.length) xs.push(el('p', { class: 'tm-note', text: emptyText }));
          if (canMake) xs.push(row([el('a', { class: 'btn small primary', href: page + '?project=' + p.id, text: newText })]));
          kids.push(sec(title, xs));
        }
        extra('Feedback-Knöpfe im Projekt', p.feedback, 'feedback.html', 'Noch keine Feedback-Knöpfe in diesem Projekt.', '+ Neuer Feedback-Knopf');
        extra('Umfragen im Projekt', polls.filter(function (x) { return x.project_id === p.id; }).map(function (x) { return { id: x.id, title: (x.pub && (x.pub.title || x.pub.question)) || x.id }; }), 'poll.html', 'Noch keine Umfragen in diesem Projekt.', '+ Neue Umfrage');
        extra('KI-Agenten im Projekt', p.agents, 'agents.html', 'Noch keine KI-Agenten in diesem Projekt.', '+ Neuer Agent');
        var people = team.members.map(function (mem) {
          var pm = p.members.filter(function (x) { return x.user_id === mem.user_id; })[0];
          var isTO = mem.role === 'owner';
          var right = (!isOwner || isTO) ? [badge(isTO ? kkT('Besitzer') : pm ? R(pm.role) : kkT('Kein Zugriff'))] : [roleSelect(pm && pm.role, true, function (v) {
            act('/projects/' + p.id + '/members/' + mem.user_id, v === 'none' ? { method: 'DELETE' } : { method: 'PUT', body: { role: v } });
          })];
          return person(who(mem.name || mem.email, isTO ? kkT('Team-Besitzer') : mem.email), right);
        });
        kids.push(sec('Mitglieder', people));
        if (isOwner) {
          var cs = el('select', { 'aria-label': 'Chat für Personen mit „Nur ansehen“' });
          [['write', 'Schreiben und lesen'], ['read', 'Nur lesen'], ['none', 'Nichts sehen']].forEach(function (o) { cs.appendChild(el('option', { value: o[0], text: o[1] })); });
          cs.value = cv;
          cs.addEventListener('change', function () { act('/projects/' + p.id, { method: 'PATCH', body: { chat_viewers: cs.value } }); });
          kids.push(row([el('label', { text: 'Chat für Personen mit „Nur ansehen“:' }), cs]));
          kids.push(row([btn('Projekt löschen', function () { if (confirm(kkT('Projekt „{n}“ löschen? Apps bleiben erhalten.', { n: p.name }))) act('/projects/' + p.id, { method: 'DELETE' }); }, 'danger')]));
        }
        return det('p' + p.id, p.name + ' · ' + R(p.my_role), kids, false);
      }

      function memberRow(t, m, owner) {
        var me = ctx.myId && m.user_id === ctx.myId, mo = m.role === 'owner', acts = [];
        if (owner && !me) acts.push(btn(mo ? 'Besitzer-Rolle entziehen' : 'Zum Besitzer machen', function () {
          if (confirm(kkT(mo ? 'Besitzer-Rolle von „{n}“ entziehen?' : '„{n}“ zum Team-Besitzer machen? Besitzer haben Vollzugriff.', { n: m.name || m.email })))
            act('/teams/' + t.id + '/members/' + m.user_id + '/role', { method: 'PUT', body: { role: mo ? 'member' : 'owner' } });
        }));
        if ((owner && !mo) || me) acts.push(btn(me ? 'Verlassen' : 'Entfernen', function () { if (confirm(kkT('Wirklich?'))) act('/teams/' + t.id + '/members/' + m.user_id, { method: 'DELETE' }); }, 'danger'));
        return person(who(m.name || m.email, m.name ? m.email : '', mo ? badge(kkT('Besitzer')) : null), acts);
      }

      function teamCard(t) {
        var owner = t.my_role === 'owner';
        var card = el('section', { class: 'tm-card' });
        card.appendChild(el('div', { class: 'tm-head' }, [
          el('div', { class: 'tm-title' }, [el('h3', { text: t.name }), badge(kkT(owner ? 'Besitzer' : 'Mitglied'))]),
          btn('💬 Team-Chat', function () { openChat('team:' + t.id, t.name, owner, true); }, 'primary')]));

        var mk = t.members.map(function (m) { return memberRow(t, m, owner); });
        if (owner) {
          t.invites.forEach(function (i) {
            mk.push(person(who(i.email, kkT('Eingeladen: {e}', { e: '' }).replace(/:\s*$/, '')), [btn('Zurückziehen', function () { act('/teams/' + t.id + '/invites/' + i.id, { method: 'DELETE' }); })]));
          });
          var mail = field('E-Mail der Person'), ls = langSelect('Sprache der Einladung'); ls.value = window.kkLang || 'de';
          mk.push(row([mail, ls, btn('Per E-Mail einladen', function () {
            call('/teams/' + t.id + '/invites', { method: 'POST', body: { email: mail.value, lang: ls.value } }).then(function () { toast('ok', 'Einladung gesendet.'); load(); }).catch(fail);
          }, 'primary')]));
        }
        card.appendChild(det('m' + t.id, kkT('Mitglieder') + ' (' + t.members.length + ')', mk, true));

        var pk = t.projects.map(function (p) { return projectBox(t, p); });
        if (!pk.length) pk.push(el('p', { class: 'tm-note', text: 'Noch keine Projekte, auf die du Zugriff hast.' }));
        if (owner) {
          var pn = textField('Projektname');
          pk.push(row([pn, btn('Projekt erstellen', function () { act('/teams/' + t.id + '/projects', { method: 'POST', body: { name: pn.value } }); })]));
        }
        card.appendChild(det('pr' + t.id, kkT('Projekte') + ' (' + t.projects.length + ')', pk, true));

        if (owner) card.appendChild(row([btn('Team löschen', function () { if (confirm(kkT('Team „{n}“ endgültig löschen?', { n: t.name }))) act('/teams/' + t.id, { method: 'DELETE' }); }, 'danger')]));
        return card;
      }

      /* ---------- Apps: Test-Modus, Projekt, Verlauf ---------- */
      function appCard(a) {
        var role = a.my_role, canEdit = role === 'editor' || role === 'owner', isOwner = role === 'owner', live = a.release_status === 'live';
        var card = el('section', { class: 'tm-card' });
        card.appendChild(el('div', { class: 'tm-head' }, [el('div', { class: 'tm-title' }, [el('h3', { text: a.name }), badge(kkT(live ? 'Live' : 'Test-Modus'), live ? 'live' : 'test'), badge(R(role))])]));
        if (isOwner) {
          var sel = el('select', { 'aria-label': 'Projekt' }); sel.appendChild(el('option', { value: '', text: '(kein Projekt)' }));
          teams.forEach(function (t) { t.projects.forEach(function (p) { if (p.my_role !== 'viewer') sel.appendChild(el('option', { value: p.id, text: t.name + ' / ' + p.name })); }); });
          sel.value = a.project_id || '';
          sel.addEventListener('change', function () { act('/apps/' + a.id + '/project', { method: 'POST', body: { project_id: sel.value || null } }); });
          card.appendChild(row([el('label', { text: 'Projekt:' }), sel]));
          card.appendChild(row([btn(live ? 'Zurück in den Test-Modus' : 'Veröffentlichen', function () {
            if (!live && !confirm(kkT('App für ALLE Nutzer freigeben?'))) return;
            act('/apps/' + a.id + '/' + (live ? 'unpublish' : 'publish'), { method: 'POST' });
          }, live ? '' : 'primary')]));
        }
        if (!live) {
          var td = testData[a.id], tk = [];
          function loadTU() { call('/apps/' + a.id + '/test-users').then(function (r) { testData[a.id] = r; draw(); }).catch(fail); }
          if (!td) tk.push(el('p', { class: 'tm-note', text: 'Lädt …' }));
          else {
            td.data.forEach(function (u) { tk.push(person(who(u.email), canEdit ? [btn('Entfernen', function () { delete testData[a.id]; act('/apps/' + a.id + '/test-users/' + encodeURIComponent(u.email), { method: 'DELETE' }); })] : [])); });
            if (!td.data.length) tk.push(el('p', { class: 'tm-note', text: 'Keine Testnutzer. Nur du und dein Team können die App verbinden.' }));
            if (canEdit) { var em = field('E-Mail des Testnutzers'); tk.push(row([em, btn('Hinzufügen', function () { delete testData[a.id]; act('/apps/' + a.id + '/test-users', { method: 'POST', body: { email: em.value } }); })])); }
          }
          card.appendChild(det('t' + a.id, kkT('Testnutzer (max. 10)'), tk, true, function () { if (!testData[a.id]) loadTU(); }));
          if (!td && (openSet['t' + a.id] == null || openSet['t' + a.id])) loadTU();
        }
        var hk = [];
        if (!histData[a.id]) hk.push(el('p', { class: 'tm-note', text: 'Lädt …' }));
        else {
          var ul = el('ul', { class: 'tm-hist' });
          histData[a.id].forEach(function (c) { ul.appendChild(el('li', { text: new Date(c.created_at).toLocaleString(kkLocale()) + ' – ' + histText(c) })); });
          if (!histData[a.id].length) ul.appendChild(el('li', { text: kkT('Noch keine Einträge.') }));
          hk.push(ul);
        }
        card.appendChild(det('h' + a.id, kkT('Änderungsverlauf'), hk, false, function () { call('/apps/' + a.id + '/history').then(function (r) { histData[a.id] = r.data; draw(); }).catch(fail); }));
        return card;
      }

      /* ---------- Chat (Abfrage alle 3 Sekunden) ---------- */
      function closeChat() { if (chat) { clearInterval(chat.timer); chat.box.remove(); chat = null; } }
      function hhmm(s) { return new Date(s).toLocaleTimeString(kkLocale(), { hour: '2-digit', minute: '2-digit' }); }
      function openChat(channel, title, canMod, canWrite) {
        closeChat();
        var list = el('div', { class: 'tm-chat-list' });
        var empty = el('p', { class: 'tm-note', text: 'Noch keine Nachrichten.' }); list.appendChild(empty);
        var input = el('input', { type: 'text', placeholder: 'Nachricht schreiben …', 'aria-label': 'Nachricht', maxlength: 1000, autocomplete: 'off' });
        var sendBtn = btn('Senden', function () { send(); }, 'primary');
        var box = el('div', { class: 'tm-chat', role: 'dialog', 'aria-label': 'Chat' }, [
          el('div', { class: 'tm-chat-head' }, [el('b', { text: '💬 ' + title }), btn('✕', closeChat)]),
          list, el('div', { class: 'tm-chat-form' }, [input, sendBtn])]);
        document.body.appendChild(box);
        var c = chat = { box: box, channel: channel, last: 0, timer: null };
        function setWrite(w) { input.disabled = !w; sendBtn.disabled = !w; input.setAttribute('placeholder', kkT(w ? 'Nachricht schreiben …' : 'Du kannst in diesem Chat nur lesen.')); }
        setWrite(canWrite !== false);
        kkTranslateTree(box);
        function add(msgs) {
          var stick = list.scrollHeight - list.scrollTop - list.clientHeight < 80 || !c.last;
          msgs.forEach(function (m) {
            if (m.id <= c.last) return;
            c.last = m.id; if (empty.parentNode) empty.remove();
            var mine = ctx.myId && m.user_id === ctx.myId;
            var bub = el('div', { class: 'tm-msg' + (mine ? ' mine' : '') }, [
              el('div', { class: 'meta', text: (mine ? '' : m.author_name + ' · ') + hhmm(m.created_at) }), el('div', { class: 'txt', text: m.body })]);
            if (mine || canMod) bub.firstChild.appendChild(el('button', { type: 'button', class: 'del', 'aria-label': kkT('Löschen'), title: kkT('Löschen'), text: '×', onclick: function () { call('/chat/' + m.id, { method: 'DELETE' }).then(function () { bub.remove(); }).catch(fail); } }));
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

      /* ---------- Zeichnen ---------- */
      function draw() {
        view.textContent = '';
        var root = el('div', { class: 'tm-page' });
        root.appendChild(el('h1', { text: 'Teams & Apps' }));
        var tn = textField('Name des neuen Teams');
        root.appendChild(row([tn, btn('Team erstellen', function () { act('/teams', { method: 'POST', body: { name: tn.value } }); }, 'primary')]));
        root.appendChild(prefsCard());
        teams.forEach(function (t) { root.appendChild(teamCard(t)); });
        root.appendChild(el('h2', { text: 'Apps: Test-Modus & Verlauf' }));
        root.appendChild(el('p', { class: 'tm-note', text: 'Neue Apps starten im Test-Modus: Nur eingetragene Testnutzer, du und dein Team dürfen sie verbinden.' }));
        apps.forEach(function (a) { root.appendChild(appCard(a)); });
        if (!apps.length) root.appendChild(el('p', { class: 'tm-note', text: 'Du hast noch keine Apps (erstelle sie unter „Meine Apps“).' }));
        view.appendChild(root);
        kkTranslateTree(view);
      }
      // Umfragen kommen von der Funktion „poll“ (Rechte wie bei Feedback); Fehler hier dürfen die Seite nicht stören
      function loadPolls() {
        var s = ctx.getSession();
        if (!s || !s.access_token) return Promise.resolve([]);
        return fetch('https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/poll', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + s.access_token }, body: JSON.stringify({ action: 'list_forms' }) })
          .then(function (r) { return r.ok ? r.json() : { forms: [] }; }).then(function (j) { return j.forms || []; }).catch(function () { return []; });
      }
       function loadNps() {
  var s = ctx.getSession();
  if (!s || !s.access_token) return Promise.resolve([]);
  return fetch('https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/nps', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + s.access_token }, body: JSON.stringify({ action: 'list_forms' }) })
    .then(function (r) { return r.ok ? r.json() : { forms: [] }; }).then(function (j) { return j.forms || []; }).catch(function () { return []; });
}
      function load() {
        return Promise.all([call('/teams'), call('/apps'), call('/notif-prefs')])
          .then(function (r) { teams = r[0].data; apps = r[1].data; prefs = r[2]; return loadPolls(); })
          .then(function (p) { polls = p; draw(); }).catch(fail);
      }

      if (!ctx.getSession()) { view.textContent = ''; view.appendChild(el('p', { text: 'Bitte oben anmelden, um Teams zu nutzen.' })); kkTranslateTree(view); return; }
      var inv = (location.hash.match(/[?&]invite=([A-Za-z0-9-]+)/) || [])[1];
      if (inv) {
        call('/invites/accept', { method: 'POST', body: { token: inv } })
          .then(function () { history.replaceState(null, '', '#/teams'); toast('ok', 'Du bist dem Team beigetreten.'); })
          .catch(fail).then(load);
      } else load();
    }
  };
})();

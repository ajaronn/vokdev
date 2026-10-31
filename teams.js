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
      var teams = [], apps = [], openHist = {}, histData = {}, testData = {};

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
        if (isOwner) kids.push(btn('Projekt löschen', function () { if (confirm(kkT('Projekt „{n}“ löschen? Apps bleiben erhalten.', { n: p.name }))) act('/projects/' + p.id, { method: 'DELETE' }); }, 'danger'));
        return el('div', { class: 'card', style: 'margin:10px 0' }, kids);
      }
      function teamCard(t) {
        var owner = t.my_role === 'owner', kids = [el('h3', { text: t.name }), el('p', { class: 'hint', text: kkT('Deine Rolle im Team: {r}', { r: kkT(owner ? 'Besitzer' : 'Mitglied') }) })];
        kids.push(el('h4', { text: 'Mitglieder' }));
        t.members.forEach(function (m) {
          var me = ctx.myId && m.user_id === ctx.myId;
          kids.push(row([el('span', { text: (m.name || '') + ' <' + m.email + '>' + (m.role === 'owner' ? ' · ' + kkT('Besitzer') : '') }),
            (owner && m.role !== 'owner') || (me && m.role !== 'owner') ? btn(me ? 'Verlassen' : 'Entfernen', function () { if (confirm(kkT('Wirklich?'))) act('/teams/' + t.id + '/members/' + m.user_id, { method: 'DELETE' }); }, 'danger') : null]));
        });
        if (owner) {
          t.invites.forEach(function (i) { kids.push(row([el('span', { class: 'muted', text: kkT('Eingeladen: {e}', { e: i.email }) }), btn('Zurückziehen', function () { act('/teams/' + t.id + '/invites/' + i.id, { method: 'DELETE' }); })])); });
          var mail = input('E-Mail der Person', 'email');
          kids.push(row([mail, btn('Per E-Mail einladen', function () {
            call('/teams/' + t.id + '/invites', { method: 'POST', body: { email: mail.value } }).then(function () { toast('ok', 'Einladung gesendet.'); load(); }).catch(fail);
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

      /* ---------- Zeichnen ---------- */
      function draw() {
        view.textContent = '';
        view.appendChild(el('h1', { text: 'Teams & Apps' }));
        var tn = input('Name des neuen Teams');
        view.appendChild(row([tn, btn('Team erstellen', function () { act('/teams', { method: 'POST', body: { name: tn.value } }); }, 'primary')]));
        teams.forEach(function (t) { view.appendChild(teamCard(t)); });
        view.appendChild(el('h2', { text: 'Apps: Test-Modus & Verlauf' }));
        view.appendChild(el('p', { class: 'hint', text: 'Neue Apps starten im Test-Modus: Nur eingetragene Testnutzer, du und dein Team dürfen sie verbinden.' }));
        apps.forEach(function (a) { view.appendChild(appCard(a)); });
        if (!apps.length) view.appendChild(el('p', { class: 'hint', text: 'Du hast noch keine Apps (erstelle sie unter „Meine Apps“).' }));
        kkTranslateTree(view);
      }
      function load() {
        return Promise.all([call('/teams'), call('/apps')]).then(function (r) { teams = r[0].data; apps = r[1].data; draw(); }).catch(fail);
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

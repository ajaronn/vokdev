/* Karteikasten Developer · NPS-Builder (nutzt die Anmeldung der Developer-Seite) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/nps';
  var WIDGET = 'https://ajaronn.github.io/vokdev/nps-widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  // Deutsch ist der Schlüssel; [EN, PT]
  var TR = {
    'NPS-Umfrage erstellen': ['Create an NPS survey', 'Criar pesquisa NPS'],
    'Besucher bewerten auf einer Skala von 0 bis 10, wie wahrscheinlich sie dich weiterempfehlen (optional mit Kommentar). Als Knopf oder Popup. Du fügst eine Zeile Code ein und siehst den NPS hier.': ['Visitors rate on a scale of 0 to 10 how likely they are to recommend you (optionally with a comment). As a button or popup. Paste one line of code and see your NPS here.', 'Os visitantes avaliam de 0 a 10 a probabilidade de recomendar você (opcionalmente com comentário). Como botão ou popup. Cole uma linha de código e veja seu NPS aqui.'],
    'Bitte melde dich zuerst auf der Developer-Seite an.': ['Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.'],
    'Zur Anmeldung': ['Go to sign-in', 'Ir para o login'],
    'Meine NPS-Umfragen': ['My NPS surveys', 'Minhas pesquisas NPS'], 'Noch keine NPS-Umfragen.': ['No NPS surveys yet.', 'Nenhuma pesquisa NPS ainda.'],
    'Neue NPS-Umfrage': ['New NPS survey', 'Nova pesquisa NPS'], 'Bearbeiten': ['Edit', 'Editar'], 'Löschen': ['Delete', 'Excluir'], 'Ergebnisse': ['Results', 'Resultados'],
    'Diese NPS-Umfrage wirklich löschen? Alle Antworten gehen verloren.': ['Really delete this NPS survey? All answers will be lost.', 'Excluir esta pesquisa NPS? Todas as respostas serão perdidas.'],
    'Diesen Kommentar löschen?': ['Delete this comment?', 'Excluir este comentário?'],
    'Speichern': ['Save', 'Salvar'], 'Zurück': ['Back', 'Voltar'],
    'Gespeichert! Unten siehst du die Vorschau (dort abgegebene Antworten werden wirklich gespeichert) und deinen Code.': ['Saved! Below you see the preview (answers given there are really saved) and your code.', 'Salvo! Abaixo você vê a prévia (respostas dadas lá são realmente salvas) e seu código.'],
    'Titel': ['Title', 'Título'], 'Frage (leer = Standardfrage „Würdest du uns weiterempfehlen?“)': ['Question (empty = default question)', 'Pergunta (vazio = pergunta padrão)'],
    'Text bei 0 (leer = Standard)': ['Label at 0 (empty = default)', 'Texto em 0 (vazio = padrão)'], 'Text bei 10 (leer = Standard)': ['Label at 10 (empty = default)', 'Texto em 10 (vazio = padrão)'],
    'Kommentarfeld anzeigen': ['Show comment field', 'Mostrar campo de comentário'], 'Text über dem Kommentarfeld (leer = Standard)': ['Text above comment field (empty = default)', 'Texto acima do campo (vazio = padrão)'],
    'Dankestext (leer = Standard)': ['Thank-you text (empty = default)', 'Texto de agradecimento (vazio = padrão)'],
    'Emoji': ['Emoji', 'Emoji'], 'Knopf-Text (optional)': ['Button text (optional)', 'Texto do botão (opcional)'], 'Farbe': ['Color', 'Cor'],
    'Design': ['Theme', 'Tema'], 'Automatisch': ['Automatic', 'Automático'], 'Hell': ['Light', 'Claro'], 'Dunkel': ['Dark', 'Escuro'],
    'Position': ['Position', 'Posição'], 'Rechts unten': ['Bottom right', 'Inferior direito'], 'Links unten': ['Bottom left', 'Inferior esquerdo'],
    'Anzeige': ['Display', 'Exibição'], 'Knopf': ['Button', 'Botão'], 'Popup': ['Popup', 'Popup'], 'Popup erscheint nach (Sekunden)': ['Popup appears after (seconds)', 'Popup aparece após (segundos)'],
    'Nach dem Schließen weiter kleinen Knopf zeigen': ['Keep showing a small button after closing', 'Continuar mostrando um botão pequeno após fechar'],
    'Antworten zählen': ['Count answers', 'Contar respostas'], 'Pro Webseite (ein Wert je Besucher)': ['Per website (one value per visitor)', 'Por site (um valor por visitante)'], 'Pro Unterseite': ['Per page', 'Por página'],
    'Sprache': ['Language', 'Idioma'], 'Erlaubte Domains (optional, mit Komma)': ['Allowed domains (optional, comma-separated)', 'Domínios permitidos (opcional, separados por vírgula)'],
    'Projekt (optional)': ['Project (optional)', 'Projeto (opcional)'], '(kein Projekt)': ['(no project)', '(sem projeto)'],
    'Dein Code': ['Your code', 'Seu código'], 'Kopieren': ['Copy', 'Copiar'], 'Kopiert!': ['Copied!', 'Copiado!'],
    'Antworten': ['Answers', 'Respostas'], 'Promoter (9–10)': ['Promoters (9–10)', 'Promotores (9–10)'], 'Passive (7–8)': ['Passives (7–8)', 'Neutros (7–8)'], 'Detractors (0–6)': ['Detractors (0–6)', 'Detratores (0–6)'],
    'Noch keine Antworten.': ['No answers yet.', 'Nenhuma resposta ainda.'], 'Verteilung': ['Distribution', 'Distribuição'], 'Kommentare': ['Comments', 'Comentários'], 'Mehr laden': ['Load more', 'Carregar mais'],
    'CSV exportieren': ['Export CSV', 'Exportar CSV'], 'Sitzung abgelaufen. Bitte melde dich neu an.': ['Session expired. Please sign in again.', 'Sessão expirada. Entre novamente.'],
    'Fehler. Bitte versuche es erneut.': ['Error. Please try again.', 'Erro. Tente novamente.'], 'Maximal 5 NPS-Umfragen erreicht.': ['Maximum of 5 NPS surveys reached.', 'Máximo de 5 pesquisas NPS atingido.'],
    'Keine Berechtigung.': ['No permission.', 'Sem permissão.']
  };
  function t(s) { var a = TR[s]; return a && I ? a[I - 1] : s; }

  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else if (k.slice(0, 2) === 'on') e[k] = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function clear() { view.textContent = ''; }
  function session() { try { return JSON.parse(localStorage.getItem('kkdev_session') || 'null'); } catch (e) { return null; } }
  function api(body) {
    var s = session();
    if (!s || !s.access_token || (s.expires_at && s.expires_at < Date.now())) return Promise.reject({ auth: true });
    return fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + s.access_token }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw { code: j.error || 'fail', status: r.status }; return j; }); });
  }
  function fail(e) {
    if (e && (e.auth || e.status === 401)) return loginView();
    var m = e && e.code === 'max_forms' ? 'Maximal 5 NPS-Umfragen erreicht.' : e && e.code === 'forbidden' ? 'Keine Berechtigung.' : 'Fehler. Bitte versuche es erneut.';
    view.insertBefore(h('div', { class: 'msg err', role: 'alert', text: t(m) }), view.firstChild);
  }
  function loginView() {
    clear();
    view.appendChild(h('h1', { text: t('NPS-Umfrage erstellen') }));
    view.appendChild(h('p', { text: t('Bitte melde dich zuerst auf der Developer-Seite an.') }));
    view.appendChild(h('a', { class: 'b', href: 'index.html', text: t('Zur Anmeldung'), style: 'display:inline-block;text-decoration:none' }));
  }

  var PROJ = [], preProject = '';
  var DEEP = { project: (location.search.match(/[?&]project=([0-9a-f-]{36})/) || [])[1], edit: (location.search.match(/[?&]edit=([0-9a-zA-Z-]{4,40})/) || [])[1] };
  function projName(f) { var p = f.project_id && PROJ.filter(function (x) { return x.id === f.project_id; })[0]; return p ? ' · ' + p.team + ' / ' + p.name : ''; }

  function list() {
    clear(); view.appendChild(h('div', { class: 'spinner', role: 'status' }));
    api({ action: 'list_forms' }).then(function (j) {
      PROJ = j.projects || [];
      if (DEEP.edit || DEEP.project) {
        var dp = { edit: DEEP.edit, project: DEEP.project }; DEEP = {};
        if (dp.edit) { var f = (j.forms || []).filter(function (x) { return x.id === dp.edit; })[0]; if (f) return results(f); }
        if (dp.project && !dp.edit) { preProject = dp.project; return form(null); }
      }
      clear();
      view.appendChild(h('h1', { text: t('NPS-Umfrage erstellen') }));
      view.appendChild(h('p', { text: t('Besucher bewerten auf einer Skala von 0 bis 10, wie wahrscheinlich sie dich weiterempfehlen (optional mit Kommentar). Als Knopf oder Popup. Du fügst eine Zeile Code ein und siehst den NPS hier.') }));
      view.appendChild(h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t('Neue NPS-Umfrage'), onclick: function () { form(null); } })]));
      view.appendChild(h('h2', { text: t('Meine NPS-Umfragen') }));
      if (!j.forms.length) view.appendChild(h('p', { text: t('Noch keine NPS-Umfragen.') }));
      j.forms.forEach(function (f) {
        var can = f.my_role !== 'viewer', own = f.my_role === 'owner';
        var btns = [h('button', { class: 'b', type: 'button', text: t('Ergebnisse'), onclick: function () { results(f); } })];
        if (can) btns.push(h('button', { class: 'b s', type: 'button', text: t('Bearbeiten'), onclick: function () { form(f); } }));
        if (own) btns.push(h('button', { class: 'b s', type: 'button', text: t('Löschen'), onclick: function () { if (confirm(t('Diese NPS-Umfrage wirklich löschen? Alle Antworten gehen verloren.'))) api({ action: 'delete', id: f.id }).then(list).catch(fail); } }));
        view.appendChild(h('div', { class: 'card' }, [h('b', { text: (f.pub.emoji || '⭐') + ' ' + (f.pub.title || f.pub.question || f.id) }), h('span', { text: projName(f) }), h('div', { class: 'row' }, btns)]));
      });
    }).catch(fail);
  }

  function snippet(id) { return '<script src="' + WIDGET + '" data-form="' + id + '" defer><\/script>'; }
  function preview(id) { if (window.KKNps) window.KKNps.mount(id, { open: true, lang: L }); }

  function form(f) {
    clear();
    var p = f ? f.pub : { comment_on: true, color: '#A8442E', theme: 'auto', position: 'right', mode: 'button', scope: 'site', lang: 'auto', emoji: '⭐', popup_delay: 5 };
    var pr = f ? f.priv : {};
    var F = {};
    function field(key, label, attrs, val) { F[key] = h('input', Object.assign({ type: 'text', id: 'f_' + key, value: val == null ? '' : val }, attrs || {})); return [h('label', { for: 'f_' + key, text: t(label) }), F[key]]; }
    function sel(key, label, opts, val) { F[key] = h('select', { id: 'f_' + key }, opts.map(function (o) { return h('option', { value: o[0], text: t(o[1]) }); })); F[key].value = val; return [h('label', { for: 'f_' + key, text: t(label) }), F[key]]; }
    var nodes = [h('h1', { text: f ? t('Bearbeiten') : t('Neue NPS-Umfrage') })];
    [].concat(
      field('title', 'Titel', { maxlength: 80 }, p.title), field('question', 'Frage (leer = Standardfrage „Würdest du uns weiterempfehlen?“)', { maxlength: 300 }, p.question),
      field('low_label', 'Text bei 0 (leer = Standard)', { maxlength: 40 }, p.low_label), field('high_label', 'Text bei 10 (leer = Standard)', { maxlength: 40 }, p.high_label)
    ).forEach(function (n) { nodes.push(n); });
    F.comment_on = h('input', { type: 'checkbox', id: 'f_comment_on' }); F.comment_on.checked = p.comment_on !== false;
    nodes.push(h('label', { for: 'f_comment_on' }, [F.comment_on, ' ' + t('Kommentarfeld anzeigen')]));
    [].concat(
      field('comment_label', 'Text über dem Kommentarfeld (leer = Standard)', { maxlength: 200 }, p.comment_label), field('success', 'Dankestext (leer = Standard)', { maxlength: 200 }, p.success),
      field('emoji', 'Emoji', { maxlength: 8 }, p.emoji), field('launcher', 'Knopf-Text (optional)', { maxlength: 30 }, p.launcher)
    ).forEach(function (n) { nodes.push(n); });
    F.color = h('input', { type: 'color', id: 'f_color', value: p.color || '#A8442E' });
    nodes.push(h('label', { for: 'f_color', text: t('Farbe') }), F.color);
    [].concat(
      sel('theme', 'Design', [['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']], p.theme),
      sel('position', 'Position', [['right', 'Rechts unten'], ['left', 'Links unten']], p.position),
      sel('mode', 'Anzeige', [['button', 'Knopf'], ['popup', 'Popup']], p.mode)
    ).forEach(function (n) { nodes.push(n); });
    nodes.push.apply(nodes, field('popup_delay', 'Popup erscheint nach (Sekunden)', { type: 'number', min: 0, max: 120 }, p.popup_delay || 0));
    F.popup_button = h('input', { type: 'checkbox', id: 'f_pb' }); F.popup_button.checked = !!p.popup_button;
    nodes.push(h('label', { for: 'f_pb' }, [F.popup_button, ' ' + t('Nach dem Schließen weiter kleinen Knopf zeigen')]));
    [].concat(
      sel('scope', 'Antworten zählen', [['site', 'Pro Webseite (ein Wert je Besucher)'], ['page', 'Pro Unterseite']], p.scope),
      sel('lang', 'Sprache', [['auto', 'Automatisch'], ['de', 'Deutsch'], ['en', 'English'], ['pt-BR', 'Português (Brasil)']], p.lang),
      field('domains', 'Erlaubte Domains (optional, mit Komma)', { maxlength: 300 }, pr.domains)
    ).forEach(function (n) { nodes.push(n); });
    var pickable = PROJ.filter(function (x) { return x.role >= 2; }), projSel = null;
    if (pickable.length || (f && f.project_id)) {
      projSel = h('select', { id: 'f_project' }, [h('option', { value: '', text: t('(kein Projekt)') })].concat(pickable.map(function (x) { return h('option', { value: x.id, text: x.team + ' / ' + x.name }); })));
      projSel.value = f ? (f.project_id || '') : preProject; if (f && f.my_role !== 'owner') projSel.disabled = true;
      nodes.push(h('label', { for: 'f_project', text: t('Projekt (optional)') }), projSel);
    }
    preProject = '';
    var out = h('div');
    nodes.push(h('div', { class: 'row' }, [
      h('button', { class: 'b', type: 'button', text: t('Speichern'), onclick: save }),
      h('button', { class: 'b s', type: 'button', text: t('Zurück'), onclick: list })
    ]), out);
    nodes.forEach(function (n) { view.appendChild(n); });

    function save() {
      var v = function (k) { return F[k].value; };
      var body = { action: 'save', id: f ? f.id : undefined, priv: { domains: v('domains') }, pub: {
        title: v('title'), question: v('question'), low_label: v('low_label'), high_label: v('high_label'), comment_on: F.comment_on.checked, comment_label: v('comment_label'),
        success: v('success'), emoji: v('emoji'), launcher: v('launcher'), color: v('color'), theme: v('theme'), position: v('position'), mode: v('mode'),
        popup_delay: +v('popup_delay') || 0, popup_button: F.popup_button.checked, scope: v('scope'), lang: v('lang') } };
      if (projSel && !projSel.disabled) body.project_id = projSel.value || null;
      api(body).then(function (j) {
        f = j.form; out.textContent = '';
        out.appendChild(h('div', { class: 'msg', role: 'status', text: t('Gespeichert! Unten siehst du die Vorschau (dort abgegebene Antworten werden wirklich gespeichert) und deinen Code.') }));
        out.appendChild(h('h2', { text: t('Dein Code') }));
        var code = h('pre', { text: snippet(f.id) }); out.appendChild(code);
        out.appendChild(h('button', { class: 'b s', type: 'button', text: t('Kopieren'), onclick: function (e) { try { navigator.clipboard.writeText(snippet(f.id)); e.target.textContent = t('Kopiert!'); } catch (x) { } } }));
        preview(f.id);
      }).catch(fail);
    }
  }

  function bar(n, max, label) {
    return h('div', { style: 'display:flex;align-items:center;gap:8px;margin:3px 0' }, [h('span', { text: label, style: 'width:24px;text-align:right' }),
      h('div', { style: 'flex:1;background:var(--border);height:14px;border-radius:7px;overflow:hidden' }, [h('div', { style: 'height:100%;background:var(--rust);width:' + (max ? Math.round(n / max * 100) : 0) + '%' })]), h('span', { text: String(n), style: 'width:36px' })]);
  }
  function results(f) {
    clear(); view.appendChild(h('div', { class: 'spinner', role: 'status' }));
    api({ action: 'votes', id: f.id }).then(function (j) {
      clear();
      view.appendChild(h('h1', { text: (f.pub.emoji || '⭐') + ' ' + (f.pub.title || f.pub.question || f.id) }));
      view.appendChild(h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t('Zurück'), onclick: list }), h('button', { class: 'b s', type: 'button', text: t('CSV exportieren'), onclick: function () { exportCsv(f); } })]));
      if (!j.total) { view.appendChild(h('p', { text: t('Noch keine Antworten.') })); view.appendChild(h('pre', { text: snippet(f.id) })); return; }
      view.appendChild(h('div', { class: 'card', style: 'text-align:center' }, [h('div', { text: 'NPS', style: 'font-weight:600' }), h('div', { text: (j.nps > 0 ? '+' : '') + j.nps, style: 'font-size:48px;font-weight:700;color:var(--rust)' }), h('div', { text: t('Antworten') + ': ' + j.total })]));
      view.appendChild(h('div', { class: 'card' }, [h('div', { text: t('Promoter (9–10)') + ': ' + j.promoters + ' (' + Math.round(j.promoters / j.total * 100) + '%)' }), h('div', { text: t('Passive (7–8)') + ': ' + j.passives + ' (' + Math.round(j.passives / j.total * 100) + '%)' }), h('div', { text: t('Detractors (0–6)') + ': ' + j.detractors + ' (' + Math.round(j.detractors / j.total * 100) + '%)' })]));
      view.appendChild(h('h2', { text: t('Verteilung' ) }));
      var max = Math.max.apply(null, j.dist), box = h('div'); j.dist.forEach(function (n, i) { box.appendChild(bar(n, max, String(i))); }); view.appendChild(box);
      view.appendChild(h('h2', { text: t('Kommentare') }));
      var lst = h('div'), more = h('button', { class: 'b s', type: 'button', text: t('Mehr laden') }), off = 0;
      view.appendChild(lst); view.appendChild(more);
      function add(items) {
        items.forEach(function (it) {
          var c = h('div', { class: 'card' }, [h('b', { text: String(it.score) }), ' · ' + new Date(it.created_at).toLocaleDateString(L) + (it.page_key ? ' · ' + it.page_key : ''), h('p', { text: it.comment })]);
          if (j.my_role !== 'viewer') c.appendChild(h('button', { class: 'b s', type: 'button', text: t('Löschen'), onclick: function () { if (confirm(t('Diesen Kommentar löschen?'))) api({ action: 'delvote', id: f.id, vote_id: it.id }).then(function () { results(f); }).catch(fail); } }));
          lst.appendChild(c);
        });
        off += items.length;
      }
      add(j.items); more.hidden = !j.more;
      more.onclick = function () { api({ action: 'votes', id: f.id, offset: off }).then(function (r) { add(r.items); more.hidden = !r.more; }).catch(fail); };
    }).catch(fail);
  }
  function exportCsv(f) {
    api({ action: 'export', id: f.id }).then(function (j) {
      var q = function (s) { s = s == null ? '' : String(s); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
      var csv = 'created_at,score,comment,page,lang\n' + j.rows.map(function (r) { return [r.created_at, r.score, q(r.comment), q(r.page_key), r.lang || ''].join(','); }).join('\n');
      var a = h('a', { href: URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })), download: 'nps-' + f.id + '.csv' }); document.body.appendChild(a); a.click(); a.remove();
    }).catch(fail);
  }

  var s = session();
  if (!s || !s.access_token) loginView(); else list();
})();

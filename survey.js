/* Karteikasten Developer · Builder für Formulare (mehrere Fragen) und Popups (mit Knöpfen) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/survey';
  var WIDGET = 'https://ajaronn.github.io/vokdev/survey-widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  function t(a) { return a ? a[I] : ''; }

  var X = {};
  function T3(k, d, e, p) { X[k] = [d, e, p]; }
  T3('title', 'Formulare & Popups', 'Forms & popups', 'Formulários e popups');
  T3('intro', 'Erstelle Formulare mit mehreren Fragen nacheinander (wie Google Forms) oder Popups mit Text, Bild und schönen Knöpfen statt rohen Links. Du fügst nur eine Zeile Code ein.', 'Create forms with several questions one after another (like Google Forms) or popups with text, image and nice buttons instead of raw links. You only paste one line of code.', 'Crie formulários com várias perguntas em sequência (como o Google Forms) ou popups com texto, imagem e botões bonitos em vez de links soltos. Você só cola uma linha de código.');
  T3('login', 'Bitte melde dich zuerst auf der Developer-Seite an.', 'Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.');
  T3('loginBtn', 'Zur Anmeldung', 'Go to sign-in', 'Ir para o login');
  T3('mine', 'Meine Formulare & Popups', 'My forms & popups', 'Meus formulários e popups'); T3('none', 'Noch nichts erstellt.', 'Nothing created yet.', 'Nada criado ainda.');
  T3('newForm', 'Neues Formular', 'New form', 'Novo formulário'); T3('newPopup', 'Neues Popup', 'New popup', 'Novo popup');
  T3('kForm', 'Formular', 'Form', 'Formulário'); T3('kPopup', 'Popup', 'Popup', 'Popup'); T3('qsW', 'Fragen', 'questions', 'perguntas');
  T3('edit', 'Bearbeiten', 'Edit', 'Editar'); T3('del', 'Löschen', 'Delete', 'Excluir'); T3('see', 'Ergebnisse ansehen', 'View results', 'Ver resultados');
  T3('delQ', 'Wirklich löschen? Alle Antworten gehen verloren.', 'Really delete? All answers will be lost.', 'Excluir mesmo? Todas as respostas serão perdidas.');
  T3('delR', 'Diese Antwort löschen?', 'Delete this answer?', 'Excluir esta resposta?');
  T3('save', 'Speichern', 'Save', 'Salvar'); T3('back', 'Zurück', 'Back', 'Voltar');
  T3('saved', 'Gespeichert! Unten steht dein Code.', 'Saved! Your code is below.', 'Salvo! Seu código está abaixo.');
  T3('embed', 'Dein Code für die Webseite', 'Your code for the website', 'Seu código para o site');
  T3('embedHint', 'Diese eine Zeile kurz vor </body> deiner Seite einfügen. Änderungen hier gelten sofort, der Code bleibt gleich.', 'Paste this single line just before </body> of your page. Changes here apply immediately, the code stays the same.', 'Cole esta linha logo antes de </body> da sua página. Alterações aqui valem na hora, o código continua igual.');
  T3('openHint', 'Eigener Knopf auf deiner Seite, der es öffnet:', 'Your own button on your page that opens it:', 'Seu próprio botão na página que abre isso:');
  T3('copy', 'Kopieren', 'Copy', 'Copiar'); T3('copied', 'Kopiert!', 'Copied!', 'Copiado!');
  T3('eMax', 'Maximal 10 Einträge pro Konto.', 'Maximum 10 entries per account.', 'Máximo de 10 itens por conta.');
  T3('eFail', 'Speichern fehlgeschlagen.', 'Saving failed.', 'Falha ao salvar.');
  T3('eOpts', 'Auswahlfragen brauchen mindestens 2 Optionen.', 'Choice questions need at least 2 options.', 'Perguntas de escolha precisam de pelo menos 2 opções.');
  T3('eQt', 'Jede Frage braucht einen Titel.', 'Every question needs a title.', 'Toda pergunta precisa de um título.');
  T3('eNoq', 'Bitte füge mindestens eine Frage hinzu.', 'Please add at least one question.', 'Adicione pelo menos uma pergunta.');
  T3('eDate', 'Bitte wähle ein Datum.', 'Please choose a date.', 'Escolha uma data.');
  T3('eEmpty', 'Das Popup braucht Titel, Text, Bild oder einen Knopf.', 'The popup needs a title, text, image or a button.', 'O popup precisa de título, texto, imagem ou botão.');
  T3('eNf', 'Nicht gefunden.', 'Not found.', 'Não encontrado.');
  T3('sContent', 'Inhalt', 'Content', 'Conteúdo'); T3('sQ', 'Fragen', 'Questions', 'Perguntas'); T3('sBtn', 'Knöpfe (statt roher Links)', 'Buttons (instead of raw links)', 'Botões (em vez de links soltos)');
  T3('sForm', 'Ablauf', 'Flow', 'Fluxo'); T3('sShow', 'Anzeige', 'Display', 'Exibição'); T3('sLook', 'Aussehen', 'Appearance', 'Aparência'); T3('sSec', 'Sicherheit', 'Security', 'Segurança');
  T3('fTitle', 'Titel', 'Title', 'Título'); T3('fDesc', 'Beschreibung (optional)', 'Description (optional)', 'Descrição (opcional)'); T3('fSuccess', 'Text nach dem Absenden (leer = Standard)', 'Text after submitting (empty = default)', 'Texto após enviar (vazio = padrão)');
  T3('fLayout', 'Darstellung', 'Layout', 'Exibição das perguntas'); T3('fProg', 'Fortschrittsbalken zeigen', 'Show progress bar', 'Mostrar barra de progresso'); T3('fScope', 'Antwort gilt für', 'Answer applies to', 'A resposta vale para');
  T3('qType', 'Fragetyp', 'Question type', 'Tipo de pergunta'); T3('qTitle', 'Frage', 'Question', 'Pergunta'); T3('qDesc', 'Hinweis (optional)', 'Hint (optional)', 'Dica (opcional)'); T3('qReq', 'Pflichtfrage', 'Required', 'Obrigatória');
  T3('qOpts', 'Optionen (eine pro Zeile, 2 bis 20)', 'Options (one per line, 2 to 20)', 'Opções (uma por linha, 2 a 20)'); T3('qOther', '„Andere“ mit eigener Antwort', '“Other” with own answer', '“Outra” com resposta própria'); T3('qOtherL', 'Name von „Andere“ (leer = Standard)', 'Name of “Other” (empty = default)', 'Nome de “Outra” (vazio = padrão)');
  T3('qMin', 'Startwert', 'Start value', 'Valor inicial'); T3('qMax', 'Endwert (2–10)', 'End value (2–10)', 'Valor final (2–10)'); T3('qMinL', 'Text links (z. B. „gar nicht“)', 'Left text (e.g. “not at all”)', 'Texto à esquerda (ex.: “nada”)'); T3('qMaxL', 'Text rechts (z. B. „sehr“)', 'Right text (e.g. “very”)', 'Texto à direita (ex.: “muito”)');
  T3('addQ', '+ Frage hinzufügen', '+ Add question', '+ Adicionar pergunta'); T3('up', '↑', '↑', '↑'); T3('down', '↓', '↓', '↓'); T3('dup', 'Duplizieren', 'Duplicate', 'Duplicar'); T3('rm', 'Entfernen', 'Remove', 'Remover');
  T3('pText', 'Text', 'Text', 'Texto'); T3('pImage', 'Bild-Adresse (https://…, optional)', 'Image address (https://…, optional)', 'Endereço da imagem (https://…, opcional)');
  T3('bLabel', 'Beschriftung', 'Label', 'Rótulo'); T3('bUrl', 'Link (https://…, mailto:, tel:)', 'Link (https://…, mailto:, tel:)', 'Link (https://…, mailto:, tel:)'); T3('bStyle', 'Stil', 'Style', 'Estilo'); T3('bNew', 'In neuem Tab öffnen', 'Open in new tab', 'Abrir em nova aba'); T3('addBtn', '+ Knopf hinzufügen (max. 6)', '+ Add button (max. 6)', '+ Adicionar botão (máx. 6)');
  T3('fPlace', 'Position des Popups', 'Popup position', 'Posição do popup'); T3('fFreq', 'Wie oft zeigen?', 'How often to show?', 'Com que frequência?'); T3('fFreqD', 'Wieder zeigen nach Tagen (1–365)', 'Show again after days (1–365)', 'Mostrar de novo após dias (1–365)');
  T3('fMode', 'Anzeige als', 'Show as', 'Exibir como'); T3('fTrig', 'Popup erscheint', 'Popup appears', 'O popup aparece'); T3('fDate', 'Ab diesem Tag', 'From this day', 'A partir deste dia'); T3('fDelay', 'Verzögerung in Sekunden (0–120)', 'Delay in seconds (0–120)', 'Atraso em segundos (0–120)');
  T3('fPopBtn', 'Nach dem Schließen kleinen Knopf zum späteren Öffnen zeigen', 'After closing, show a small button to open it later', 'Após fechar, mostrar um botão pequeno para abrir depois');
  T3('fBump', 'Allen Besuchern erneut zeigen (zählt als neu)', 'Show to all visitors again (counts as new)', 'Mostrar de novo a todos os visitantes (conta como novo)');
  T3('fEmoji', 'Emoji', 'Emoji', 'Emoji'); T3('fLaunch', 'Text am Knopf (optional)', 'Button text (optional)', 'Texto do botão (opcional)'); T3('fColor', 'Hauptfarbe', 'Main color', 'Cor principal'); T3('fTheme', 'Design', 'Theme', 'Tema'); T3('fPos', 'Position des Knopfes', 'Button position', 'Posição do botão');
  T3('fFont', 'Schrift', 'Font', 'Fonte'); T3('fRad', 'Rundung (0–28)', 'Roundness (0–28)', 'Arredondamento (0–28)'); T3('fLang', 'Sprache', 'Language', 'Idioma');
  T3('fDom', 'Erlaubte Domains (kommagetrennt, leer = alle), z. B. meineseite.de', 'Allowed domains (comma-separated, empty = all), e.g. mysite.com', 'Domínios permitidos (separados por vírgula, vazio = todos), ex.: meusite.com.br');
  T3('pvOn', 'Live-Vorschau einschalten', 'Turn on live preview', 'Ligar prévia ao vivo'); T3('pvOff', 'Live-Vorschau ausschalten', 'Turn off live preview', 'Desligar prévia ao vivo');
  T3('pvHint', 'Die Vorschau erscheint auf dieser Seite und folgt deinen Eingaben. Dort abgesendete Antworten werden nicht gespeichert.', 'The preview appears on this page and follows your input. Answers submitted there are not saved.', 'A prévia aparece nesta página e acompanha suas entradas. Respostas enviadas lá não são salvas.');
  T3('rTitle', 'Ergebnisse', 'Results', 'Resultados'); T3('rNone', 'Noch keine Antworten.', 'No answers yet.', 'Ainda sem respostas.'); T3('rTotal', 'Antworten gesamt', 'Total answers', 'Total de respostas'); T3('rOther', 'Andere (eigene Antworten)', 'Other (own answers)', 'Outra (respostas próprias)');
  T3('avg', 'Durchschnitt', 'Average', 'Média'); T3('more', 'Mehr laden', 'Load more', 'Carregar mais'); T3('rAll', 'Einzelne Antworten', 'Individual answers', 'Respostas individuais'); T3('exp', 'Export', 'Export', 'Exportar'); T3('csv', 'CSV herunterladen', 'Download CSV', 'Baixar CSV');
  X.ty = { short: ['Kurze Antwort', 'Short answer', 'Resposta curta'], long: ['Langer Text', 'Paragraph', 'Parágrafo'], single: ['Einzelauswahl (Radio)', 'Multiple choice (one)', 'Múltipla escolha (uma)'], multi: ['Mehrfachauswahl (Haken)', 'Checkboxes (several)', 'Caixas de seleção (várias)'], dropdown: ['Dropdown', 'Dropdown', 'Lista suspensa'], scale: ['Skala (z. B. 1–5)', 'Linear scale (e.g. 1–5)', 'Escala (ex.: 1–5)'], rating: ['Sterne (1–5)', 'Stars (1–5)', 'Estrelas (1–5)'], date: ['Datum', 'Date', 'Data'], number: ['Zahl', 'Number', 'Número'], email: ['E-Mail', 'Email', 'E-mail'] };
  X.o = {
    auto: ['Automatisch', 'Automatic', 'Automático'], light: ['Hell', 'Light', 'Claro'], dark: ['Dunkel', 'Dark', 'Escuro'], right: ['Rechts', 'Right', 'Direita'], left: ['Links', 'Left', 'Esquerda'], system: ['System', 'System', 'Sistema'], serif: ['Serif', 'Serif', 'Serifa'], mono: ['Monospace', 'Monospace', 'Monoespaçada'],
    site: ['Ganze Webseite (eine Antwort pro Gerät)', 'Whole website (one answer per device)', 'Site inteiro (uma resposta por dispositivo)'], pageScope: ['Pro Unterseite', 'Per page', 'Por página'],
    steps: ['Eine Frage nach der anderen', 'One question at a time', 'Uma pergunta por vez'], pageAll: ['Alle Fragen auf einer Seite', 'All questions on one page', 'Todas as perguntas numa página'],
    button: ['Knopf (Besucher öffnen selbst)', 'Button (visitors open it themselves)', 'Botão (visitantes abrem sozinhos)'], popup: ['Popup (öffnet sich automatisch)', 'Popup (opens automatically)', 'Popup (abre automaticamente)'],
    next_visit: ['Beim nächsten Öffnen der Webseite', 'Next time the website is opened', 'Na próxima abertura do site'], tdate: ['Ab einem bestimmten Tag', 'From a certain day', 'A partir de um certo dia'],
    center: ['Mitte (mit Hintergrund)', 'Center (with backdrop)', 'Centro (com fundo)'], br: ['Unten rechts', 'Bottom right', 'Embaixo à direita'], bl: ['Unten links', 'Bottom left', 'Embaixo à esquerda'], top: ['Oben als Leiste', 'Top banner', 'Faixa no topo'],
    once: ['Nur einmal pro Gerät', 'Only once per device', 'Só uma vez por dispositivo'], days: ['Wieder nach X Tagen', 'Again after X days', 'De novo após X dias'], always: ['Bei jedem Seitenaufruf', 'On every page load', 'A cada carregamento de página'],
    filled: ['Gefüllt', 'Filled', 'Preenchido'], outline: ['Umrandet', 'Outlined', 'Contornado'], soft: ['Sanft', 'Soft', 'Suave'], de: ['Deutsch', 'Deutsch', 'Deutsch'], en: ['English', 'English', 'English'], 'pt-BR': ['Português (BR)', 'Português (BR)', 'Português (BR)']
  };
  function OP(keys) { return keys.map(function (k) { return [k, X.o[k]]; }); }
  T3('project', 'Projekt (optional)', 'Project (optional)', 'Projeto (opcional)'); T3('noProject', '(kein Projekt)', '(no project)', '(sem projeto)'); T3('eForbid', 'Dafür fehlt dir die Berechtigung.', 'You do not have permission for that.', 'Você não tem permissão para isso.');
  var ERR = { forbidden: X.eForbid, max_forms: X.eMax, options: X.eOpts, qtitle: X.eQt, noq: X.eNoq, date: X.eDate, empty: X.eEmpty, notfound: X.eNf };

  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { var v = attrs[k]; if (v == null || v === false) return; if (k === 'text') e.textContent = v; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v); });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function session() { try { return JSON.parse(localStorage.getItem('kkdev_session') || 'null'); } catch (e) { return null; } }
  function call(body) {
    var s = session();
    if (!s || !s.access_token || (s.expires_at && s.expires_at < Date.now())) return Promise.reject({ auth: true });
    return fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + s.access_token }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (r.status === 401) throw { auth: true }; if (!r.ok) throw j; return j; }); });
  }
  function mount(nodes) { view.textContent = ''; nodes.forEach(function (n) { view.appendChild(n); }); window.scrollTo(0, 0); }
  function msg(text, err) { var m = h('div', { class: 'msg' + (err ? ' err' : ''), role: 'status', text: text }); view.insertBefore(m, view.firstChild); window.scrollTo(0, 0); setTimeout(function () { m.remove(); }, 7000); }
  function loginView() { mount([h('h1', { text: t(X.title) }), h('p', { text: t(X.login) }), h('a', { href: 'index.html#/apps', text: t(X.loginBtn), style: 'display:inline-block;padding:10px 16px;border-radius:8px;background:var(--rust);color:var(--rust-contrast);text-decoration:none' })]); }
  function fail(e) { if (e && e.auth) return loginView(); msg(t(ERR[e && e.error] || X.eFail), true); }

  var live = null, uidc = 0, PROJ = [], preProject = '';
  var DEEP = { project: (location.search.match(/[?&]project=([0-9a-f-]{36})/) || [])[1], edit: (location.search.match(/[?&]edit=([0-9a-z]{4,20})/) || [])[1], kind: (location.search.match(/[?&]kind=(form|popup)/) || [])[1] };
  function projName(a) { var p = a.project_id && PROJ.filter(function (x) { return x.id === a.project_id; })[0]; return p ? ' · ' + p.team + ' / ' + p.name : ''; }
  function leave() { live = null; window.KKSurvey.destroy(); }
  function copyBtn(code) { return h('button', { class: 'b s', type: 'button', text: t(X.copy), onclick: function (e) { var b = e.target; (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { b.textContent = t(X.copied); }).catch(function () { }); } }); }

  /* ---------- Liste ---------- */
  function list() {
    leave();
    call({ action: 'list' }).then(function (j) {
      PROJ = j.projects || [];
      if (DEEP.edit || DEEP.project) {
        var dp = DEEP; DEEP = {}; try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* egal */ }
        var fa = dp.edit && j.items.filter(function (x) { return x.id === dp.edit; })[0];
        if (fa && fa.my_role !== 'viewer') { edit(fa); return; }
        if (dp.project && !dp.edit) { preProject = dp.project; edit(null, dp.kind || 'form'); return; }
      }
      var cards = j.items.map(function (it) {
        var isF = it.kind === 'form';
        return h('div', { class: 'card' }, [h('b', { text: it.pub.title || it.id }), h('div', { class: 'small muted', text: it.id + ' · ' + t(isF ? X.kForm : X.kPopup) + (isF ? ' · ' + it.pub.questions.length + ' ' + t(X.qsW) : '') + (it.priv.domains ? ' · ' + it.priv.domains : '') + projName(it) }), h('div', { class: 'row' }, [
          isF ? h('button', { class: 'b', type: 'button', text: t(X.see), onclick: function () { results(it); } }) : null,
          it.my_role === 'viewer' ? null : h('button', { class: isF ? 'b s' : 'b', type: 'button', text: t(X.edit), onclick: function () { edit(it); } }),
          (!it.my_role || it.my_role === 'owner') ? h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delQ))) call({ action: 'delete', id: it.id }).then(list).catch(fail); } }) : null])]);
      });
      mount([h('h1', { text: t(X.title) }), h('p', { class: 'muted', text: t(X.intro) }), guide(), h('h2', { text: t(X.mine) })]
        .concat(cards.length ? cards : [h('p', { class: 'muted', text: t(X.none) })])
        .concat([h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newForm), onclick: function () { edit(null, 'form'); } }), h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newPopup), onclick: function () { edit(null, 'popup'); } })])]));
    }).catch(fail);
  }

  /* ---------- Ergebnisse ---------- */
  function download(name, mime, text) { var u = URL.createObjectURL(new Blob([text], { type: mime })); var a = h('a', { href: u, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 2000); }
  function csvCell(v) { v = v == null ? '' : Array.isArray(v) ? v.join(' | ') : String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[";,\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function bars(rows, total) {
    return h('div', null, rows.map(function (r) {
      var p = total ? Math.round(r.n / total * 100) : 0;
      return h('div', { style: 'margin:8px 0' }, [h('div', { style: 'display:flex;justify-content:space-between;gap:8px' }, [h('span', { text: r.text, style: 'overflow-wrap:anywhere' }), h('span', { text: p + '% · ' + r.n })]),
        h('div', { style: 'height:8px;border-radius:4px;background:var(--border);overflow:hidden;margin-top:3px' }, [h('div', { style: 'height:100%;width:' + p + '%;background:var(--rust)' })])]);
    }));
  }
  function results(it) {
    leave();
    var head = h('p', { class: 'muted' }), box = h('div'), lst = h('div'), off = 0, more = h('button', { class: 'b s', type: 'button', text: t(X.more), hidden: true });
    call({ action: 'results', id: it.id }).then(function (j) {
      head.textContent = j.total ? t(X.rTotal) + ': ' + j.total : t(X.rNone);
      j.qs.forEach(function (r, i) {
        var q = it.pub.questions[i]; if (!q) return;
        box.appendChild(h('h3', { text: q.title + ' (' + r.n + ')' }));
        if (r.counts) { var rows = r.counts.slice(); if (r.other) rows.push({ text: t(X.rOther), n: r.other }); box.appendChild(bars(rows, r.n)); (r.others || []).forEach(function (x) { box.appendChild(h('div', { class: 'small muted', text: '• ' + x, style: 'overflow-wrap:anywhere' })); }); }
        else if (r.dist) { box.appendChild(bars(r.dist, r.n)); if (r.avg != null) box.appendChild(h('p', { text: t(X.avg) + ': ' + r.avg })); }
        else if (r.avg != null) box.appendChild(h('p', { text: t(X.avg) + ': ' + r.avg }));
        else (r.texts || []).forEach(function (x) { box.appendChild(h('div', { class: 'card', text: x, style: 'overflow-wrap:anywhere;white-space:pre-wrap' })); });
      });
    }).catch(fail);
    function load() {
      call({ action: 'answers', id: it.id, offset: off }).then(function (j) {
        j.items.forEach(function (r) {
          var c = h('div', { class: 'card' }, [h('div', { class: 'small muted', text: new Date(r.created_at).toLocaleString(L) + (r.page_key ? ' · ' + r.page_key : '') })]);
          it.pub.questions.forEach(function (q) { var v = r.answers[q.id]; if (v == null) return; c.appendChild(h('div', { style: 'overflow-wrap:anywhere' }, [h('b', { text: q.title + ': ' }), h('span', { text: Array.isArray(v) ? v.join(', ') : String(v) })])); });
          if (it.my_role !== 'viewer') c.appendChild(h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delR))) call({ action: 'delanswer', id: it.id, answer_id: r.id }).then(function () { c.remove(); }).catch(fail); } })]));
          lst.appendChild(c);
        });
        off += j.items.length; more.hidden = !j.more;
      }).catch(fail);
    }
    more.onclick = load;
    mount([h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: t(X.rTitle) + ': ' + (it.pub.title || it.id) }), head, box,
      h('h2', { text: t(X.exp) }), h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.csv), onclick: function () {
        call({ action: 'export', id: it.id }).then(function (j) {
          var sep = L === 'en' ? ',' : ';', head2 = ['created_at', 'page_key', 'lang'].concat(it.pub.questions.map(function (q) { return q.title; }));
          var lines = [head2.map(csvCell).join(sep)].concat(j.rows.map(function (r) { return [r.created_at, r.page_key, r.lang].concat(it.pub.questions.map(function (q) { return r.answers[q.id]; })).map(csvCell).join(sep); }));
          download('formular-' + it.id + '-' + new Date().toISOString().slice(0, 10) + '.csv', 'text/csv;charset=utf-8', '\ufeff' + lines.join('\r\n'));
        }).catch(fail);
      } })]), h('h2', { text: t(X.rAll) }), lst, h('div', { class: 'row' }, [more])]);
    load();
  }

  /* ---------- Editor ---------- */
  function newQ(type) { return { id: Math.random().toString(36).slice(2, 8), type: type || 'short', title: '', desc: '', required: false, options: ['', ''], other: false, other_label: '', min: 1, max: 5, min_label: '', max_label: '' }; }
  function base(kind) {
    return { title: '', emoji: kind === 'popup' ? '📣' : '📝', launcher: '', color: '#A8442E', theme: 'auto', position: 'right', font: 'system', radius: 14, lang: 'auto', mode: kind === 'popup' ? 'popup' : 'button', trigger: 'next_visit', popup_date: '', popup_delay: 0, popup_button: true };
  }
  function defaults(kind) {
    var p = base(kind);
    if (kind === 'popup') { p.text = ''; p.image = ''; p.place = 'center'; p.freq = 'once'; p.freq_days = 7; p.buttons = [{ label: '', url: 'https://', style: 'filled', new: true }]; }
    else { p.description = ''; p.success = ''; p.layout = 'steps'; p.show_progress = true; p.scope = 'site'; p.questions = [newQ('single')]; }
    return p;
  }

  function edit(it, kind) {
    leave();
    var id = it ? it.id : '', kd = it ? it.kind : kind, P = it ? JSON.parse(JSON.stringify(it.pub)) : defaults(kd), V = it ? { domains: it.priv.domains || '' } : { domains: '' }, bump = { v: false };
    if (P.questions) P.questions.forEach(function (q) { if (q.options) { while (q.options.length < 2) q.options.push(''); } else q.options = ['', '']; });
    var nodes = [], visFns = [];
    function changed() { visFns.forEach(function (f) { f(); }); if (live) live(); }

    function F(obj, key, label, type, opts, mn, mx) {
      var fid = 'f' + (++uidc), el;
      if (type === 'checkbox') { el = h('input', { id: fid, type: 'checkbox' }); el.checked = !!obj[key]; el.onchange = function () { obj[key] = el.checked; changed(); }; return h('div', null, [h('label', null, [el, ' ' + t(label)])]); }
      if (type === 'select') { el = h('select', { id: fid }, opts.map(function (o) { return h('option', { value: o[0], text: t(o[1]) }); })); el.value = obj[key]; el.onchange = function () { obj[key] = el.value; changed(); }; }
      else if (type === 'textarea') { el = h('textarea', { id: fid }); el.value = obj[key] || ''; el.oninput = function () { obj[key] = el.value; changed(); }; }
      else { el = h('input', { id: fid, type: type, min: mn, max: mx, autocomplete: 'off' }); el.value = obj[key] == null ? '' : obj[key]; el.oninput = function () { obj[key] = type === 'number' ? Number(el.value) : el.value; changed(); }; }
      return h('div', null, [h('label', { for: fid, text: t(label) }), el]);
    }
    function add(n) { nodes.push(n); }
    function vis(box, fn) { visFns.push(function () { box.hidden = !fn(); }); box.hidden = !fn(); return box; }

    add(h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]));
    add(h('h1', { text: it ? (P.title || id) : t(kd === 'popup' ? X.newPopup : X.newForm) }));
    add(h('h2', { text: t(X.sContent) }));
    add(F(P, 'title', X.fTitle, 'text'));

    if (kd === 'popup') {
      add(F(P, 'text', X.pText, 'textarea')); add(F(P, 'image', X.pImage, 'url'));
      add(h('h2', { text: t(X.sBtn) }));
      var bBox = h('div');
      var drawB = function () {
        bBox.textContent = '';
        P.buttons.forEach(function (b, i) {
          var c = h('div', { class: 'card' });
          c.appendChild(F(b, 'label', X.bLabel, 'text')); c.appendChild(F(b, 'url', X.bUrl, 'url')); c.appendChild(F(b, 'style', X.bStyle, 'select', OP(['filled', 'outline', 'soft']))); c.appendChild(F(b, 'new', X.bNew, 'checkbox'));
          c.appendChild(h('div', { class: 'row' }, [
            h('button', { class: 'b s', type: 'button', text: t(X.up), disabled: i === 0, onclick: function () { P.buttons.splice(i - 1, 0, P.buttons.splice(i, 1)[0]); drawB(); changed(); } }),
            h('button', { class: 'b s', type: 'button', text: t(X.down), disabled: i === P.buttons.length - 1, onclick: function () { P.buttons.splice(i + 1, 0, P.buttons.splice(i, 1)[0]); drawB(); changed(); } }),
            h('button', { class: 'b s', type: 'button', text: t(X.rm), onclick: function () { P.buttons.splice(i, 1); drawB(); changed(); } })]));
          bBox.appendChild(c);
        });
        if (P.buttons.length < 6) bBox.appendChild(h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.addBtn), onclick: function () { P.buttons.push({ label: '', url: 'https://', style: 'filled', new: true }); drawB(); changed(); } })]));
      };
      X.bLabel = X.bLabel || ['Beschriftung', 'Label', 'Rótulo'];
      drawB(); add(bBox);
    } else {
      add(F(P, 'description', X.fDesc, 'textarea'));
      add(h('h2', { text: t(X.sQ) }));
      var qBox = h('div');
      var drawQ = function () {
        qBox.textContent = '';
        P.questions.forEach(function (q, i) {
          var c = h('div', { class: 'card' }), isCh = ['single', 'multi', 'dropdown'].indexOf(q.type) >= 0;
          var ty = F(q, 'type', X.qType, 'select', Object.keys(X.ty).map(function (k) { return [k, X.ty[k]]; }));
          ty.querySelector('select').addEventListener('change', function () { drawQ(); });
          c.appendChild(h('b', { text: (i + 1) + '.' })); c.appendChild(ty); c.appendChild(F(q, 'title', X.qTitle, 'text')); c.appendChild(F(q, 'desc', X.qDesc, 'text')); c.appendChild(F(q, 'required', X.qReq, 'checkbox'));
          if (isCh) {
            var ta = h('textarea', { 'aria-label': t(X.qOpts) }); ta.value = q.options.join('\n'); ta.oninput = function () { q.options = ta.value.split('\n'); changed(); };
            c.appendChild(h('label', { text: t(X.qOpts) })); c.appendChild(ta);
            if (q.type !== 'dropdown') { c.appendChild(F(q, 'other', X.qOther, 'checkbox')); c.appendChild(F(q, 'other_label', X.qOtherL, 'text')); }
          }
          if (q.type === 'scale') { c.appendChild(F(q, 'min', X.qMin, 'number', null, 0, 1)); c.appendChild(F(q, 'max', X.qMax, 'number', null, 2, 10)); c.appendChild(F(q, 'min_label', X.qMinL, 'text')); c.appendChild(F(q, 'max_label', X.qMaxL, 'text')); }
          c.appendChild(h('div', { class: 'row' }, [
            h('button', { class: 'b s', type: 'button', text: t(X.up), disabled: i === 0, onclick: function () { P.questions.splice(i - 1, 0, P.questions.splice(i, 1)[0]); drawQ(); changed(); } }),
            h('button', { class: 'b s', type: 'button', text: t(X.down), disabled: i === P.questions.length - 1, onclick: function () { P.questions.splice(i + 1, 0, P.questions.splice(i, 1)[0]); drawQ(); changed(); } }),
            h('button', { class: 'b s', type: 'button', text: t(X.dup), disabled: P.questions.length >= 30, onclick: function () { var cp = JSON.parse(JSON.stringify(q)); cp.id = Math.random().toString(36).slice(2, 8); P.questions.splice(i + 1, 0, cp); drawQ(); changed(); } }),
            h('button', { class: 'b s', type: 'button', text: t(X.rm), disabled: P.questions.length <= 1, onclick: function () { P.questions.splice(i, 1); drawQ(); changed(); } })]));
          qBox.appendChild(c);
        });
        qBox.appendChild(h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.addQ), disabled: P.questions.length >= 30, onclick: function () { P.questions.push(newQ('single')); drawQ(); changed(); } })]));
      };
      drawQ(); add(qBox);
      add(h('h2', { text: t(X.sForm) }));
      add(F(P, 'layout', X.fLayout, 'select', [['steps', X.o.steps], ['page', X.o.pageAll]]));
      add(vis(h('div', null, [F(P, 'show_progress', X.fProg, 'checkbox')]), function () { return P.layout === 'steps'; }));
      add(F(P, 'scope', X.fScope, 'select', [['site', X.o.site], ['page', X.o.pageScope]])); add(F(P, 'success', X.fSuccess, 'text'));
    }

    add(h('h2', { text: t(X.sShow) }));
    if (kd === 'popup') { add(F(P, 'place', X.fPlace, 'select', OP(['center', 'br', 'bl', 'top']))); }
    add(F(P, 'mode', X.fMode, 'select', OP(['button', 'popup'])));
    var popBox = h('div'), dateBox = h('div'), fdBox = h('div');
    popBox.appendChild(F(P, 'trigger', X.fTrig, 'select', [['next_visit', X.o.next_visit], ['date', X.o.tdate]]));
    dateBox.appendChild(F(P, 'popup_date', X.fDate, 'date')); popBox.appendChild(vis(dateBox, function () { return P.trigger === 'date'; }));
    popBox.appendChild(F(P, 'popup_delay', X.fDelay, 'number', null, 0, 120));
    if (kd === 'popup') { popBox.appendChild(F(P, 'freq', X.fFreq, 'select', OP(['once', 'days', 'always']))); fdBox.appendChild(F(P, 'freq_days', X.fFreqD, 'number', null, 1, 365)); popBox.appendChild(vis(fdBox, function () { return P.freq === 'days'; })); }
    popBox.appendChild(F(P, 'popup_button', X.fPopBtn, 'checkbox'));
    add(vis(popBox, function () { return P.mode === 'popup'; }));
    if (it) add(F(bump, 'v', X.fBump, 'checkbox'));

    add(h('h2', { text: t(X.sLook) }));
    add(F(P, 'emoji', X.fEmoji, 'text')); add(F(P, 'launcher', X.fLaunch, 'text')); add(F(P, 'color', X.fColor, 'color'));
    add(F(P, 'theme', X.fTheme, 'select', OP(['auto', 'light', 'dark']))); add(F(P, 'position', X.fPos, 'select', OP(['right', 'left']))); add(F(P, 'font', X.fFont, 'select', OP(['system', 'serif', 'mono'])));
    add(F(P, 'radius', X.fRad, 'number', null, 0, 28)); add(F(P, 'lang', X.fLang, 'select', OP(['auto', 'de', 'en', 'pt-BR'])));
    add(h('h2', { text: t(X.sSec) })); add(F(V, 'domains', X.fDom, 'text'));
    var projSel = null, pickable = PROJ.filter(function (p) { return p.role >= 2; });
    if (pickable.length || (it && it.project_id)) {
      add(h('label', { text: t(X.project), for: 'f_project' }));
      projSel = h('select', { id: 'f_project' }, [h('option', { value: '', text: t(X.noProject) })].concat(PROJ.filter(function (p) { return p.role >= 2 || (it && p.id === it.project_id); }).map(function (p) { return h('option', { value: p.id, text: p.team + ' / ' + p.name }); })));
      projSel.value = it ? (it.project_id || '') : preProject;
      if (it && it.my_role && it.my_role !== 'owner') projSel.disabled = true;
      add(projSel);
    }
    preProject = '';

    /* Live-Vorschau */
    function previewCfg() {
      var c = JSON.parse(JSON.stringify(P));
      if (c.questions) c.questions = c.questions.map(function (q, i) {
        q.title = q.title.trim() || t(X.qTitle) + ' ' + (i + 1);
        if (['single', 'multi', 'dropdown'].indexOf(q.type) >= 0) { q.options = q.options.map(function (o) { return o.trim(); }).filter(Boolean); while (q.options.length < 2) q.options.push(t(X.qOpts).split(' ')[0] + ' ' + (q.options.length + 1)); }
        return q;
      });
      if (c.buttons) c.buttons = c.buttons.filter(function (b) { return b.label && /^(https?:\/\/|mailto:|tel:)/i.test(b.url); });
      if (kd === 'popup' && !c.title && !c.text && !(c.buttons || []).length) c.text = '…';
      return c;
    }
    var pvOn = false, tm = null, pvBtn = h('button', { class: 'b s', type: 'button', text: t(X.pvOn) });
    function render() { try { window.KKSurvey.mount({ cfg: previewCfg(), kind: kd, lang: L, asAuto: true }); } catch (e) { /* egal */ } }
    pvBtn.onclick = function () {
      pvOn = !pvOn; pvBtn.textContent = t(pvOn ? X.pvOff : X.pvOn);
      if (pvOn) { live = function () { clearTimeout(tm); tm = setTimeout(render, 300); }; render(); } else { live = null; window.KKSurvey.destroy(); }
    };
    add(h('div', { class: 'row' }, [pvBtn])); add(h('p', { class: 'muted small', text: t(X.pvHint) }));

    var out = h('div');
    function embed(newId) {
      out.textContent = '';
      var code = '<script src="' + WIDGET + '" data-survey="' + newId + '" defer></' + 'script>';
      out.appendChild(h('h2', { text: t(X.embed) })); out.appendChild(h('p', { class: 'muted', text: t(X.embedHint) })); out.appendChild(h('pre', { text: code })); out.appendChild(copyBtn(code));
      var own = '<button onclick="KKSurvey.open()">' + (kd === 'popup' ? 'Info' : 'Feedback') + '</button>';
      out.appendChild(h('p', { class: 'muted small', text: t(X.openHint) })); out.appendChild(h('pre', { text: own }));
    }
    function validate() {
      if (kd === 'popup') return '';
      for (var i = 0; i < P.questions.length; i++) {
        var q = P.questions[i]; if (!q.title.trim()) return X.eQt;
        if (['single', 'multi', 'dropdown'].indexOf(q.type) >= 0 && q.options.map(function (o) { return o.trim(); }).filter(Boolean).length < 2) return X.eOpts;
      }
      return '';
    }
    add(h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: t(X.save), onclick: function () {
      var bad = validate(); if (bad) return msg(t(bad), true);
      var pub = JSON.parse(JSON.stringify(P));
      if (pub.questions) pub.questions.forEach(function (q) { q.options = (q.options || []).map(function (o) { return o.trim(); }).filter(Boolean); });
      var body = { action: 'save', id: id, kind: kd, pub: pub, priv: V, bump: bump.v };
      if (projSel && !projSel.disabled) body.project_id = projSel.value || null;
      call(body).then(function (j) { it = j.item; id = it.id; msg(t(X.saved)); embed(id); }).catch(fail);
    } })]));
    add(out);
    if (it) embed(id);
    mount(nodes);
  }

  /* ---------- Anleitung ---------- */
  T3('guideTitle', 'Anleitung', 'Guide', 'Guia');
  var G = [
    { open: 1, title: ['So funktioniert es', 'How it works', 'Como funciona'], steps: [
      ['„Neues Formular“ oder „Neues Popup“ tippen und ausfüllen. Beim Formular fügst du beliebig viele Fragen hinzu (Kurztext, Langtext, Einzel- oder Mehrfachauswahl, Dropdown, Skala, Sterne, Datum, Zahl, E-Mail).', 'Tap “New form” or “New popup” and fill it in. In a form you add as many questions as you like (short text, paragraph, single or multiple choice, dropdown, scale, stars, date, number, email).', 'Toque em “Novo formulário” ou “Novo popup” e preencha. No formulário você adiciona quantas perguntas quiser (texto curto, parágrafo, escolha única ou múltipla, lista, escala, estrelas, data, número, e-mail).'],
      ['Beim Popup legst du Knöpfe an: Beschriftung, Link und Stil. Besucher sehen schöne Knöpfe statt roher Links.', 'In a popup you add buttons: label, link and style. Visitors see nice buttons instead of raw links.', 'No popup você cria botões: rótulo, link e estilo. Os visitantes veem botões bonitos em vez de links soltos.'],
      ['Speichern, dann den Code kopieren und kurz vor </body> deiner Webseite einfügen. Mit der Live-Vorschau siehst du alles schon beim Bearbeiten.', 'Save, then copy the code and paste it just before </body> on your website. With the live preview you see everything while editing.', 'Salve, copie o código e cole logo antes de </body> no seu site. Com a prévia ao vivo você vê tudo enquanto edita.']] },
    { title: ['Anzeige & Wiederholung', 'Display & repeat', 'Exibição e repetição'], steps: [
      ['Knopf: Besucher öffnen selbst. Popup: öffnet sich automatisch (nächster Besuch oder ab einem Tag, mit Verzögerung).', 'Button: visitors open it themselves. Popup: opens automatically (next visit or from a day, with delay).', 'Botão: o visitante abre sozinho. Popup: abre automaticamente (próxima visita ou a partir de um dia, com atraso).'],
      ['Beim Popup bestimmst du, wie oft es erscheint: einmal, nach X Tagen oder bei jedem Aufruf. „Allen Besuchern erneut zeigen“ setzt es zurück.', 'For a popup you choose how often it appears: once, after X days or on every load. “Show to all visitors again” resets it.', 'No popup você define a frequência: uma vez, após X dias ou a cada carregamento. “Mostrar de novo a todos” reinicia.'],
      ['Eigener Knopf auf deiner Seite: <button onclick="KKSurvey.open()">…</button>', 'Own button on your page: <button onclick="KKSurvey.open()">…</button>', 'Botão próprio na página: <button onclick="KKSurvey.open()">…</button>']] }
  ];
  function guide() {
    var box = h('div', null, [h('h2', { text: t(X.guideTitle) })]);
    G.forEach(function (g) { var d = h('details', { open: g.open ? true : null }, [h('summary', { text: t(g.title) })]), ol = h('ol'); g.steps.forEach(function (s) { ol.appendChild(h('li', { text: t(s) })); }); d.appendChild(ol); box.appendChild(d); });
    return box;
  }

  var s = session();
  if (!s || !s.access_token) loginView(); else list();
})();

/* Karteikasten Developer · Umfrage-Builder (nutzt die Anmeldung der Developer-Seite) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/poll';
  var WIDGET = 'https://ajaronn.github.io/vokdev/poll-widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  function t(a) { return a[I]; }

  var X = {
    title: ['Umfrage erstellen', 'Create a poll', 'Criar enquete'],
    intro: ['Besucher deiner Webseite wählen eine von 2 bis 10 Optionen (optional plus „Andere“ mit eigener Antwort). Als Knopf oder als Popup. Du fügst nur eine Zeile Code ein und siehst die Ergebnisse hier.', 'Visitors of your website pick one of 2 to 10 options (optionally plus “Other” with their own answer). As a button or as a popup. You only paste one line of code and see the results here.', 'Os visitantes do seu site escolhem uma de 2 a 10 opções (opcionalmente mais “Outra” com resposta própria). Como botão ou como popup. Você só cola uma linha de código e vê os resultados aqui.'],
    login: ['Bitte melde dich zuerst auf der Developer-Seite an.', 'Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.'],
    loginBtn: ['Zur Anmeldung', 'Go to sign-in', 'Ir para o login'],
    mine: ['Meine Umfragen', 'My polls', 'Minhas enquetes'], none: ['Noch keine Umfragen.', 'No polls yet.', 'Nenhuma enquete ainda.'],
    newA: ['Neue Umfrage', 'New poll', 'Nova enquete'], edit: ['Bearbeiten', 'Edit', 'Editar'], del: ['Löschen', 'Delete', 'Excluir'], see: ['Ergebnisse ansehen', 'View results', 'Ver resultados'],
    delQ: ['Diese Umfrage wirklich löschen? Alle Stimmen gehen verloren.', 'Really delete this poll? All votes will be lost.', 'Excluir esta enquete? Todos os votos serão perdidos.'],
    delR: ['Diese Antwort löschen?', 'Delete this answer?', 'Excluir esta resposta?'],
    save: ['Speichern', 'Save', 'Salvar'], back: ['Zurück', 'Back', 'Voltar'],
    saved: ['Gespeichert! Unten siehst du die Vorschau (dort abgegebene Stimmen werden wirklich gespeichert) und deinen Code.', 'Saved! Below you see the preview (votes cast there are really saved) and your code.', 'Salvo! Abaixo você vê a prévia (votos dados lá são realmente salvos) e seu código.'],
    embed: ['Dein Code für die Webseite', 'Your code for the website', 'Seu código para o site'],
    embedHint: ['Diese eine Zeile in den HTML-Code deiner Seite einfügen (kurz vor </body>).', 'Paste this single line into your page’s HTML (just before </body>).', 'Cole esta linha no HTML do seu site (logo antes de </body>).'],
    copy: ['Kopieren', 'Copy', 'Copiar'], copied: ['Kopiert!', 'Copied!', 'Copiado!'],
    eAuth: ['Sitzung abgelaufen. Bitte melde dich neu an.', 'Session expired. Please sign in again.', 'Sessão expirada. Entre novamente.'],
    eMax: ['Maximal 5 Umfragen pro Konto.', 'Maximum 5 polls per account.', 'Máximo de 5 enquetes por conta.'],
    eFail: ['Speichern fehlgeschlagen.', 'Saving failed.', 'Falha ao salvar.'],
    eOpts: ['Bitte gib mindestens 2 Optionen an.', 'Please enter at least 2 options.', 'Informe pelo menos 2 opções.'],
    eQ: ['Bitte gib eine Frage ein.', 'Please enter a question.', 'Informe uma pergunta.'],
    eDate: ['Bitte wähle ein Datum.', 'Please choose a date.', 'Escolha uma data.'],
    eAi: ['Für die KI-Entscheidung fehlen Angaben (Schlüssel, Bedingung, bei „OpenAI-kompatibel“ auch Adresse und Modell).', 'Details for the AI decision are missing (key, condition; for “OpenAI-compatible” also address and model).', 'Faltam dados da decisão por IA (chave, condição; em “compatível com OpenAI” também endereço e modelo).'],
    eUrl: ['Die KI-Adresse muss mit https:// beginnen und darf nicht intern sein.', 'The AI address must start with https:// and must not be internal.', 'O endereço da IA deve começar com https:// e não pode ser interno.'],
    sQ: ['Frage & Optionen', 'Question & options', 'Pergunta e opções'], sShow: ['Anzeige', 'Display', 'Exibição'], sLook: ['Aussehen & Texte', 'Appearance & texts', 'Aparência e textos'], sSec: ['Sicherheit', 'Security', 'Segurança'],
    q: ['Frage', 'Question', 'Pergunta'], optN: ['Option', 'Option', 'Opção'], addOpt: ['+ Option hinzufügen', '+ Add option', '+ Adicionar opção'], rm: ['Entfernen', 'Remove', 'Remover'],
    optHint: ['2 bis 10 Optionen.', '2 to 10 options.', '2 a 10 opções.'],
    otherOn: ['„Andere“-Knopf: Besucher dürfen eine eigene Antwort schreiben', '“Other” button: visitors may write their own answer', 'Botão “Outra”: visitantes podem escrever a própria resposta'],
    otherLabel: ['Name des „Andere“-Knopfes (leer = Standard in der Sprache des Besuchers)', 'Name of the “Other” button (empty = default in the visitor’s language)', 'Nome do botão “Outra” (vazio = padrão no idioma do visitante)'],
    otherMax: ['Max. Zeichen der eigenen Antwort (20–500)', 'Max. characters of the own answer (20–500)', 'Máx. de caracteres da resposta própria (20–500)'],
    showRes: ['Besucher sehen nach dem Abstimmen das Ergebnis', 'Visitors see the result after voting', 'Visitantes veem o resultado após votar'],
    scope: ['Stimmen gelten für', 'Votes apply to', 'Os votos valem para'],
    mode: ['Anzeige als', 'Show as', 'Exibir como'], trigger: ['Popup erscheint', 'Popup appears', 'O popup aparece'],
    date: ['Ab diesem Tag', 'From this day', 'A partir deste dia'], delay: ['Verzögerung in Sekunden (0–120)', 'Delay in seconds (0–120)', 'Atraso em segundos (0–120)'],
    popBtn: ['Nach dem Schließen kleinen Knopf zum späteren Abstimmen zeigen', 'After closing, show a small button to vote later', 'Após fechar, mostrar um botão pequeno para votar depois'],
    aiH: ['KI entscheidet (deine eigene KI-Schnittstelle)', 'AI decides (your own AI API)', 'IA decide (sua própria API de IA)'],
    aiHint: ['Der Schlüssel wird nur serverseitig gespeichert und nie an Besucher ausgegeben. Die KI bekommt nur anonyme Infos: Seite, Titel, Sprache, Gerät, Uhrzeit, Anzahl Besuche, Sekunden auf der Seite, Herkunft. Du zahlst die KI-Kosten bei deinem Anbieter.', 'The key is stored server-side only and never shown to visitors. The AI only gets anonymous info: page, title, language, device, hour, visit count, seconds on page, referrer. You pay the AI costs at your provider.', 'A chave é guardada só no servidor e nunca mostrada aos visitantes. A IA recebe só informações anônimas: página, título, idioma, dispositivo, hora, número de visitas, segundos na página, origem. Você paga os custos da IA ao seu provedor.'],
    aiProv: ['Anbieter', 'Provider', 'Provedor'], aiUrl: ['Adresse (Anthropic: leer lassen. OpenAI-kompatibel: z. B. https://api.openai.com/v1/chat/completions)', 'Address (Anthropic: leave empty. OpenAI-compatible: e.g. https://api.openai.com/v1/chat/completions)', 'Endereço (Anthropic: deixe vazio. Compatível com OpenAI: ex. https://api.openai.com/v1/chat/completions)'],
    aiModel: ['Modell (Anthropic: leer = claude-haiku-4-5)', 'Model (Anthropic: empty = claude-haiku-4-5)', 'Modelo (Anthropic: vazio = claude-haiku-4-5)'],
    aiKey: ['API-Schlüssel', 'API key', 'Chave de API'], aiKeySet: ['(gespeichert, leer lassen = behalten)', '(saved, leave empty = keep)', '(salva, deixe vazio = manter)'],
    aiPrompt: ['Bedingung: Wann soll die Umfrage erscheinen? (z. B. „Nur wenn der Besucher schon mehr als 2 Mal da war und auf einer Produktseite ist“)', 'Condition: when should the poll appear? (e.g. “Only if the visitor has been here more than twice and is on a product page”)', 'Condição: quando a enquete deve aparecer? (ex.: “Só se o visitante já veio mais de 2 vezes e está numa página de produto”)'],
    rTitle: ['Ergebnisse', 'Results', 'Resultados'], rNone: ['Noch keine Stimmen.', 'No votes yet.', 'Ainda sem votos.'], rTotal: ['Stimmen gesamt', 'Total votes', 'Total de votos'], rOther: ['Andere (eigene Antworten)', 'Other (own answers)', 'Outra (respostas próprias)'],
    more: ['Mehr laden', 'Load more', 'Carregar mais'], ownAns: ['Eigene Antworten', 'Own answers', 'Respostas próprias'],
    sTitle: ['Titel', 'Title', 'Título'], sSuccess: ['Text nach dem Abstimmen (leer = Standardtext)', 'Text after voting (empty = default text)', 'Texto após votar (vazio = padrão)'],
    opt: { auto: ['Automatisch', 'Automatic', 'Automático'], light: ['Hell', 'Light', 'Claro'], dark: ['Dunkel', 'Dark', 'Escuro'], right: ['Rechts', 'Right', 'Direita'], left: ['Links', 'Left', 'Esquerda'], system: ['System', 'System', 'Sistema'], serif: ['Serif', 'Serif', 'Serifa'], mono: ['Monospace', 'Monospace', 'Monoespaçada'],
      site: ['Ganze Webseite (eine gemeinsame Stimme)', 'Whole website (one shared vote)', 'Site inteiro (um voto comum)'], page: ['Pro Unterseite (jede Seite einzeln)', 'Per page (each page separately)', 'Por página (cada página separada)'],
      button: ['Knopf (Besucher öffnen selbst)', 'Button (visitors open it themselves)', 'Botão (visitantes abrem sozinhos)'], popup: ['Popup (öffnet sich automatisch)', 'Popup (opens automatically)', 'Popup (abre automaticamente)'],
      next_visit: ['Beim nächsten Öffnen der Webseite am Gerät', 'The next time the website is opened on the device', 'Na próxima vez que o site for aberto no dispositivo'], tdate: ['Ab einem bestimmten Tag', 'From a certain day', 'A partir de um certo dia'], ai: ['Wenn die KI es entscheidet', 'When the AI decides', 'Quando a IA decidir'],
      anthropic: ['Anthropic (Claude)', 'Anthropic (Claude)', 'Anthropic (Claude)'], openai: ['OpenAI-kompatibel', 'OpenAI-compatible', 'Compatível com OpenAI'] }
  };
  var LN = { de: 'Deutsch', en: 'English', 'pt-BR': 'Português (BR)' };
  var O = function (k) { return X.opt[k] ? t(X.opt[k]) : (LN[k] || k); };

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
  function loginView() {
    mount([h('h1', { text: t(X.title) }), h('p', { text: t(X.login) }), h('a', { class: 'btn', href: 'index.html#/apps', text: t(X.loginBtn), style: 'display:inline-block;padding:10px 16px;border-radius:8px;background:var(--rust);color:var(--rust-contrast);text-decoration:none' })]);
  }
  var ERR = { max_forms: X.eMax, options: X.eOpts, date: X.eDate, ai_incomplete: X.eAi, ai_url: X.eUrl };
  function fail(e) {
    if (e && e.auth) return loginView();
    msg(t(ERR[e && e.error] || X.eFail), true);
  }

  function list() {
    window.KKPoll.destroy();
    call({ action: 'list_forms' }).then(function (j) {
      var cards = j.forms.map(function (a) {
        return h('div', { class: 'card' }, [h('b', { text: a.pub.title || a.pub.question || a.id }), h('div', { class: 'small muted', text: a.id + ' · ' + O(a.pub.mode) + (a.priv.domains ? ' · ' + a.priv.domains : '') }), h('div', { class: 'row' }, [
          h('button', { class: 'b', type: 'button', text: t(X.see), onclick: function () { results(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.edit), onclick: function () { form(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delQ))) call({ action: 'delete', id: a.id }).then(list).catch(fail); } })])]);
      });
      mount([h('h1', { text: t(X.title) }), h('p', { class: 'muted', text: t(X.intro) }), guide(true), h('h2', { text: t(X.mine) })]
        .concat(cards.length ? cards : [h('p', { class: 'muted', text: t(X.none) })])
        .concat([h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newA), onclick: function () { form(null); } })])]));
    }).catch(fail);
  }

  function results(a) {
    window.KKPoll.destroy();
    var box = h('div'), off = 0, moreBtn = h('button', { class: 'b s', type: 'button', text: t(X.more), hidden: true }), head = h('p', { class: 'muted' }), bars = h('div'), ownH = h('h2', { text: t(X.ownAns), hidden: true });
    function load() {
      call({ action: 'votes', id: a.id, offset: off }).then(function (j) {
        if (off === 0) {
          head.textContent = j.total ? t(X.rTotal) + ': ' + j.total : t(X.rNone);
          bars.textContent = '';
          var rows = j.counts.slice(); if (a.pub.other_on) rows.push({ text: t(X.rOther), n: j.other_n });
          if (j.total) rows.forEach(function (r) {
            var p = Math.round(r.n / j.total * 100);
            bars.appendChild(h('div', { style: 'margin:8px 0' }, [h('div', { style: 'display:flex;justify-content:space-between;gap:8px', text: '' }, [h('span', { text: r.text, style: 'overflow-wrap:anywhere' }), h('span', { text: p + '% · ' + r.n })]),
              h('div', { style: 'height:8px;border-radius:4px;background:var(--border);overflow:hidden;margin-top:3px' }, [h('div', { style: 'height:100%;width:' + p + '%;background:var(--rust)' })])]));
          });
        }
        if (j.items.length) ownH.hidden = false;
        j.items.forEach(function (r) {
          var c = h('div', { class: 'card' }, [
            h('div', null, [h('b', { text: r.option_text, style: 'overflow-wrap:anywhere' }), h('span', { class: 'small muted', text: ' · ' + new Date(r.created_at).toLocaleString(L) })]),
            r.page_key ? h('div', { class: 'small muted', text: r.page_key, style: 'overflow-wrap:anywhere' }) : null,
            h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delR))) call({ action: 'delvote', id: a.id, vote_id: r.id }).then(function () { c.remove(); }).catch(fail); } })])]);
          box.appendChild(c);
        });
        off += j.items.length; moreBtn.hidden = !j.more;
      }).catch(fail);
    }
    moreBtn.onclick = load;
    mount([h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: t(X.rTitle) + ': ' + (a.pub.title || a.pub.question || a.id) }), head, bars, ownH, box, h('div', { class: 'row' }, [moreBtn])]);
    load();
  }

  function form(a) {
    var id = a ? a.id : '', P = a ? a.pub : {}, V = a ? a.priv : {}, inp = {}, nodes = [];
    var optBox = h('div'), optAdd, opts = (P.options && P.options.length ? P.options.slice() : ['', '']);
    function val(k, d) { return P[k] != null ? P[k] : d; }
    function field(k, type, label, d, extra) {
      var lb = h('label', { text: t(label), for: 'f_' + k }), el;
      if (type === 'select') { el = h('select', { id: 'f_' + k }, extra.map(function (o) { return h('option', { value: o, text: O(o) }); })); el.value = val(k, d); }
      else if (type === 'checkbox') { el = h('input', { id: 'f_' + k, type: 'checkbox' }); el.checked = !!val(k, d); lb = h('label', null, [el, ' ' + t(label)]); inp[k] = el; return [lb]; }
      else if (type === 'textarea') { el = h('textarea', { id: 'f_' + k }); el.value = val(k, d); }
      else { el = h('input', { id: 'f_' + k, type: type, autocomplete: 'off', min: extra && extra[0], max: extra && extra[1] }); el.value = val(k, d); }
      inp[k] = el; return [lb, el];
    }
    function pfield(k, type, label, d, extra) { // geheime Felder
      var lb = h('label', { text: t(label), for: 'p_' + k }), el;
      if (type === 'select') { el = h('select', { id: 'p_' + k }, extra.map(function (o) { return h('option', { value: o, text: O(o) }); })); el.value = V[k] || d; }
      else if (type === 'textarea') { el = h('textarea', { id: 'p_' + k }); el.value = V[k] || ''; }
      else { el = h('input', { id: 'p_' + k, type: type, autocomplete: 'off' }); el.value = k === 'ai_key' ? '' : (V[k] || ''); if (k === 'ai_key') { el.placeholder = V.ai_key_set ? t(X.aiKeySet) : ''; } }
      inp['p_' + k] = el; return [lb, el];
    }
    function add(arr) { arr.forEach(function (n) { nodes.push(n); }); }

    nodes.push(h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: a ? (a.pub.title || a.pub.question || a.id) : t(X.newA) }), guide(false));
    nodes.push(h('h2', { text: t(X.sQ) }));
    add(field('question', 'text', X.q, ''));
    function drawOpts() {
      optBox.textContent = '';
      opts.forEach(function (o, i) {
        var el = h('input', { type: 'text', maxlength: 80, 'aria-label': t(X.optN) + ' ' + (i + 1), placeholder: t(X.optN) + ' ' + (i + 1), style: 'flex:1' }); el.value = o; el.oninput = function () { opts[i] = el.value; };
        var rm = h('button', { type: 'button', class: 'b s', text: '×', 'aria-label': t(X.rm), onclick: function () { if (opts.length > 2) { opts.splice(i, 1); drawOpts(); } } });
        if (opts.length <= 2) rm.disabled = true;
        optBox.appendChild(h('div', { class: 'row', style: 'margin:6px 0;flex-wrap:nowrap' }, [el, rm]));
      });
      optAdd.disabled = opts.length >= 10;
    }
    optAdd = h('button', { type: 'button', class: 'b s', text: t(X.addOpt), onclick: function () { if (opts.length < 10) { opts.push(''); drawOpts(); } } });
    nodes.push(h('label', { text: t(X.optN) + ' – ' + t(X.optHint) }), optBox, h('div', { class: 'row' }, [optAdd]));
    drawOpts();
    add(field('other_on', 'checkbox', X.otherOn, false)); add(field('other_label', 'text', X.otherLabel, '')); add(field('other_max', 'number', X.otherMax, 200, [20, 500]));
    add(field('show_results', 'checkbox', X.showRes, true));
    add(field('scope', 'select', X.scope, 'site', ['site', 'page']));

    nodes.push(h('h2', { text: t(X.sShow) }));
    add(field('mode', 'select', X.mode, 'button', ['button', 'popup']));
    var popBox = h('div'), dateBox = h('div'), aiBox = h('div');
    function put(box, arr) { arr.forEach(function (n) { box.appendChild(n); }); }
    put(popBox, field('trigger', 'select', X.trigger, 'next_visit', ['next_visit', 'date', 'ai']));
    put(dateBox, field('popup_date', 'date', X.date, ''));
    put(popBox, [dateBox]); put(popBox, field('popup_delay', 'number', X.delay, 0, [0, 120])); put(popBox, field('popup_button', 'checkbox', X.popBtn, true));
    aiBox.appendChild(h('h3', { text: t(X.aiH) })); aiBox.appendChild(h('p', { class: 'muted small', text: t(X.aiHint) }));
    put(aiBox, pfield('ai_provider', 'select', X.aiProv, 'anthropic', ['anthropic', 'openai'])); put(aiBox, pfield('ai_endpoint', 'text', X.aiUrl)); put(aiBox, pfield('ai_model', 'text', X.aiModel)); put(aiBox, pfield('ai_key', 'password', X.aiKey)); put(aiBox, pfield('ai_prompt', 'textarea', X.aiPrompt));
    put(popBox, [aiBox]); nodes.push(popBox);
    function vis() { var pop = inp.mode.value === 'popup', tr = inp.trigger.value; popBox.hidden = !pop; dateBox.hidden = tr !== 'date'; aiBox.hidden = tr !== 'ai'; }
    inp.mode.onchange = vis; inp.trigger.onchange = vis; vis();

    nodes.push(h('h2', { text: t(X.sLook) }));
    add(field('title', 'text', X.sTitle, '')); add(field('success', 'text', X.sSuccess, ''));
    add(field('emoji', 'text', ['Emoji', 'Emoji', 'Emoji'], '📊')); add(field('launcher', 'text', ['Text am Knopf (optional)', 'Button text (optional)', 'Texto do botão (opcional)'], ''));
    add(field('color', 'color', ['Hauptfarbe', 'Main color', 'Cor principal'], '#A8442E'));
    add(field('theme', 'select', ['Design', 'Theme', 'Tema'], 'auto', ['auto', 'light', 'dark'])); add(field('position', 'select', ['Position', 'Position', 'Posição'], 'right', ['right', 'left']));
    add(field('font', 'select', ['Schrift', 'Font', 'Fonte'], 'system', ['system', 'serif', 'mono'])); add(field('radius', 'number', ['Rundung (0–28)', 'Roundness (0–28)', 'Arredondamento (0–28)'], 14, [0, 28]));
    add(field('lang', 'select', ['Sprache', 'Language', 'Idioma'], 'auto', ['auto', 'de', 'en', 'pt-BR']));
    nodes.push(h('h2', { text: t(X.sSec) }));
    add(pfield('domains', 'text', ['Erlaubte Domains (kommagetrennt, leer = alle), z. B. meineseite.de', 'Allowed domains (comma-separated, empty = all), e.g. mysite.com', 'Domínios permitidos (separados por vírgula, vazio = todos), ex.: meusite.com.br']));

    var out = h('div');
    function embed(newId) {
      out.textContent = '';
      var code = '<script src="' + WIDGET + '" data-form="' + newId + '" defer></' + 'script>';
      out.appendChild(h('h2', { text: t(X.embed) })); out.appendChild(h('p', { class: 'muted', text: t(X.embedHint) })); out.appendChild(h('pre', { text: code }));
      out.appendChild(h('button', { class: 'b s', type: 'button', text: t(X.copy), onclick: function (e) { var b = e.target; (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { b.textContent = t(X.copied); }).catch(function () { }); } }));
    }
    nodes.push(h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: t(X.save), onclick: function () {
      var pub = {}, priv = {};
      Object.keys(inp).forEach(function (k) {
        var el = inp[k], v = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value;
        if (k.indexOf('p_') === 0) priv[k.slice(2)] = v; else pub[k] = v;
      });
      pub.options = opts.map(function (o) { return o.trim(); }).filter(Boolean);
      if (!pub.question.trim()) return msg(t(X.eQ), true);
      if (pub.options.length < 2) return msg(t(X.eOpts), true);
      call({ action: 'save', id: id, pub: pub, priv: priv }).then(function (j) {
        a = j.form; id = a.id; msg(t(X.saved)); embed(id);
        window.KKPoll.mount({ id: id, cfg: a.pub });
      }).catch(fail);
    } })]), out);
    if (a) embed(a.id);
    mount(nodes);
    if (a) window.KKPoll.mount({ id: a.id, cfg: a.pub });
  }

  /* ---------- Anleitung (für Devs sichtbar) ---------- */
  X.guideTitle = ['Anleitung', 'Guide', 'Guia'];
  var G = [
    { open: 1, title: ['So funktioniert es (3 Schritte)', 'How it works (3 steps)', 'Como funciona (3 passos)'], steps: [
      ['Auf „Neue Umfrage“ tippen, Frage und 2 bis 10 Optionen eingeben. Optional den „Andere“-Knopf einschalten und seinen Namen ändern.', 'Tap “New poll”, enter the question and 2 to 10 options. Optionally turn on the “Other” button and rename it.', 'Toque em “Nova enquete”, informe a pergunta e 2 a 10 opções. Opcionalmente ative o botão “Outra” e mude o nome.'],
      ['Unter „Anzeige“ wählen: Knopf (Besucher öffnen selbst) oder Popup (öffnet sich automatisch). Dann „Speichern“. Du siehst sofort Vorschau und Code.', 'Under “Display” choose: button (visitors open it) or popup (opens automatically). Then “Save”. You see the preview and code right away.', 'Em “Exibição” escolha: botão (visitantes abrem) ou popup (abre sozinho). Depois “Salvar”. Você vê a prévia e o código na hora.'],
      ['Den Code kopieren und kurz vor </body> deiner Webseite einfügen. Ergebnisse siehst du unter „Ergebnisse ansehen“.', 'Copy the code and paste it just before </body> on your website. See results under “View results”.', 'Copie o código e cole logo antes de </body> no seu site. Veja os resultados em “Ver resultados”.']
    ] },
    { title: ['Popup: wann erscheint es?', 'Popup: when does it appear?', 'Popup: quando aparece?'], steps: [
      ['Beim nächsten Öffnen: Sobald ein Besucher die Seite das nächste Mal an seinem Gerät öffnet. Danach nicht mehr, außer du änderst Frage, Optionen oder Popup-Einstellung (dann zählt es als neue Umfrage).', 'Next open: as soon as a visitor next opens the page on their device. Not again afterwards, unless you change question, options or popup setting (then it counts as a new poll).', 'Na próxima abertura: assim que o visitante abrir a página no dispositivo. Depois não mais, a menos que você mude pergunta, opções ou configuração do popup (aí conta como nova enquete).'],
      ['Ab einem Tag: Erscheint ab dem gewählten Datum (Datum des Besuchers) einmalig pro Gerät.', 'From a day: appears from the chosen date (visitor’s date), once per device.', 'A partir de um dia: aparece a partir da data escolhida (data do visitante), uma vez por dispositivo.'],
      ['KI entscheidet: Deine KI bekommt anonyme Besucherinfos und deine Bedingung und antwortet nur mit Ja/Nein. Die Entscheidung wird 6 Stunden gemerkt, damit wenig KI-Kosten entstehen.', 'AI decides: your AI gets anonymous visitor info plus your condition and only answers yes/no. The decision is remembered for 6 hours to keep AI costs low.', 'IA decide: sua IA recebe informações anônimas e sua condição e responde só sim/não. A decisão é lembrada por 6 horas para poupar custos de IA.'],
      ['Wer schon abgestimmt hat, bekommt das Popup nie mehr gezeigt.', 'Visitors who already voted never see the popup again.', 'Quem já votou nunca mais vê o popup.']
    ] },
    { title: ['Wichtige Einstellungen', 'Important settings', 'Configurações importantes'], steps: [
      ['Jeder Besucher (Gerät) hat pro Webseite bzw. Unterseite eine Stimme. Wer erneut abstimmt, ersetzt die alte Stimme.', 'Each visitor (device) has one vote per website or page. A new vote replaces the old one.', 'Cada visitante (dispositivo) tem um voto por site ou página. Um novo voto substitui o antigo.'],
      ['Erlaubte Domains: Nur dort funktioniert die Umfrage (leer = überall). Verhindert, dass andere deinen Code nutzen.', 'Allowed domains: the poll only works there (empty = everywhere). Prevents others from using your code.', 'Domínios permitidos: a enquete só funciona lá (vazio = em todo lugar). Impede que outros usem seu código.'],
      ['Änderungen, die du hier speicherst, gelten sofort. Der Code auf deiner Webseite bleibt gleich.', 'Changes you save here apply immediately. The code on your website stays the same.', 'Alterações salvas aqui valem na hora. O código no seu site continua igual.']
    ] },
    { title: ['Probleme?', 'Problems?', 'Problemas?'], steps: [
      ['Nichts erscheint: Code vor </body>? Webseite bei „Erlaubte Domains“ eingetragen (oder leer)? Beim Popup: Du hast es auf dem Gerät evtl. schon gesehen. Zum Testen Seite in einem privaten Fenster öffnen.', 'Nothing appears: is the code before </body>? Is your website in “Allowed domains” (or empty)? For the popup: you may have already seen it on that device. To test, open the page in a private window.', 'Nada aparece: o código está antes de </body>? O site está em “Domínios permitidos” (ou vazio)? No popup: talvez você já o tenha visto neste dispositivo. Para testar, abra a página numa janela privada.'],
      ['Beleidigende eigene Antwort: Unter „Ergebnisse ansehen“ bei „Eigene Antworten“ auf „Löschen“ tippen.', 'Abusive own answer: under “View results” in “Own answers” tap “Delete”.', 'Resposta própria ofensiva: em “Ver resultados”, em “Respostas próprias”, toque em “Excluir”.']
    ] }
  ];
  function guide(openFirst) {
    var box = h('div', null, [h('h2', { text: t(X.guideTitle) })]);
    G.forEach(function (g) {
      var d = h('details', { open: openFirst && g.open ? true : null }, [h('summary', { text: t(g.title) })]);
      var ol = h('ol'); g.steps.forEach(function (s) { ol.appendChild(h('li', { text: t(s) })); });
      d.appendChild(ol); box.appendChild(d);
    });
    return box;
  }

  var s = session();
  if (!s || !s.access_token) loginView(); else list();
})();

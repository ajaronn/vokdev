/* Karteikasten Developer · Feedback-Builder (nutzt die Anmeldung der Developer-Seite) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/feedback';
  var WIDGET = 'https://ajaronn.github.io/vokdev/feedback-widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  function t(a) { return a[I]; }

  var X = {
    title: ['Feedback-Knopf erstellen', 'Create a feedback button', 'Criar botão de feedback'],
    intro: ['Besucher deiner Webseite können mit Sternen bewerten, einen Kommentar schreiben und die Bewertungen anderer sehen. Du fügst nur eine Zeile Code ein. Alle Bewertungen werden sicher bei uns gespeichert und du siehst sie hier.', 'Visitors of your website can rate with stars, write a comment and see other people’s reviews. You only paste one line of code. All reviews are stored safely and you can see them here.', 'Os visitantes do seu site podem avaliar com estrelas, comentar e ver as avaliações de outros. Você só cola uma linha de código. Todas as avaliações são salvas com segurança e você as vê aqui.'],
    login: ['Bitte melde dich zuerst auf der Developer-Seite an.', 'Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.'],
    loginBtn: ['Zur Anmeldung', 'Go to sign-in', 'Ir para o login'],
    mine: ['Meine Feedback-Knöpfe', 'My feedback buttons', 'Meus botões de feedback'], none: ['Noch keine Feedback-Knöpfe.', 'No feedback buttons yet.', 'Nenhum botão de feedback ainda.'],
    newA: ['Neuer Feedback-Knopf', 'New feedback button', 'Novo botão de feedback'], edit: ['Bearbeiten', 'Edit', 'Editar'], del: ['Löschen', 'Delete', 'Excluir'], see: ['Bewertungen ansehen', 'View reviews', 'Ver avaliações'],
    delQ: ['Diesen Knopf wirklich löschen? Alle Bewertungen gehen verloren.', 'Really delete this button? All reviews will be lost.', 'Excluir este botão? Todas as avaliações serão perdidas.'],
    delR: ['Diese Bewertung löschen?', 'Delete this review?', 'Excluir esta avaliação?'],
    save: ['Speichern', 'Save', 'Salvar'], back: ['Zurück', 'Back', 'Voltar'],
    saved: ['Gespeichert! Unten siehst du die Vorschau (auch dort abgegebene Bewertungen werden wirklich gespeichert) und deinen Code.', 'Saved! Below you see the preview (reviews submitted there are really saved) and your code.', 'Salvo! Abaixo você vê a prévia (avaliações enviadas lá são realmente salvas) e seu código.'],
    embed: ['Dein Code für die Webseite', 'Your code for the website', 'Seu código para o site'],
    embedHint: ['Diese eine Zeile in den HTML-Code deiner Seite einfügen (kurz vor </body>).', 'Paste this single line into your page’s HTML (just before </body>).', 'Cole esta linha no HTML do seu site (logo antes de </body>).'],
    copy: ['Kopieren', 'Copy', 'Copiar'], copied: ['Kopiert!', 'Copied!', 'Copiado!'],
    eAuth: ['Sitzung abgelaufen. Bitte melde dich neu an.', 'Session expired. Please sign in again.', 'Sessão expirada. Entre novamente.'],
    eMax: ['Maximal 5 Feedback-Knöpfe pro Konto.', 'Maximum 5 feedback buttons per account.', 'Máximo de 5 botões por conta.'],
    eFail: ['Speichern fehlgeschlagen.', 'Saving failed.', 'Falha ao salvar.'],
    sPerm: ['Was Besucher dürfen', 'What visitors may do', 'O que os visitantes podem fazer'], sLook: ['Aussehen & Texte', 'Appearance & texts', 'Aparência e textos'], sSec: ['Sicherheit', 'Security', 'Segurança'],
    rTitle: ['Bewertungen', 'Reviews', 'Avaliações'], rNone: ['Noch keine Bewertungen.', 'No reviews yet.', 'Ainda sem avaliações.'], rAvg: ['Durchschnitt', 'Average', 'Média'], more: ['Mehr laden', 'Load more', 'Carregar mais'], anon: ['Anonym', 'Anonymous', 'Anônimo'],
    opt: { auto: ['Automatisch', 'Automatic', 'Automático'], light: ['Hell', 'Light', 'Claro'], dark: ['Dunkel', 'Dark', 'Escuro'], right: ['Rechts', 'Right', 'Direita'], left: ['Links', 'Left', 'Esquerda'], system: ['System', 'System', 'Sistema'], serif: ['Serif', 'Serif', 'Serifa'], mono: ['Monospace', 'Monospace', 'Monoespaçada'],
      off: ['Nicht abfragen', 'Do not ask', 'Não perguntar'], optional: ['Optional', 'Optional', 'Opcional'], required: ['Pflicht', 'Required', 'Obrigatório'],
      site: ['Ganze Webseite (eine gemeinsame Bewertung)', 'Whole website (one shared rating)', 'Site inteiro (uma avaliação comum)'], page: ['Pro Unterseite (jede Seite einzeln)', 'Per page (each page separately)', 'Por página (cada página separada)'] }
  };
  var LN = { de: 'Deutsch', en: 'English', 'pt-BR': 'Português (BR)' };
  var O = function (k) { return X.opt[k] ? t(X.opt[k]) : (LN[k] || k); };
  var FIELDS = [
    ['sPerm'],
    { k: 'ask_name', g: 'pub', type: 'select', label: ['Name des Besuchers', 'Visitor’s name', 'Nome do visitante'], opts: ['optional', 'required', 'off'] },
    { k: 'ask_comment', g: 'pub', type: 'select', label: ['Kommentar des Besuchers', 'Visitor’s comment', 'Comentário do visitante'], opts: ['optional', 'required', 'off'] },
    { k: 'show_reviews', g: 'pub', type: 'checkbox', label: ['Besucher dürfen alle Bewertungen sehen', 'Visitors may see all reviews', 'Visitantes podem ver todas as avaliações'], def: true },
    { k: 'scope', g: 'pub', type: 'select', label: ['Bewertungen gelten für', 'Reviews apply to', 'As avaliações valem para'], opts: ['site', 'page'] },
    { k: 'max_chars', g: 'pub', type: 'number', min: 50, max: 2000, label: ['Max. Zeichen pro Kommentar (50–2000)', 'Max. characters per comment (50–2000)', 'Máx. de caracteres por comentário (50–2000)'], def: 600 },
    ['sLook'],
    { k: 'title', g: 'pub', type: 'text', label: ['Titel', 'Title', 'Título'] },
    { k: 'intro', g: 'pub', type: 'textarea', label: ['Einleitungstext (leer = Standardtext in der Sprache des Besuchers)', 'Intro text (empty = default text in the visitor’s language)', 'Texto de introdução (vazio = texto padrão no idioma do visitante)'] },
    { k: 'success', g: 'pub', type: 'text', label: ['Text nach dem Senden (leer = Standardtext)', 'Text after sending (empty = default text)', 'Texto após o envio (vazio = padrão)'] },
    { k: 'emoji', g: 'pub', type: 'text', label: ['Emoji am Knopf', 'Emoji on the button', 'Emoji do botão'], def: '⭐' },
    { k: 'launcher', g: 'pub', type: 'text', label: ['Text am Knopf (optional)', 'Button text (optional)', 'Texto do botão (opcional)'] },
    { k: 'color', g: 'pub', type: 'color', label: ['Hauptfarbe', 'Main color', 'Cor principal'], def: '#A8442E' },
    { k: 'theme', g: 'pub', type: 'select', label: ['Design', 'Theme', 'Tema'], opts: ['auto', 'light', 'dark'] },
    { k: 'position', g: 'pub', type: 'select', label: ['Position', 'Position', 'Posição'], opts: ['right', 'left'] },
    { k: 'font', g: 'pub', type: 'select', label: ['Schrift', 'Font', 'Fonte'], opts: ['system', 'serif', 'mono'] },
    { k: 'radius', g: 'pub', type: 'number', min: 0, max: 28, label: ['Rundung (0–28)', 'Roundness (0–28)', 'Arredondamento (0–28)'], def: 14 },
    { k: 'lang', g: 'pub', type: 'select', label: ['Sprache', 'Language', 'Idioma'], opts: ['auto', 'de', 'en', 'pt-BR'] },
    ['sSec'],
    { k: 'domains', g: 'priv', type: 'text', label: ['Erlaubte Domains (kommagetrennt, leer = alle), z. B. meineseite.de', 'Allowed domains (comma-separated, empty = all), e.g. mysite.com', 'Domínios permitidos (separados por vírgula, vazio = todos), ex.: meusite.com'] }
  ];

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
    mount([h('h1', { text: t(X.title) }), h('p', { text: t(X.login) }), h('a', { class: 'btn', href: 'index.html#/apps', text: t(X.loginBtn), style: 'display:inline-block;padding:10px 16px;border-radius:8px;background:var(--rust);color:var(--rust-contrast);text-decoration:none;font-weight:600' }), guide(true)]);
  }
  function fail(e) {
    if (e && e.auth) return loginView();
    msg(t(e && e.error === 'max_forms' ? X.eMax : X.eFail), true);
  }
  function stars(n) { var s = ''; for (var i = 1; i <= 5; i++) s += i <= Math.round(n) ? '★' : '☆'; return s; }

  function list() {
    window.KKFeedback.destroy();
    call({ action: 'list_forms' }).then(function (j) {
      var cards = j.forms.map(function (a) {
        return h('div', { class: 'card' }, [h('b', { text: a.pub.title || a.id }), h('div', { class: 'small muted', text: a.id + (a.priv.domains ? ' · ' + a.priv.domains : '') }), h('div', { class: 'row' }, [
          h('button', { class: 'b', type: 'button', text: t(X.see), onclick: function () { reviews(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.edit), onclick: function () { form(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delQ))) call({ action: 'delete', id: a.id }).then(list).catch(fail); } })])]);
      });
      mount([h('h1', { text: t(X.title) }), h('p', { class: 'muted', text: t(X.intro) }), guide(true), h('h2', { text: t(X.mine) })]
        .concat(cards.length ? cards : [h('p', { class: 'muted', text: t(X.none) })])
        .concat([h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newA), onclick: function () { form(null); } })])]));
    }).catch(fail);
  }

  function reviews(a) {
    window.KKFeedback.destroy();
    var box = h('div'), off = 0, moreBtn = h('button', { class: 'b s', type: 'button', text: t(X.more), hidden: true });
    var head = h('p', { class: 'muted' });
    function load() {
      call({ action: 'reviews', id: a.id, offset: off }).then(function (j) {
        if (off === 0) head.textContent = j.count ? t(X.rAvg) + ': ' + stars(j.avg) + ' ' + j.avg.toFixed(1) + ' (' + j.count + ')' : t(X.rNone);
        j.items.forEach(function (r) {
          var c = h('div', { class: 'card' }, [
            h('div', null, [h('b', { text: stars(r.rating) + ' ' + (r.name || t(X.anon)) }), h('span', { class: 'small muted', text: ' · ' + new Date(r.created_at).toLocaleString(L) })]),
            r.comment ? h('p', { text: r.comment, style: 'white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0' }) : null,
            r.page_key ? h('div', { class: 'small muted', text: r.page_key, style: 'overflow-wrap:anywhere' }) : null,
            h('div', { class: 'row' }, [h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delR))) call({ action: 'delreview', id: a.id, review_id: r.id }).then(function () { c.remove(); }).catch(fail); } })])]);
          box.appendChild(c);
        });
        off += j.items.length; moreBtn.hidden = !j.more;
      }).catch(fail);
    }
    moreBtn.onclick = load;
    mount([h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: t(X.rTitle) + ': ' + (a.pub.title || a.id) }), head, box, h('div', { class: 'row' }, [moreBtn])]);
    load();
  }

  function form(a) {
    var inputs = {}, id = a ? a.id : '';
    var val = function (f) {
      var src = a ? (f.g === 'pub' ? a.pub : a.priv) : null;
      if (src && src[f.k] != null) return src[f.k];
      return f.def != null ? f.def : '';
    };
    var nodes = [h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: a ? (a.pub.title || a.id) : t(X.newA) })];
    nodes.push(guide(false));
    FIELDS.forEach(function (f) {
      if (Array.isArray(f)) { nodes.push(h('h2', { text: t(X[f[0]]) })); return; }
      var lb = h('label', { text: t(f.label), for: 'f_' + f.k }), el, v = val(f);
      if (f.type === 'select') { el = h('select', { id: 'f_' + f.k }, f.opts.map(function (o) { return h('option', { value: o, text: O(o) }); })); el.value = v || f.opts[0]; }
      else if (f.type === 'textarea') { el = h('textarea', { id: 'f_' + f.k }); el.value = v; }
      else if (f.type === 'checkbox') { el = h('input', { id: 'f_' + f.k, type: 'checkbox' }); el.checked = !!v; lb = h('label', null, [el, ' ' + t(f.label)]); inputs[f.k] = { f: f, el: el }; nodes.push(lb); return; }
      else { el = h('input', { id: 'f_' + f.k, type: f.type, autocomplete: 'off', min: f.min, max: f.max }); el.value = v; if (f.k === 'color' && !/^#[0-9a-f]{6}$/i.test(v)) el.value = '#A8442E'; }
      inputs[f.k] = { f: f, el: el }; nodes.push(lb, el);
    });
    var out = h('div');
    function embed(newId) {
      out.textContent = '';
      var code = '<script src="' + WIDGET + '" data-form="' + newId + '" defer></' + 'script>';
      out.appendChild(h('h2', { text: t(X.embed) })); out.appendChild(h('p', { class: 'muted', text: t(X.embedHint) })); out.appendChild(h('pre', { text: code }));
      out.appendChild(h('button', { class: 'b s', type: 'button', text: t(X.copy), onclick: function (e) { var b = e.target; (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { b.textContent = t(X.copied); }).catch(function () { b.textContent = '⌥'; }); } }));
    }
    nodes.push(h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: t(X.save), onclick: function () {
      var body = { action: 'save', id: id, pub: {}, priv: {} };
      Object.keys(inputs).forEach(function (k) {
        var f = inputs[k].f, el = inputs[k].el, v = f.type === 'checkbox' ? el.checked : f.type === 'number' ? Number(el.value) : el.value;
        (f.g === 'pub' ? body.pub : body.priv)[k] = v;
      });
      call(body).then(function (j) {
        a = j.form; id = a.id; msg(t(X.saved)); embed(id);
        window.KKFeedback.mount({ id: id, cfg: a.pub, open: true });
      }).catch(fail);
    } })]), out);
    if (a) embed(a.id);
    mount(nodes);
    if (a) window.KKFeedback.mount({ id: a.id, cfg: a.pub, open: false });
  }

  /* ---------- Anleitung (für Devs sichtbar) ---------- */
  X.guideTitle = ['Anleitung', 'Guide', 'Guia'];
  var G = [
    { open: 1, title: ['So funktioniert es (3 Schritte)', 'How it works (3 steps)', 'Como funciona (3 passos)'], steps: [
      ['Knopf anlegen: Auf „Neuer Feedback-Knopf“ tippen, Aussehen und Regeln einstellen (z. B. ob Name und Kommentar Pflicht sind).', 'Create a button: tap “New feedback button”, set appearance and rules (e.g. whether name and comment are required).', 'Criar o botão: toque em “Novo botão de feedback”, defina aparência e regras (ex.: se nome e comentário são obrigatórios).'],
      ['Auf „Speichern“ tippen. Du siehst sofort eine Vorschau mit dem Knopf und deinen Code.', 'Tap “Save”. You immediately see a preview with the button and your code.', 'Toque em “Salvar”. Você vê na hora uma prévia com o botão e seu código.'],
      ['Den Code kopieren und kurz vor </body> deiner Webseite einfügen. Fertig: Besucher klicken auf den Knopf, geben Sterne und sehen alle Bewertungen. Du siehst und löschst Bewertungen hier unter „Bewertungen ansehen“.', 'Copy the code and paste it just before </body> on your website. Done: visitors click the button, give stars and see all reviews. You can view and delete reviews here under “View reviews”.', 'Copie o código e cole logo antes de </body> no seu site. Pronto: os visitantes clicam no botão, dão estrelas e veem todas as avaliações. Você vê e exclui avaliações aqui em “Ver avaliações”.']
    ] },
    { title: ['Wichtige Einstellungen', 'Important settings', 'Configurações importantes'], steps: [
      ['Bewertungen gelten für: „Ganze Webseite“ zeigt auf jeder Seite dieselben Bewertungen. „Pro Unterseite“ zählt jede Seite einzeln (z. B. für Artikel).', 'Reviews apply to: “Whole website” shows the same reviews on every page. “Per page” counts each page separately (e.g. for articles).', 'As avaliações valem para: “Site inteiro” mostra as mesmas avaliações em todas as páginas. “Por página” conta cada página separadamente (ex.: artigos).'],
      ['Jeder Besucher kann pro Webseite (bzw. Unterseite) nur eine Bewertung abgeben. Gibt er erneut eine ab, wird die alte ersetzt.', 'Each visitor can give only one review per website (or page). A new one replaces the old one.', 'Cada visitante pode dar só uma avaliação por site (ou página). Uma nova substitui a antiga.'],
      ['Erlaubte Domains: Nur dort funktioniert der Knopf (leer = überall). Verhindert, dass andere deinen Code für ihre Seite benutzen.', 'Allowed domains: the button only works there (empty = everywhere). Prevents others from using your code on their site.', 'Domínios permitidos: o botão só funciona lá (vazio = em qualquer lugar). Impede que outros usem seu código.']
    ] },
    { title: ['Code in die Webseite einfügen', 'Adding the code to your website', 'Adicionar o código ao site'], steps: [
      ['Den Code kurz vor </body> einfügen. Bei Baukästen (Wix, Jimdo, WordPress usw.) gibt es dafür meist einen Bereich „Eigener Code“ bzw. „Custom Code“ im Seitenende (Footer).', 'Paste the code just before </body>. Website builders (Wix, Jimdo, WordPress etc.) usually have a “Custom code” area in the footer.', 'Cole o código logo antes de </body>. Construtores de site (Wix, Jimdo, WordPress etc.) geralmente têm uma área “Código personalizado” no rodapé.'],
      ['Änderungen, die du hier speicherst, gelten sofort. Der Code auf deiner Webseite muss nicht geändert werden.', 'Changes you save here apply immediately. You do not have to change the code on your website.', 'Alterações salvas aqui valem imediatamente. Você não precisa mudar o código no seu site.'],
      ['Optional im Code: data-open="true" (Fenster startet offen) oder data-lang="de" (Sprache fest).', 'Optional in the code: data-open="true" (window starts open) or data-lang="en" (fixed language).', 'Opcional no código: data-open="true" (janela abre aberta) ou data-lang="pt-BR" (idioma fixo).']
    ] },
    { title: ['Probleme?', 'Problems?', 'Problemas?'], steps: [
      ['Knopf erscheint nicht: Prüfe, ob der Code vor </body> steht und ob deine Webseite unter „Erlaubte Domains“ eingetragen ist (oder das Feld leer ist).', 'Button does not appear: check that the code is before </body> and that your website is listed under “Allowed domains” (or the field is empty).', 'O botão não aparece: verifique se o código está antes de </body> e se seu site está em “Domínios permitidos” (ou o campo está vazio).'],
      ['Beleidigende Bewertung: Unter „Bewertungen ansehen“ auf „Löschen“ tippen.', 'Abusive review: under “View reviews” tap “Delete”.', 'Avaliação ofensiva: em “Ver avaliações” toque em “Excluir”.']
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

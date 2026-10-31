/* Karteikasten Developer · Kontaktformular-Builder (nutzt die Anmeldung der Developer-Seite) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/contact';
  var WIDGET = 'https://ajaronn.github.io/vokdev/contact-widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  function t(a) { return a[I]; }

  var X = {
    title: ['Kontaktformular erstellen', 'Create a contact form', 'Criar formulário de contato'],
    intro: ['Gib deine E-Mail-Adresse an und lege fest, was Besucher dürfen (z. B. Anhänge). Dann fügst du nur eine Zeile Code in deine Webseite ein. Sendet ein Besucher eine Nachricht, kommt sie automatisch per E-Mail bei dir an – du kannst direkt darauf antworten.', 'Enter your email address and choose what visitors may do (e.g. attachments). Then add just one line of code to your website. When a visitor sends a message, it arrives in your inbox automatically – you can reply to it directly.', 'Informe seu e-mail e defina o que os visitantes podem fazer (ex.: anexos). Depois, adicione só uma linha de código ao seu site. Quando um visitante envia uma mensagem, ela chega automaticamente ao seu e-mail – você pode responder direto.'],
    login: ['Bitte melde dich zuerst auf der Developer-Seite an.', 'Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.'],
    loginBtn: ['Zur Anmeldung', 'Go to sign-in', 'Ir para o login'],
    mine: ['Meine Formulare', 'My forms', 'Meus formulários'], none: ['Noch keine Formulare.', 'No forms yet.', 'Nenhum formulário ainda.'],
    newA: ['Neues Formular', 'New form', 'Novo formulário'], edit: ['Bearbeiten', 'Edit', 'Editar'], del: ['Löschen', 'Delete', 'Excluir'],
    delQ: ['Dieses Formular wirklich löschen?', 'Really delete this form?', 'Excluir este formulário?'],
    save: ['Speichern & testen', 'Save & test', 'Salvar e testar'], back: ['Zurück', 'Back', 'Voltar'],
    saved: ['Gespeichert! Eine Test-E-Mail ging an deine Adresse. Unten siehst du die Vorschau, auch dort gesendete Nachrichten kommen wirklich an.', 'Saved! A test email was sent to your address. You can see the preview below; messages sent there really arrive too.', 'Salvo! Um e-mail de teste foi enviado ao seu endereço. A prévia aparece embaixo; mensagens enviadas ali também chegam de verdade.'],
    kept: ['Gespeichert – leer lassen, um ihn zu behalten', 'Saved – leave empty to keep it', 'Salva – deixe vazio para manter'],
    eKey: ['Bitte gib deinen API-Schlüssel ein.', 'Please enter your API key.', 'Informe sua chave de API.'],
    eFrom: ['Bitte gib eine gültige Absender-E-Mail an (bei deinem Dienst bestätigt).', 'Please enter a valid sender email (verified with your service).', 'Informe um e-mail de remetente válido (verificado no seu serviço).'],
    eTest: ['Die Test-E-Mail konnte nicht gesendet werden. Prüfe Schlüssel und Absender. Antwort des Dienstes:', 'The test email could not be sent. Check key and sender. Response from the service:', 'Não foi possível enviar o e-mail de teste. Verifique chave e remetente. Resposta do serviço:'],
    embed: ['Dein Code für die Webseite', 'Your code for the website', 'Seu código para o site'],
    embedHint: ['Diese eine Zeile in den HTML-Code deiner Seite einfügen (kurz vor </body>).', 'Paste this single line into your page’s HTML (just before </body>).', 'Cole esta linha no HTML do seu site (logo antes de </body>).'],
    copy: ['Kopieren', 'Copy', 'Copiar'], copied: ['Kopiert!', 'Copied!', 'Copiado!'],
    sMail: ['Empfänger', 'Recipient', 'Destinatário'],
    sSend: ['E-Mail-Versand (dein eigener Dienst)', 'Email sending (your own service)', 'Envio de e-mail (seu próprio serviço)'],
    hSend: ['Die Nachrichten werden über DEIN Konto bei einem Mail-Dienst verschickt, nicht über unseres. Der Absender (E-Mail-Adresse) muss bei deinem Dienst bestätigt sein. Am einfachsten ist Brevo (Absender-Adresse per Klick bestätigen, keine eigene Domain nötig). Alternativ Gmail: dafür brauchst du ein Google-App-Passwort (Google-Konto → Sicherheit → 2-Schritt-Bestätigung → App-Passwörter). Dein Schlüssel wird verschlüsselt gespeichert und nie wieder angezeigt. Beim Speichern schicken wir dir eine Test-E-Mail.', 'Messages are sent through YOUR account at a mail service, not ours. The sender email address must be verified with your service. Brevo is the easiest (verify a sender address with one click, no own domain needed). Alternatively Gmail: you need a Google app password (Google Account → Security → 2-Step Verification → App passwords). Your key is stored encrypted and never shown again. When saving, we send you a test email.', 'As mensagens são enviadas pela SUA conta em um serviço de e-mail, não pela nossa. O endereço do remetente precisa estar verificado no seu serviço. O mais fácil é o Brevo (verificar o remetente com um clique, sem domínio próprio). Alternativamente o Gmail: você precisa de uma senha de app do Google (Conta Google → Segurança → Verificação em duas etapas → Senhas de app). Sua chave é armazenada criptografada e nunca mais exibida. Ao salvar, enviamos um e-mail de teste.'], sPerm: ['Was Besucher dürfen', 'What visitors may do', 'O que os visitantes podem fazer'], sLook: ['Aussehen & Texte', 'Appearance & texts', 'Aparência e textos'], sSec: ['Sicherheit', 'Security', 'Segurança'],
    eAuth: ['Sitzung abgelaufen. Bitte melde dich neu an.', 'Session expired. Please sign in again.', 'Sessão expirada. Entre novamente.'],
    eMail: ['Bitte gib eine gültige Empfänger-E-Mail an.', 'Please enter a valid recipient email.', 'Informe um e-mail de destino válido.'],
    eMax: ['Maximal 5 Formulare pro Konto.', 'Maximum 5 forms per account.', 'Máximo de 5 formulários por conta.'],
    eCfg: ['Server nicht fertig eingerichtet (Secret CONTACT_ENC_KEY fehlt).', 'Server not fully set up (secret CONTACT_ENC_KEY missing).', 'Servidor não configurado (falta o secret CONTACT_ENC_KEY).'],
    eFail: ['Speichern fehlgeschlagen.', 'Saving failed.', 'Falha ao salvar.'],
    opt: { auto: ['Automatisch', 'Automatic', 'Automático'], light: ['Hell', 'Light', 'Claro'], dark: ['Dunkel', 'Dark', 'Escuro'], right: ['Rechts', 'Right', 'Direita'], left: ['Links', 'Left', 'Esquerda'], system: ['System', 'System', 'Sistema'], serif: ['Serif', 'Serif', 'Serifa'], mono: ['Monospace', 'Monospace', 'Monoespaçada'],
      off: ['Nicht abfragen', 'Do not ask', 'Não perguntar'], optional: ['Optional', 'Optional', 'Opcional'], required: ['Pflicht', 'Required', 'Obrigatório'],
      images: ['Nur Bilder (JPG, PNG, GIF, WebP)', 'Images only (JPG, PNG, GIF, WebP)', 'Só imagens (JPG, PNG, GIF, WebP)'], docs: ['Bilder & Dokumente (PDF, Word, Excel, TXT …)', 'Images & documents (PDF, Word, Excel, TXT …)', 'Imagens e documentos (PDF, Word, Excel, TXT …)'], all: ['Alle (außer ausführbare Dateien)', 'All (except executable files)', 'Todos (exceto executáveis)'] }
  };
  var LN = { de: 'Deutsch', en: 'English', 'pt-BR': 'Português (BR)' };
  var O = function (k) { return X.opt[k] ? t(X.opt[k]) : (LN[k] || k); };
  var FIELDS = [
    ['sMail'],
    { k: 'to_email', g: 'priv', type: 'email', req: 1, label: ['Deine E-Mail-Adresse (hierhin werden die Nachrichten gesendet)', 'Your email address (messages are sent here)', 'Seu e-mail (as mensagens são enviadas para cá)'] },
    { k: 'subject_prefix', g: 'priv', type: 'text', label: ['Betreff-Präfix in deiner E-Mail (optional, z. B. [Webseite])', 'Subject prefix in your email (optional, e.g. [Website])', 'Prefixo do assunto no seu e-mail (opcional, ex.: [Site])'] },
    ['sSend', 'hSend'],
    { k: 'provider', g: 'priv', type: 'select', label: ['Mail-Dienst', 'Mail service', 'Serviço de e-mail'], opts: ['brevo', 'resend', 'sendgrid', 'gmail'], plain: { brevo: 'Brevo', resend: 'Resend', sendgrid: 'SendGrid', gmail: 'Gmail (App-Passwort)' } },
    { k: 'key', g: 'api', type: 'password', label: ['Dein API-Schlüssel bzw. bei Gmail dein App-Passwort', 'Your API key, or your app password for Gmail', 'Sua chave de API ou, no Gmail, sua senha de app'] },
    { k: 'from_email', g: 'priv', type: 'email', label: ['Absender-E-Mail (bei Gmail: deine Gmail-Adresse; sonst bei deinem Dienst bestätigt)', 'Sender email (for Gmail: your Gmail address; otherwise verified with your service)', 'E-mail do remetente (no Gmail: seu endereço Gmail; senão, verificado no seu serviço)'] },
    { k: 'from_name', g: 'priv', type: 'text', label: ['Absender-Name (optional)', 'Sender name (optional)', 'Nome do remetente (opcional)'] },
    ['sPerm'],
    { k: 'ask_name', g: 'pub', type: 'select', label: ['Name des Besuchers', 'Visitor’s name', 'Nome do visitante'], opts: ['optional', 'required', 'off'] },
    { k: 'ask_subject', g: 'pub', type: 'checkbox', label: ['Betreff-Feld anzeigen', 'Show subject field', 'Mostrar campo de assunto'], def: true },
    { k: 'attachments', g: 'pub', type: 'checkbox', label: ['Anhänge erlauben', 'Allow attachments', 'Permitir anexos'], def: false },
    { k: 'file_types', g: 'pub', type: 'select', label: ['Erlaubte Dateitypen', 'Allowed file types', 'Tipos de arquivo permitidos'], opts: ['images', 'docs', 'all'], def: 'docs' },
    { k: 'max_files', g: 'pub', type: 'number', min: 1, max: 5, label: ['Max. Anzahl Dateien (1–5)', 'Max. number of files (1–5)', 'Máx. de arquivos (1–5)'], def: 3 },
    { k: 'max_mb', g: 'pub', type: 'number', min: 1, max: 5, label: ['Max. Größe pro Datei in MB (1–5)', 'Max. size per file in MB (1–5)', 'Tamanho máx. por arquivo em MB (1–5)'], def: 5 },
    { k: 'max_chars', g: 'pub', type: 'number', min: 100, max: 5000, label: ['Max. Zeichen pro Nachricht (100–5000)', 'Max. characters per message (100–5000)', 'Máx. de caracteres por mensagem (100–5000)'], def: 1500 },
    ['sLook'],
    { k: 'title', g: 'pub', type: 'text', label: ['Titel', 'Title', 'Título'] },
    { k: 'intro', g: 'pub', type: 'textarea', label: ['Einleitungstext (leer = Standardtext in der Sprache des Besuchers)', 'Intro text (empty = default text in the visitor’s language)', 'Texto de introdução (vazio = texto padrão no idioma do visitante)'] },
    { k: 'success', g: 'pub', type: 'text', label: ['Text nach dem Senden (leer = Standardtext)', 'Text after sending (empty = default text)', 'Texto após o envio (vazio = padrão)'] },
    { k: 'emoji', g: 'pub', type: 'text', label: ['Emoji am Knopf', 'Emoji on the button', 'Emoji do botão'], def: '✉️' },
    { k: 'launcher', g: 'pub', type: 'text', label: ['Text am Knopf (optional)', 'Button text (optional)', 'Texto do botão (opcional)'] },
    { k: 'color', g: 'pub', type: 'color', label: ['Hauptfarbe', 'Main color', 'Cor principal'], def: '#A8442E' },
    { k: 'theme', g: 'pub', type: 'select', label: ['Design', 'Theme', 'Tema'], opts: ['auto', 'light', 'dark'] },
    { k: 'position', g: 'pub', type: 'select', label: ['Position', 'Position', 'Posição'], opts: ['right', 'left'] },
    { k: 'font', g: 'pub', type: 'select', label: ['Schrift', 'Font', 'Fonte'], opts: ['system', 'serif', 'mono'] },
    { k: 'radius', g: 'pub', type: 'number', min: 0, max: 28, label: ['Rundung (0–28)', 'Roundness (0–28)', 'Arredondamento (0–28)'], def: 14 },
    { k: 'lang', g: 'pub', type: 'select', label: ['Sprache des Formulars', 'Form language', 'Idioma do formulário'], opts: ['auto', 'de', 'en', 'pt-BR'] },
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
    if (e && e.error === 'mail_test_failed') return msg(t(X.eTest) + ' ' + (e.detail || ''), true);
    var m = e && e.error === 'max_forms' ? X.eMax : e && e.error === 'bad_email' ? X.eMail : e && e.error === 'bad_from' ? X.eFrom : e && e.error === 'key_required' ? X.eKey : e && (e.error === 'no_enc_key' || e.error === 'no_mail_setup') ? X.eCfg : X.eFail;
    msg(t(m), true);
  }

  function list() {
    window.KKContact.destroy();
    call({ action: 'list' }).then(function (j) {
      var cards = j.forms.map(function (a) {
        return h('div', { class: 'card' }, [h('b', { text: a.pub.title || a.priv.to_email || a.id }), h('div', { class: 'small muted', text: a.priv.to_email + ' · ' + a.id }), h('div', { class: 'row' }, [
          h('button', { class: 'b', type: 'button', text: t(X.edit), onclick: function () { form(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delQ))) call({ action: 'delete', id: a.id }).then(list).catch(fail); } })])]);
      });
      mount([h('h1', { text: t(X.title) }), h('p', { class: 'muted', text: t(X.intro) }), guide(true), h('h2', { text: t(X.mine) })]
        .concat(cards.length ? cards : [h('p', { class: 'muted', text: t(X.none) })])
        .concat([h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newA), onclick: function () { form(null); } })])]));
    }).catch(fail);
  }

  function form(a) {
    var inputs = {}, id = a ? a.id : '';
    var val = function (f) {
      if (f.g === 'api') return '';
      var src = a ? (f.g === 'pub' ? a.pub : a.priv) : null;
      if (src && src[f.k] != null) return src[f.k];
      return f.def != null ? f.def : '';
    };
    var nodes = [h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: a ? (a.pub.title || a.priv.to_email) : t(X.newA) })];
    nodes.push(guide(false));
    FIELDS.forEach(function (f) {
      if (Array.isArray(f)) { nodes.push(h('h2', { text: t(X[f[0]]) })); if (f[1]) nodes.push(h('p', { class: 'muted small', text: t(X[f[1]]) })); return; }
      var lb = h('label', { text: t(f.label), for: 'f_' + f.k }), el, v = val(f);
      if (f.type === 'select') { el = h('select', { id: 'f_' + f.k }, f.opts.map(function (o) { return h('option', { value: o, text: f.plain ? f.plain[o] : O(o) }); })); el.value = v || f.opts[0]; }
      else if (f.type === 'textarea') { el = h('textarea', { id: 'f_' + f.k }); el.value = v; }
      else if (f.type === 'checkbox') { el = h('input', { id: 'f_' + f.k, type: 'checkbox' }); el.checked = !!v; lb = h('label', null, [el, ' ' + t(f.label)]); inputs[f.k] = { f: f, el: el }; nodes.push(lb); return; }
      else { el = h('input', { id: 'f_' + f.k, type: f.type, autocomplete: 'off', min: f.min, max: f.max }); el.value = v; if (f.k === 'key' && a && a.priv.has_key) el.placeholder = t(X.kept); if (f.k === 'color' && !/^#[0-9a-f]{6}$/i.test(v)) el.value = '#A8442E'; }
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
        (f.g === 'pub' ? body.pub : f.g === 'priv' ? body.priv : body)[k] = v;
      });
      var em = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!em.test(body.priv.to_email || '')) return msg(t(X.eMail), true);
      if (!em.test(body.priv.from_email || '')) return msg(t(X.eFrom), true);
      if (!body.key && !(a && a.priv.has_key && a.priv.provider === body.priv.provider)) return msg(t(X.eKey), true);
      call(body).then(function (j) {
        a = j.form; id = a.id; msg(t(X.saved)); embed(id); inputs.key.el.value = ''; inputs.key.el.placeholder = t(X.kept);
        window.KKContact.mount({ id: id, cfg: a.pub, open: true });
      }).catch(fail);
    } })]), out);
    if (a) embed(a.id);
    mount(nodes);
    if (a) window.KKContact.mount({ id: a.id, cfg: a.pub, open: false });
  }


  /* ---------- Anleitung (für Devs sichtbar) ---------- */
  X.guideTitle = ['Anleitung', 'Guide', 'Guia'];
  var G = [
    { open: 1, title: ['So funktioniert es (3 Schritte)', 'How it works (3 steps)', 'Como funciona (3 passos)'], steps: [
      ['Formular anlegen: Trag deine E-Mail-Adresse ein, wähle deinen Mail-Dienst und lege fest, was Besucher dürfen (z. B. Anhänge).', 'Create a form: enter your email address, choose your mail service and decide what visitors may do (e.g. attachments).', 'Criar o formulário: informe seu e-mail, escolha seu serviço de e-mail e defina o que os visitantes podem fazer (ex.: anexos).'],
      ['Auf „Speichern & testen“ tippen. Du bekommst eine Test-E-Mail. Kommt sie an, ist alles richtig. Bei einem Fehler siehst du den Grund und es wird nichts gespeichert.', 'Tap “Save & test”. You will receive a test email. If it arrives, everything is correct. If there is an error you will see the reason and nothing is saved.', 'Toque em “Salvar e testar”. Você recebe um e-mail de teste. Se chegar, está tudo certo. Em caso de erro, você vê o motivo e nada é salvo.'],
      ['Den angezeigten Code („Dein Code für die Webseite“) kopieren und kurz vor </body> deiner Webseite einfügen. Fertig: Nachrichten von Besuchern kommen per E-Mail bei dir an, und „Antworten“ geht direkt an den Besucher.', 'Copy the code shown (“Your code for the website”) and paste it just before </body> on your website. Done: visitors’ messages arrive by email, and “Reply” goes straight to the visitor.', 'Copie o código exibido (“Seu código para o site”) e cole logo antes de </body> no seu site. Pronto: as mensagens dos visitantes chegam por e-mail e “Responder” vai direto ao visitante.']
    ] },
    { title: ['Mail-Dienst einrichten: Brevo (am einfachsten)', 'Set up your mail service: Brevo (easiest)', 'Configurar o serviço de e-mail: Brevo (mais fácil)'], steps: [
      ['Kostenloses Konto auf brevo.com anlegen.', 'Create a free account at brevo.com.', 'Criar uma conta gratuita em brevo.com.'],
      ['Absender bestätigen: Senders, Domains & dedicated IPs → Senders → Add a sender. Name und E-Mail eintragen, den Bestätigungslink in der Mail anklicken.', 'Verify a sender: Senders, Domains & dedicated IPs → Senders → Add a sender. Enter name and email, click the confirmation link in the email.', 'Verificar o remetente: Senders, Domains & dedicated IPs → Senders → Add a sender. Informe nome e e-mail e clique no link de confirmação.'],
      ['API-Schlüssel: SMTP & API → API Keys → Generate a new API key. Kopieren (wird nur einmal angezeigt).', 'API key: SMTP & API → API Keys → Generate a new API key. Copy it (shown only once).', 'Chave de API: SMTP & API → API Keys → Generate a new API key. Copie (exibida só uma vez).'],
      ['Hier: Dienst „Brevo“ wählen, Schlüssel einfügen, als Absender-E-Mail genau die bestätigte Adresse eintragen.', 'Here: choose “Brevo”, paste the key, and enter exactly the verified address as sender email.', 'Aqui: escolha “Brevo”, cole a chave e informe exatamente o endereço verificado como e-mail do remetente.']
    ] },
    { title: ['Mail-Dienst einrichten: Gmail (App-Passwort)', 'Set up your mail service: Gmail (app password)', 'Configurar o serviço de e-mail: Gmail (senha de app)'], steps: [
      ['Im Google-Konto die 2-Schritt-Bestätigung aktivieren (myaccount.google.com → Sicherheit). Ohne sie gibt es keine App-Passwörter.', 'Turn on 2-Step Verification in your Google Account (myaccount.google.com → Security). Without it there are no app passwords.', 'Ative a verificação em duas etapas na conta Google (myaccount.google.com → Segurança). Sem ela não há senhas de app.'],
      ['myaccount.google.com/apppasswords öffnen, einen Namen eingeben (z. B. „Kontaktformular“), auf „Erstellen“ tippen. Das 16-stellige Passwort kopieren (wird nur einmal angezeigt, Leerzeichen sind egal).', 'Open myaccount.google.com/apppasswords, enter a name (e.g. “Contact form”), tap “Create”. Copy the 16-character password (shown only once, spaces don’t matter).', 'Abra myaccount.google.com/apppasswords, informe um nome (ex.: “Formulário de contato”) e toque em “Criar”. Copie a senha de 16 caracteres (exibida só uma vez, espaços não importam).'],
      ['Hier: Dienst „Gmail (App-Passwort)“ wählen, das App-Passwort als Schlüssel einfügen und als Absender-E-Mail deine Gmail-Adresse eintragen (die, zu der das App-Passwort gehört). Das normale Google-Passwort funktioniert nicht.', 'Here: choose “Gmail (App-Passwort)”, paste the app password as the key and enter your Gmail address as sender email (the one the app password belongs to). Your normal Google password will not work.', 'Aqui: escolha “Gmail (App-Passwort)”, cole a senha de app como chave e informe seu endereço Gmail como remetente (o da senha de app). A senha normal do Google não funciona.'],
      ['Tipp: Am besten ein eigenes Gmail-Konto nur für das Formular nutzen. Ein App-Passwort erlaubt das Senden im Namen des Kontos; bei Missbrauch kannst du es auf der App-Passwörter-Seite löschen.', 'Tip: ideally use a separate Gmail account just for the form. An app password allows sending on behalf of the account; if it is misused you can delete it on the app passwords page.', 'Dica: o ideal é usar uma conta Gmail só para o formulário. Uma senha de app permite enviar em nome da conta; em caso de abuso, exclua-a na página de senhas de app.']
    ] },
    { title: ['Mail-Dienst einrichten: Resend', 'Set up your mail service: Resend', 'Configurar o serviço de e-mail: Resend'], steps: [
      ['Konto auf resend.com anlegen, unter API Keys einen Schlüssel mit „Sending access“ erzeugen.', 'Create an account at resend.com and create a key with “Sending access” under API Keys.', 'Crie uma conta em resend.com e gere uma chave com “Sending access” em API Keys.'],
      ['Eigene Domain unter Domains hinzufügen, die DNS-Einträge bei deinem Domain-Anbieter setzen und „Verify“ klicken. Absender z. B. kontakt@deine-domain.de.', 'Add your own domain under Domains, set the DNS records at your domain provider and click “Verify”. Sender e.g. contact@your-domain.com.', 'Adicione seu domínio em Domains, configure os registros DNS no seu provedor e clique em “Verify”. Remetente, ex.: contato@seu-dominio.com.'],
      ['Ohne eigene Domain geht nur der Testbetrieb (Absender onboarding@resend.dev, Versand nur an die Adresse deines Resend-Kontos).', 'Without your own domain only test mode works (sender onboarding@resend.dev, sending only to your Resend account’s address).', 'Sem domínio próprio só funciona o modo de teste (remetente onboarding@resend.dev, envio apenas para o endereço da sua conta Resend).']
    ] },
    { title: ['Mail-Dienst einrichten: SendGrid', 'Set up your mail service: SendGrid', 'Configurar o serviço de e-mail: SendGrid'], steps: [
      ['Konto auf sendgrid.com anlegen.', 'Create an account at sendgrid.com.', 'Crie uma conta em sendgrid.com.'],
      ['Absender bestätigen: Settings → Sender Authentication → Single Sender Verification, Bestätigungslink anklicken.', 'Verify a sender: Settings → Sender Authentication → Single Sender Verification, click the confirmation link.', 'Verificar o remetente: Settings → Sender Authentication → Single Sender Verification e clique no link de confirmação.'],
      ['Schlüssel: Settings → API Keys → Create API Key mit der Berechtigung „Mail Send“. Hier einfügen und die bestätigte Adresse als Absender eintragen.', 'Key: Settings → API Keys → Create API Key with “Mail Send” permission. Paste it here and enter the verified address as sender.', 'Chave: Settings → API Keys → Create API Key com permissão “Mail Send”. Cole aqui e informe o endereço verificado como remetente.']
    ] },
    { title: ['Code in die Webseite einfügen', 'Adding the code to your website', 'Adicionar o código ao site'], steps: [
      ['Den Code kurz vor </body> in den HTML-Code deiner Seite einfügen. Bei Baukästen (Wix, Jimdo, WordPress usw.) gibt es dafür meist einen Bereich „Eigener Code“ bzw. „Custom Code“ im Seitenende (Footer).', 'Paste the code just before </body> in your page’s HTML. Website builders (Wix, Jimdo, WordPress etc.) usually have a “Custom code” area in the page footer.', 'Cole o código logo antes de </body> no HTML da página. Construtores de sites (Wix, Jimdo, WordPress etc.) geralmente têm uma área “Código personalizado” no rodapé.'],
      ['Änderungen, die du hier später speicherst, gelten sofort. Der Code auf deiner Webseite muss dafür nicht geändert werden.', 'Changes you save here later apply immediately. You do not have to change the code on your website.', 'Alterações salvas aqui depois valem imediatamente. Você não precisa mudar o código no seu site.'],
      ['Zusätzlich möglich: data-open="true" im Code (Fenster startet geöffnet) oder data-lang="de" (Sprache fest). Mit „Erlaubte Domains“ legst du fest, auf welchen Webseiten das Formular funktioniert.', 'Optional: data-open="true" in the code (window starts open) or data-lang="en" (fixed language). With “Allowed domains” you decide on which websites the form works.', 'Opcional: data-open="true" no código (janela inicia aberta) ou data-lang="pt-BR" (idioma fixo). Em “Domínios permitidos” você define em quais sites o formulário funciona.']
    ] },
    { title: ['Probleme?', 'Problems?', 'Problemas?'], steps: [
      ['Test-E-Mail kommt nicht an: Die Fehlermeldung beim Speichern nennt den Grund. Meist stimmt der Schlüssel nicht oder die Absender-Adresse ist beim Dienst nicht bestätigt. Auch den Spam-Ordner prüfen.', 'Test email does not arrive: the error message when saving gives the reason. Usually the key is wrong or the sender address is not verified with the service. Also check your spam folder.', 'O e-mail de teste não chega: a mensagem de erro ao salvar mostra o motivo. Geralmente a chave está errada ou o remetente não está verificado no serviço. Verifique também o spam.'],
      ['Fenster erscheint nicht: Prüfe, ob der Code vor </body> steht und ob deine Webseite unter „Erlaubte Domains“ eingetragen ist (oder das Feld leer ist).', 'Window does not appear: check that the code is before </body> and that your website is listed under “Allowed domains” (or the field is empty).', 'A janela não aparece: verifique se o código está antes de </body> e se seu site está em “Domínios permitidos” (ou o campo está vazio).'],
      ['Schlüssel ändern: Neuen Schlüssel eintragen und speichern. Lässt du das Feld leer, bleibt der gespeicherte Schlüssel erhalten.', 'Changing the key: enter a new key and save. If you leave the field empty, the stored key is kept.', 'Trocar a chave: informe uma nova chave e salve. Se deixar o campo vazio, a chave salva é mantida.']
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

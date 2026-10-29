/* Karteikasten Developer · KI-Agent-Builder (nutzt die Anmeldung der Developer-Seite) */
(function () {
  'use strict';
  var API = 'https://qujcvvxdvpqnsfgvleid.supabase.co/functions/v1/agent';
  var WIDGET = 'https://ajaronn.github.io/vokdev/widget.js';
  var view = document.getElementById('view');
  var L = (function () { var s = null; try { s = localStorage.getItem('kk_lang'); } catch (e) { } if (s === 'de' || s === 'en' || s === 'pt-BR') return s; var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  var I = L === 'en' ? 1 : L === 'pt-BR' ? 2 : 0;
  document.documentElement.lang = L;
  function t(a) { return a[I]; }

  var X = {
    title: ['KI-Agent erstellen', 'Create an AI agent', 'Criar agente de IA'],
    intro: ['Baue einen eigenen Chat-Agenten für deine Webseite: mit deiner eigenen KI-API, eigenem Aussehen und eigenem Wissen. Am Ende fügst du nur eine Zeile Code in deine Seite ein.', 'Build your own chat agent for your website: with your own AI API, your own look and your own knowledge. In the end you only add one line of code to your site.', 'Crie seu próprio agente de chat para o seu site: com sua própria API de IA, visual próprio e conhecimento próprio. No final, você só adiciona uma linha de código ao site.'],
    login: ['Bitte melde dich zuerst auf der Developer-Seite an.', 'Please sign in on the developer page first.', 'Entre primeiro na página de desenvolvedor.'],
    loginBtn: ['Zur Anmeldung', 'Go to sign-in', 'Ir para o login'],
    mine: ['Meine Agenten', 'My agents', 'Meus agentes'], none: ['Noch keine Agenten.', 'No agents yet.', 'Nenhum agente ainda.'],
    newA: ['Neuer Agent', 'New agent', 'Novo agente'], edit: ['Bearbeiten', 'Edit', 'Editar'], del: ['Löschen', 'Delete', 'Excluir'],
    delQ: ['Diesen Agenten wirklich löschen?', 'Really delete this agent?', 'Excluir este agente?'],
    save: ['Speichern & testen', 'Save & test', 'Salvar e testar'], back: ['Zurück', 'Back', 'Voltar'],
    saved: ['Gespeichert! Unten rechts siehst du die Vorschau.', 'Saved! You can see the preview at the bottom.', 'Salvo! A prévia aparece embaixo.'],
    embed: ['Dein Code für die Webseite', 'Your code for the website', 'Seu código para o site'],
    embedHint: ['Diese eine Zeile in den HTML-Code deiner Seite einfügen (kurz vor </body>).', 'Paste this single line into your page’s HTML (just before </body>).', 'Cole esta linha no HTML do seu site (logo antes de </body>).'],
    copy: ['Kopieren', 'Copy', 'Copiar'], copied: ['Kopiert!', 'Copied!', 'Copiado!'],
    sLook: ['Aussehen', 'Appearance', 'Aparência'], sText: ['Texte', 'Texts', 'Textos'], sKnow: ['Wissen & Verhalten', 'Knowledge & behavior', 'Conhecimento e comportamento'], sApi: ['KI-Anbindung', 'AI connection', 'Conexão de IA'], sSec: ['Sicherheit', 'Security', 'Segurança'],
    kept: ['Gespeichert – leer lassen, um ihn zu behalten', 'Saved – leave empty to keep it', 'Salva – deixe vazio para manter'],
    eAuth: ['Sitzung abgelaufen. Bitte melde dich neu an.', 'Session expired. Please sign in again.', 'Sessão expirada. Entre novamente.'],
    eKey: ['Bitte gib deinen API-Schlüssel ein.', 'Please enter your API key.', 'Informe sua chave de API.'],
    eMax: ['Maximal 5 Agenten pro Konto.', 'Maximum 5 agents per account.', 'Máximo de 5 agentes por conta.'],
    eEnc: ['Server nicht fertig eingerichtet (Secret AGENT_ENC_KEY fehlt).', 'Server not fully set up (secret AGENT_ENC_KEY missing).', 'Servidor não configurado (falta o secret AGENT_ENC_KEY).'],
    eFail: ['Speichern fehlgeschlagen.', 'Saving failed.', 'Falha ao salvar.'],
    opt: { auto: ['Automatisch', 'Automatic', 'Automático'], light: ['Hell', 'Light', 'Claro'], dark: ['Dunkel', 'Dark', 'Escuro'], right: ['Rechts', 'Right', 'Direita'], left: ['Links', 'Left', 'Esquerda'],
      compact: ['Kompakt', 'Compact', 'Compacto'], large: ['Groß', 'Large', 'Grande'], system: ['System', 'System', 'Sistema'], serif: ['Serif', 'Serif', 'Serifa'], mono: ['Monospace', 'Monospace', 'Monoespaçada'] }
  };
  var O = function (k) { return t(X.opt[k]); };
  var FIELDS = [
    ['sLook'],
    { k: 'name', g: 'pub', type: 'text', label: ['Name des Agenten', 'Agent name', 'Nome do agente'], def: 'Assistant' },
    { k: 'subtitle', g: 'pub', type: 'text', label: ['Untertitel (z. B. „Antwortet sofort“)', 'Subtitle (e.g. “Replies instantly”)', 'Subtítulo (ex.: “Responde na hora”)'] },
    { k: 'logo', g: 'pub', type: 'url', label: ['Logo-URL (https://…, optional)', 'Logo URL (https://…, optional)', 'URL do logo (https://…, opcional)'] },
    { k: 'emoji', g: 'pub', type: 'text', label: ['Emoji, wenn kein Logo', 'Emoji if no logo', 'Emoji se não houver logo'], def: '💬' },
    { k: 'color', g: 'pub', type: 'color', label: ['Hauptfarbe', 'Main color', 'Cor principal'], def: '#A8442E' },
    { k: 'theme', g: 'pub', type: 'select', label: ['Design', 'Theme', 'Tema'], opts: ['auto', 'light', 'dark'] },
    { k: 'position', g: 'pub', type: 'select', label: ['Position', 'Position', 'Posição'], opts: ['right', 'left'] },
    { k: 'size', g: 'pub', type: 'select', label: ['Größe', 'Size', 'Tamanho'], opts: ['compact', 'large'] },
    { k: 'font', g: 'pub', type: 'select', label: ['Schrift', 'Font', 'Fonte'], opts: ['system', 'serif', 'mono'] },
    { k: 'radius', g: 'pub', type: 'number', label: ['Rundung (0–28)', 'Roundness (0–28)', 'Arredondamento (0–28)'], def: 14 },
    { k: 'launcher', g: 'pub', type: 'text', label: ['Text am Chat-Knopf (optional)', 'Chat button text (optional)', 'Texto do botão (opcional)'] },
    ['sText'],
    { k: 'welcome_de', g: 'pub', type: 'textarea', label: ['Begrüßung Deutsch', 'Welcome message German', 'Boas-vindas em alemão'] },
    { k: 'welcome_en', g: 'pub', type: 'textarea', label: ['Begrüßung Englisch', 'Welcome message English', 'Boas-vindas em inglês'] },
    { k: 'welcome_pt', g: 'pub', type: 'textarea', label: ['Begrüßung Portugiesisch (BR)', 'Welcome message Portuguese (BR)', 'Boas-vindas em português (BR)'] },
    { k: 'suggestions', g: 'pub', type: 'textarea', label: ['Vorschlags-Fragen (eine pro Zeile, max. 4)', 'Suggested questions (one per line, max 4)', 'Perguntas sugeridas (uma por linha, máx. 4)'] },
    { k: 'contact', g: 'pub', type: 'email', label: ['Kontakt-E-Mail (optional)', 'Contact email (optional)', 'E-mail de contato (opcional)'] },
    { k: 'lang', g: 'pub', type: 'select', label: ['Sprache des Chats', 'Chat language', 'Idioma do chat'], opts: ['auto', 'de', 'en', 'pt-BR'] },
    ['sKnow'],
    { k: 'persona', g: 'priv', type: 'textarea', label: ['Rolle & Ton (z. B. „Du bist der freundliche Support von …“)', 'Role & tone (e.g. “You are the friendly support of …”)', 'Papel e tom (ex.: “Você é o suporte simpático de …”)'] },
    { k: 'knowledge', g: 'priv', type: 'textarea', big: 1, label: ['Wissen des Agenten (Texte, FAQ, Preise, Öffnungszeiten … bis 20.000 Zeichen)', 'Agent knowledge (texts, FAQ, prices, hours … up to 20,000 characters)', 'Conhecimento do agente (textos, FAQ, preços, horários … até 20.000 caracteres)'] },
    { k: 'rules', g: 'priv', type: 'textarea', label: ['Regeln (z. B. „Nenne nie Preise“)', 'Rules (e.g. “Never mention prices”)', 'Regras (ex.: “Nunca cite preços”)'] },
    { k: 'strict', g: 'priv', type: 'checkbox', label: ['Nur aus dem Wissen antworten', 'Answer only from the knowledge', 'Responder só com base no conhecimento'] },
    ['sApi'],
    { k: 'provider', g: 'api', type: 'select', label: ['Anbieter', 'Provider', 'Provedor'], opts: ['gemini', 'openai', 'anthropic'], plain: { gemini: 'Google Gemini', openai: 'OpenAI / kompatibel (Groq, OpenRouter, Mistral …)', anthropic: 'Anthropic Claude' } },
    { k: 'key', g: 'api', type: 'password', label: ['Dein API-Schlüssel', 'Your API key', 'Sua chave de API'] },
    { k: 'model', g: 'api', type: 'text', label: ['Modell (leer = Standard)', 'Model (empty = default)', 'Modelo (vazio = padrão)'] },
    { k: 'base', g: 'api', type: 'url', label: ['Eigene API-URL (nur OpenAI-kompatibel, z. B. https://api.groq.com/openai/v1)', 'Custom API URL (OpenAI-compatible only, e.g. https://api.groq.com/openai/v1)', 'URL da API (só compatível com OpenAI, ex.: https://api.groq.com/openai/v1)'] },
    ['sSec'],
    { k: 'domains', g: 'priv', type: 'text', label: ['Erlaubte Domains (kommagetrennt, leer = alle), z. B. meineseite.de', 'Allowed domains (comma-separated, empty = all), e.g. mysite.com', 'Domínios permitidos (separados por vírgula, vazio = todos), ex.: meusite.com'] },
    { k: 'max_chars', g: 'priv', type: 'number', label: ['Max. Zeichen pro Nachricht', 'Max. characters per message', 'Máx. de caracteres por mensagem'], def: 500 }
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
  function msg(text, err) { var m = h('div', { class: 'msg' + (err ? ' err' : ''), role: 'status', text: text }); view.insertBefore(m, view.firstChild); window.scrollTo(0, 0); setTimeout(function () { m.remove(); }, 6000); }
  function loginView() {
    mount([h('h1', { text: t(X.title) }), h('p', { text: t(X.login) }), h('a', { class: 'btn', href: 'index.html#/apps', text: t(X.loginBtn), style: 'display:inline-block;padding:10px 16px;border-radius:8px;background:var(--rust);color:var(--rust-contrast);text-decoration:none;font-weight:600' })]);
  }
  function fail(e) {
    if (e && e.auth) return loginView();
    var m = e && e.error === 'max_agents' ? X.eMax : e && e.error === 'key_required' ? X.eKey : e && e.error === 'no_enc_key' ? X.eEnc : X.eFail;
    msg(t(m), true);
  }

  function list() {
    window.KKAgent.destroy();
    call({ action: 'list' }).then(function (j) {
      var cards = j.agents.map(function (a) {
        return h('div', { class: 'card' }, [h('b', { text: a.name }), h('div', { class: 'small muted', text: a.id }), h('div', { class: 'row' }, [
          h('button', { class: 'b', type: 'button', text: t(X.edit), onclick: function () { form(a); } }),
          h('button', { class: 'b s', type: 'button', text: t(X.del), onclick: function () { if (confirm(t(X.delQ))) call({ action: 'delete', id: a.id }).then(list).catch(fail); } })])]);
      });
      mount([h('h1', { text: t(X.title) }), h('p', { class: 'muted', text: t(X.intro) }), h('h2', { text: t(X.mine) })]
        .concat(cards.length ? cards : [h('p', { class: 'muted', text: t(X.none) })])
        .concat([h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: '+ ' + t(X.newA), onclick: function () { form(null); } })])]));
    }).catch(fail);
  }

  function form(a) {
    var inputs = {}, id = a ? a.id : '';
    var val = function (f) {
      if (!a) return f.def != null ? f.def : '';
      if (f.g === 'pub') return f.k === 'suggestions' ? (a.pub.suggestions || []).join('\n') : (a.pub[f.k] != null ? a.pub[f.k] : f.def != null ? f.def : '');
      if (f.g === 'priv') return a.priv[f.k] != null ? a.priv[f.k] : f.def != null ? f.def : '';
      return f.k === 'provider' ? a.provider : f.k === 'model' ? a.model : f.k === 'base' ? a.base : '';
    };
    var nodes = [h('p', null, [h('a', { href: '#', text: '← ' + t(X.back), onclick: function (e) { e.preventDefault(); list(); } })]), h('h1', { text: a ? a.name : t(X.newA) })];
    FIELDS.forEach(function (f) {
      if (Array.isArray(f)) { nodes.push(h('h2', { text: t(X[f[0]]) })); return; }
      var lb = h('label', { text: t(f.label), for: 'f_' + f.k }), el, v = val(f);
      if (f.type === 'select') { el = h('select', { id: 'f_' + f.k }, f.opts.map(function (o) { return h('option', { value: o, text: f.plain ? f.plain[o] : O(o) || o }); })); el.value = v || f.opts[0]; }
      else if (f.type === 'textarea') { el = h('textarea', { id: 'f_' + f.k, class: f.big ? 'big' : '' }); el.value = v; }
      else if (f.type === 'checkbox') { el = h('input', { id: 'f_' + f.k, type: 'checkbox' }); el.checked = !!v; lb = h('label', null, [el, ' ' + t(f.label)]); inputs[f.k] = { f: f, el: el }; nodes.push(lb); return; }
      else { el = h('input', { id: 'f_' + f.k, type: f.type, autocomplete: 'off' }); el.value = v; if (f.k === 'key' && a && a.has_key) el.placeholder = t(X.kept); if (f.k === 'color' && !/^#[0-9a-f]{6}$/i.test(v)) el.value = '#A8442E'; }
      inputs[f.k] = { f: f, el: el }; nodes.push(lb, el);
    });
    var out = h('div');
    function embed(newId) {
      out.textContent = '';
      var code = '<script src="' + WIDGET + '" data-agent="' + newId + '" defer></' + 'script>';
      out.appendChild(h('h2', { text: t(X.embed) })); out.appendChild(h('p', { class: 'muted', text: t(X.embedHint) })); out.appendChild(h('pre', { text: code }));
      out.appendChild(h('button', { class: 'b s', type: 'button', text: t(X.copy), onclick: function (e) { var b = e.target; (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { b.textContent = t(X.copied); }).catch(function () { b.textContent = '⌥'; }); } }));
    }
    nodes.push(h('div', { class: 'row' }, [h('button', { class: 'b', type: 'button', text: t(X.save), onclick: function () {
      var body = { action: 'save', id: id, pub: {}, priv: {} };
      Object.keys(inputs).forEach(function (k) {
        var f = inputs[k].f, el = inputs[k].el, v = f.type === 'checkbox' ? el.checked : el.value;
        if (f.g === 'pub') body.pub[k] = k === 'suggestions' ? v.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : v;
        else if (f.g === 'priv') body.priv[k] = v; else body[k] = v;
      });
      call(body).then(function (j) {
        a = j.agent; id = a.id; msg(t(X.saved)); embed(id);
        window.KKAgent.mount({ id: id, cfg: a.pub, open: true });
        if (inputs.key.el.value) { inputs.key.el.value = ''; inputs.key.el.placeholder = t(X.kept); }
      }).catch(fail);
    } })]), out);
    if (a) embed(a.id);
    mount(nodes);
    if (a) window.KKAgent.mount({ id: a.id, cfg: a.pub, open: false });
  }

  var s = session();
  if (!s || !s.access_token) loginView(); else list();
})();

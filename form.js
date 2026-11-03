/* Karteikasten Developer · Eigene Formularseite
   Aufruf: form.html?id=FORMULAR-ID   (optional &lang=de|en|pt-BR) */
(function () {
  'use strict';
  var q = location.search;
  var id = (q.match(/[?&]id=([0-9a-z]{4,20})/) || [])[1];
  var lang = (q.match(/[?&]lang=(de|en|pt-BR)/) || [])[1];
  var M = {
    de: ['Formular nicht gefunden', 'Dieses Formular existiert nicht oder wurde gelöscht.', 'Formular konnte nicht geladen werden. Bitte versuche es später noch einmal.'],
    en: ['Form not found', 'This form does not exist or was deleted.', 'The form could not be loaded. Please try again later.'],
    'pt-BR': ['Formulário não encontrado', 'Este formulário não existe ou foi excluído.', 'Não foi possível carregar o formulário. Tente novamente mais tarde.']
  };
  var l = lang || (function () { var n = String(navigator.language || 'de').toLowerCase(); return n.indexOf('pt') === 0 ? 'pt-BR' : n.indexOf('en') === 0 ? 'en' : 'de'; })();
  document.documentElement.lang = l;
  function show(kind) {
    var m = M[l], b = document.body;
    b.style.cssText = 'margin:0;font:16px/1.5 system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px';
    var d = document.createElement('div'), h = document.createElement('h1'), p = document.createElement('p');
    h.textContent = m[0]; p.textContent = kind === 'net' ? m[2] : m[1]; d.appendChild(h); d.appendChild(p); b.appendChild(d);
    document.title = m[0];
  }
  if (!id) return show('nf');
  window.KKSurvey.page(id, lang, show);
})();

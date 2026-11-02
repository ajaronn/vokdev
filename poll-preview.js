/* Vorschau im Rahmen: bekommt die Einstellungen per postMessage vom Builder und speichert nichts */
(function () {
  'use strict';
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.kkpoll !== 'cfg' || !e.data.cfg) return;
    var c = e.data.cfg;
    document.body.className = c.theme === 'dark' ? 'dark' : '';
    document.documentElement.lang = e.data.lang || 'de';
    try { window.KKPoll.mount({ id: 'preview', cfg: c, asPopup: true, dry: true }); } catch (x) { }
  });
})();

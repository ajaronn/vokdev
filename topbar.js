/* Kopfleiste am Handy ein-/ausblenden (Pfeil unten an der Leiste) */
(function () {
  'use strict';
  var top = document.querySelector('header.top');
  if (!top) return;
  var KEY = 'kkdev_topbar_collapsed';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'topfold';

  function get() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function set(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { } }
  function apply(c) {
    top.classList.toggle('collapsed', c);
    btn.textContent = c ? '▼' : '▲';
    var label = c ? 'Menü einblenden' : 'Menü ausblenden';
    btn.setAttribute('aria-label', window.kkT ? kkT(label) : label);
    btn.setAttribute('aria-expanded', c ? 'false' : 'true');
  }
  btn.addEventListener('click', function () {
    var c = !top.classList.contains('collapsed');
    set(c); apply(c);
  });
  top.appendChild(btn);
  apply(get());
})();

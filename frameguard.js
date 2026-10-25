/* Clickjacking-Schutz: nur anzeigen, wenn nicht in fremdem Frame */
if (window.top === window.self) { var g = document.getElementById('kkFrameGuard'); if (g) g.remove(); } else { try { window.top.location = window.self.location; } catch (e) { } }

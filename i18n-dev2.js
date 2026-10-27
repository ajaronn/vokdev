/* Zusätzliche Übersetzungen (de = Schlüssel, en, pt-BR) für FAQ, Consent-Vorschau und App-Statistiken.
   Muss NACH i18n.js geladen werden. */
kkAdd({
  /* --- Navigation / Titel --- */
  'Consent-Vorschau': ['Consent preview', 'Pré-visualização de consentimento'],
  'FAQ – Karteikasten Developer': ['FAQ – Karteikasten Developer', 'FAQ – Karteikasten Developer'],
  'Consent-Vorschau – Karteikasten Developer': ['Consent preview – Karteikasten Developer', 'Pré-visualização de consentimento – Karteikasten Developer'],

  /* --- FAQ-Seite --- */
  'FAQ und Troubleshooting': ['FAQ and troubleshooting', 'FAQ e solução de problemas'],
  'Typische Probleme bei der Anbindung und wie du sie löst.': ['Common problems when connecting your app and how to fix them.', 'Problemas comuns ao conectar seu app e como resolvê-los.'],
  'Fragen durchsuchen …': ['Search questions …', 'Pesquisar perguntas …'],
  'Keine passenden Einträge gefunden.': ['No matching entries found.', 'Nenhuma entrada correspondente encontrada.'],
  'Noch nicht gelöst?': ['Still not solved?', 'Ainda não resolveu?'],
  'Schreib uns über den Support.': ['Write to us via support.', 'Escreva para nós pelo suporte.'],
  'Mehr dazu in der FAQ.': ['More in the FAQ.', 'Mais na FAQ.'],

  '„redirect_uri passt nicht“ beim Anmelden': ['“redirect_uri does not match” when signing in', '“redirect_uri não corresponde” ao entrar'],
  'Die redirect_uri muss zeichengenau mit einem unter „Meine Apps“ eingetragenen Eintrag übereinstimmen: Schema (https), Host, Port, Pfad und abschließender Schrägstrich. Platzhalter gibt es nicht. Trage jede Variante (z. B. mit und ohne www, lokale Tests) einzeln ein, speichere die App und sende im Authorize- und im Token-Request exakt denselben Wert.':
    ['The redirect_uri must match an entry under “My apps” character by character: scheme (https), host, port, path and trailing slash. There are no wildcards. Add every variant (for example with and without www, local tests) separately, save the app and send exactly the same value in the authorize and the token request.',
     'A redirect_uri deve corresponder caractere por caractere a uma entrada em “Meus apps”: esquema (https), host, porta, caminho e barra final. Não há curingas. Adicione cada variante (por exemplo com e sem www, testes locais) separadamente, salve o app e envie exatamente o mesmo valor na requisição de autorização e na de token.'],

  'PKCE fehlt oder „invalid code_verifier“': ['PKCE missing or “invalid code_verifier”', 'PKCE ausente ou “invalid code_verifier”'],
  'PKCE ist Pflicht, auch für vertrauliche Clients. Sende beim Authorize code_challenge und code_challenge_method=S256 und beim Token-Request den passenden code_verifier (43 bis 128 Zeichen). Erzeuge den Verifier bei jeder Anmeldung neu und speichere ihn bis zum Callback (z. B. in sessionStorage), sonst passt er nach der Weiterleitung nicht mehr. Der Code-Generator liefert funktionierenden Code.':
    ['PKCE is mandatory, even for confidential clients. Send code_challenge and code_challenge_method=S256 in the authorize request and the matching code_verifier (43 to 128 characters) in the token request. Create a new verifier for every sign-in and keep it until the callback (for example in sessionStorage), otherwise it is gone after the redirect. The code generator produces working code.',
     'PKCE é obrigatório, mesmo para clientes confidenciais. Envie code_challenge e code_challenge_method=S256 na autorização e o code_verifier correspondente (43 a 128 caracteres) na requisição de token. Gere um novo verifier a cada login e guarde-o até o callback (por exemplo em sessionStorage), senão ele se perde após o redirecionamento. O gerador de código produz código funcional.'],

  '403 nach Widerruf oder bei einzelnen Endpunkten': ['403 after revocation or on single endpoints', '403 após revogação ou em endpoints específicos'],
  'Die API antwortet mit 403, wenn der Nutzer den Zugriff unter „Verbundene Apps“ widerrufen oder eine Berechtigung auf der Zustimmungsseite abgewählt hat, oder wenn dein Aufruf einen Scope braucht, den die App nicht hat. Prüfe zuerst die deklarierten Scopes. Behandle 403 so: gespeicherte Tokens löschen und den Nutzer erneut anmelden lassen, damit er die Berechtigung neu erteilen kann.':
    ['The API answers 403 when the user revoked access under “Connected apps”, deselected a permission on the consent page, or when your call needs a scope the app does not have. Check the declared scopes first. Handle 403 like this: delete the stored tokens and let the user sign in again so they can grant the permission anew.',
     'A API responde 403 quando o usuário revogou o acesso em “Apps conectados”, desmarcou uma permissão na página de consentimento ou quando sua chamada exige um escopo que o app não tem. Verifique primeiro os escopos declarados. Trate o 403 assim: apague os tokens salvos e peça que o usuário entre novamente para conceder a permissão de novo.'],

  'Refresh-Token abgelaufen oder „invalid_grant“': ['Refresh token expired or “invalid_grant”', 'Refresh token expirado ou “invalid_grant”'],
  'Ein Refresh-Token wird ungültig, wenn es abgelaufen ist, bereits verwendet wurde, die Sitzung beendet oder der Zugriff widerrufen wurde. Speichere nach jedem Refresh das neue Token-Paar und verwirf das alte. Starte keine parallelen Refreshes (z. B. aus mehreren Tabs). Bei invalid_grant hilft nur eine neue Anmeldung.':
    ['A refresh token becomes invalid when it has expired, was already used, the session ended or access was revoked. After every refresh, store the new token pair and discard the old one. Do not run refreshes in parallel (for example from several tabs). On invalid_grant only a new sign-in helps.',
     'Um refresh token fica inválido quando expirou, já foi usado, a sessão terminou ou o acesso foi revogado. A cada refresh, salve o novo par de tokens e descarte o antigo. Não faça refreshes em paralelo (por exemplo em várias abas). Com invalid_grant só um novo login resolve.'],

  '401 „Token ungültig“ bei API-Aufrufen': ['401 “invalid token” on API calls', '401 “token inválido” em chamadas da API'],
  'Das Access-Token ist abgelaufen oder fehlerhaft. Sende es im Header Authorization: Bearer … ohne Anführungszeichen, erneuere es vorher über das Refresh-Token und verwende nur Tokens, die deine eigene App erhalten hat.':
    ['The access token has expired or is malformed. Send it in the header Authorization: Bearer … without quotation marks, renew it beforehand with the refresh token and only use tokens your own app received.',
     'O access token expirou ou está malformado. Envie-o no cabeçalho Authorization: Bearer … sem aspas, renove-o antes com o refresh token e use apenas tokens que o seu próprio app recebeu.'],

  '429 Rate-Limit': ['429 rate limit', '429 limite de requisições'],
  'Erlaubt sind 120 Anfragen pro Minute je Nutzer und App. Fasse Änderungen zusammen (POST /lists/{id}/vocab nimmt bis zu 500 Einträge auf), cache Antworten und warte bei 429 mit steigenden Pausen, bevor du es erneut versuchst.':
    ['120 requests per minute are allowed per user and app. Batch your changes (POST /lists/{id}/vocab accepts up to 500 entries), cache responses and on 429 wait with increasing delays before retrying.',
     'São permitidas 120 requisições por minuto por usuário e app. Agrupe alterações (POST /lists/{id}/vocab aceita até 500 entradas), faça cache das respostas e, no 429, espere com pausas crescentes antes de tentar de novo.'],

  '409 bei gleichzeitigen Änderungen': ['409 on concurrent changes', '409 em alterações simultâneas'],
  'Zwei Änderungen an derselben Liste liefen gleichzeitig. Wiederhole die Anfrage nach kurzer Pause und sende Schreibzugriffe auf eine Liste nacheinander statt parallel.':
    ['Two changes to the same list ran at the same time. Retry the request after a short pause and send writes to one list one after another instead of in parallel.',
     'Duas alterações na mesma lista ocorreram ao mesmo tempo. Repita a requisição após uma breve pausa e envie as gravações em uma lista uma após a outra, não em paralelo.'],

  'Ich kann keine App anlegen oder ändern': ['I cannot create or edit an app', 'Não consigo criar ou editar um app'],
  'Dafür muss die Zwei-Faktor-Authentifizierung in Karteikasten aktiviert sein (Einstellungen → Konto). Außerdem gilt ein Limit an Apps je Konto. Das Logo darf höchstens 256 KB groß sein (PNG, JPG oder WebP).':
    ['Two-factor authentication must be enabled in Karteikasten (Settings → Account). There is also a limit on apps per account. The logo may be at most 256 KB (PNG, JPG or WebP).',
     'A autenticação em dois fatores precisa estar ativada no Karteikasten (Configurações → Conta). Também há um limite de apps por conta. O logotipo pode ter no máximo 256 KB (PNG, JPG ou WebP).'],

  'Die Zustimmungsseite zeigt „nicht geprüft“': ['The consent page says “not reviewed”', 'A página de consentimento mostra “não verificado”'],
  'Der Hinweis erscheint für Apps aus dem Developer-Bereich, wie du in der Consent-Vorschau siehst. Nutzer können trotzdem zustimmen. Fordere nur die Berechtigungen an, die du wirklich brauchst, das schafft Vertrauen.':
    ['The notice appears for apps from the developer area, as you can see in the consent preview. Users can still agree. Only request the permissions you really need, it builds trust.',
     'O aviso aparece para apps da área de desenvolvedores, como você vê na pré-visualização de consentimento. Os usuários ainda podem concordar. Peça só as permissões de que realmente precisa, isso gera confiança.'],

  /* --- Consent-Vorschau --- */
  'So sieht die Zustimmungsseite für die gewählten Berechtigungen aus. Nutzer können einzelne Berechtigungen abwählen. Probiere es in der Vorschau aus.':
    ['This is how the consent page looks for the selected permissions. Users can deselect single permissions. Try it in the preview.',
     'É assim que a página de consentimento aparece para as permissões selecionadas. Os usuários podem desmarcar permissões individuais. Experimente na pré-visualização.'],
  'Eigene App laden (optional)': ['Load one of your apps (optional)', 'Carregar um dos seus apps (opcional)'],
  '– keine –': ['– none –', '– nenhum –'],
  'App-Name': ['App name', 'Nome do app'],
  'Beschreibung': ['Description', 'Descrição'],
  'Keine Berechtigung ausgewählt.': ['No permission selected.', 'Nenhuma permissão selecionada.'],
  'Sensible Berechtigungen wie „Listen löschen“ werden auf der Zustimmungsseite hervorgehoben.':
    ['Sensitive permissions such as “Delete lists” are highlighted on the consent page.',
     'Permissões sensíveis como “Excluir listas” são destacadas na página de consentimento.'],

  /* --- Statistiken --- */
  'Statistiken': ['Statistics', 'Estatísticas'],
  'Zeitraum': ['Period', 'Período'],
  'Letzte 7 Tage': ['Last 7 days', 'Últimos 7 dias'],
  'Letzte 30 Tage': ['Last 30 days', 'Últimos 30 dias'],
  'Letzte 90 Tage': ['Last 90 days', 'Últimos 90 dias'],
  'Aktive Nutzer': ['Active users', 'Usuários ativos'],
  'Anfragen pro Tag (Ø)': ['Requests per day (avg.)', 'Requisições por dia (média)'],
  'Fehlerquote': ['Error rate', 'Taxa de erros'],
  'Statistiken werden geladen …': ['Loading statistics …', 'Carregando estatísticas …'],
  'Statistiken sind für diese App noch nicht verfügbar.': ['Statistics are not yet available for this app.', 'As estatísticas ainda não estão disponíveis para este app.'],
  'Noch keine Anfragen in diesem Zeitraum.': ['No requests in this period yet.', 'Ainda não há requisições neste período.'],
  'Anfragen pro Tag, Fehler hervorgehoben': ['Requests per day, errors highlighted', 'Requisições por dia, erros destacados'],
  'Fehler sind Antworten mit Status 400 oder höher. Gespeichert werden nur Zähler, keine Inhalte.':
    ['Errors are responses with status 400 or higher. Only counters are stored, no content.',
     'Erros são respostas com status 400 ou superior. Apenas contadores são armazenados, nenhum conteúdo.']
});

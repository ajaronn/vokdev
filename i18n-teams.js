/* Übersetzungen (de = Schlüssel, en, pt-BR) für Teams, Test-Modus und Änderungsverlauf.
   Muss NACH i18n.js und VOR teams.js/app.js geladen werden. */
kkAdd({
  /* Rollen */
  'Besitzer': ['Owner', 'Proprietário'],
  'Bearbeiter': ['Editor', 'Editor'],
  'Nur ansehen': ['View only', 'Somente leitura'],
  'Kein Zugriff': ['No access', 'Sem acesso'],
  'Mitglied': ['Member', 'Membro'],
  'Team-Besitzer': ['Team owner', 'Proprietário da equipe'],
  'Rolle': ['Role', 'Função'],

  /* Seite / Navigation */
  'Teams': ['Teams', 'Equipes'],
  'Teams & Apps': ['Teams & apps', 'Equipes e apps'],
  'Teams – Karteikasten Developer': ['Teams – Karteikasten Developer', 'Equipes – Karteikasten Developer'],
  'Bitte oben anmelden, um Teams zu nutzen.': ['Please sign in above to use teams.', 'Entre acima para usar equipes.'],
  'Name des neuen Teams': ['Name of the new team', 'Nome da nova equipe'],
  'Team erstellen': ['Create team', 'Criar equipe'],
  'Team löschen': ['Delete team', 'Excluir equipe'],
  'Team „{n}“ endgültig löschen?': ['Permanently delete team “{n}”?', 'Excluir definitivamente a equipe “{n}”?'],
  'Deine Rolle im Team: {r}': ['Your role in the team: {r}', 'Sua função na equipe: {r}'],

  /* Mitglieder / Einladungen */
  'Mitglieder': ['Members', 'Membros'],
  'Entfernen': ['Remove', 'Remover'],
  'Verlassen': ['Leave', 'Sair'],
  'Wirklich?': ['Are you sure?', 'Tem certeza?'],
  'Eingeladen: {e}': ['Invited: {e}', 'Convidado: {e}'],
  'Zurückziehen': ['Withdraw', 'Cancelar convite'],
  'E-Mail der Person': ['Email of the person', 'E-mail da pessoa'],
  'Per E-Mail einladen': ['Invite by email', 'Convidar por e-mail'],
  'Einladung gesendet.': ['Invitation sent.', 'Convite enviado.'],
  'Du bist dem Team beigetreten.': ['You have joined the team.', 'Você entrou na equipe.'],

  /* Projekte */
  'Projekte': ['Projects', 'Projetos'],
  'Projektname': ['Project name', 'Nome do projeto'],
  'Projekt erstellen': ['Create project', 'Criar projeto'],
  'Projekt löschen': ['Delete project', 'Excluir projeto'],
  'Projekt „{n}“ löschen? Apps bleiben erhalten.': ['Delete project “{n}”? Apps are kept.', 'Excluir o projeto “{n}”? Os apps são mantidos.'],
  'Noch keine Projekte, auf die du Zugriff hast.': ['No projects you have access to yet.', 'Ainda não há projetos aos quais você tenha acesso.'],
  'Projekt:': ['Project:', 'Projeto:'],
  'Projekt': ['Project', 'Projeto'],
  '(kein Projekt)': ['(no project)', '(sem projeto)'],

  /* Apps / Test-Modus */
  'Apps: Test-Modus & Verlauf': ['Apps: test mode & history', 'Apps: modo de teste e histórico'],
  'Neue Apps starten im Test-Modus: Nur eingetragene Testnutzer, du und dein Team dürfen sie verbinden.': ['New apps start in test mode: only registered test users, you and your team can connect them.', 'Novos apps começam em modo de teste: apenas usuários de teste cadastrados, você e sua equipe podem conectá-los.'],
  'Du hast noch keine Apps (erstelle sie unter „Meine Apps“).': ['You have no apps yet (create them under “My apps”).', 'Você ainda não tem apps (crie-os em “Meus apps”).'],
  'Live': ['Live', 'Ao vivo'],
  'Test-Modus': ['Test mode', 'Modo de teste'],
  'Veröffentlichen': ['Publish', 'Publicar'],
  'Zurück in den Test-Modus': ['Back to test mode', 'Voltar ao modo de teste'],
  'App für ALLE Nutzer freigeben?': ['Release the app to ALL users?', 'Liberar o app para TODOS os usuários?'],
  'Testnutzer (max. 10)': ['Test users (max. 10)', 'Usuários de teste (máx. 10)'],
  'E-Mail des Testnutzers': ['Test user email', 'E-mail do usuário de teste'],
  'Hinzufügen': ['Add', 'Adicionar'],
  'Keine Testnutzer. Nur du und dein Team können die App verbinden.': ['No test users. Only you and your team can connect the app.', 'Nenhum usuário de teste. Somente você e sua equipe podem conectar o app.'],
  'Lädt …': ['Loading …', 'Carregando …'],

  /* Änderungsverlauf */
  'Änderungsverlauf': ['Change history', 'Histórico de alterações'],
  'Verlauf ausblenden': ['Hide history', 'Ocultar histórico'],
  'Noch keine Einträge.': ['No entries yet.', 'Ainda não há entradas.'],
  'hat die App erstellt': ['created the app', 'criou o app'],
  'hat ein Feld geändert': ['changed a field', 'alterou um campo'],
  'hat Redirect-URI ergänzt': ['added a redirect URI', 'adicionou um URI de redirecionamento'],
  'hat Redirect-URI entfernt': ['removed a redirect URI', 'removeu um URI de redirecionamento'],
  'hat Berechtigung ergänzt': ['added a permission', 'adicionou uma permissão'],
  'hat Berechtigung entfernt': ['removed a permission', 'removeu uma permissão'],
  'hat das Logo geändert': ['changed the logo', 'alterou o logotipo'],
  'hat das Secret erneuert': ['regenerated the secret', 'renovou o secret'],
  'hat die App veröffentlicht': ['published the app', 'publicou o app'],
  'hat die App zurück in den Test-Modus gesetzt': ['set the app back to test mode', 'voltou o app ao modo de teste'],
  'hat Testnutzer hinzugefügt': ['added a test user', 'adicionou um usuário de teste'],
  'hat Testnutzer entfernt': ['removed a test user', 'removeu um usuário de teste'],
  'hat die App einem Projekt zugeordnet': ['assigned the app to a project', 'atribuiu o app a um projeto'],
  'hat die App aus dem Projekt genommen': ['removed the app from the project', 'removeu o app do projeto'],
  'Name': ['Name', 'Nome'],
  'Beschreibung': ['Description', 'Descrição'],
  'Webseite': ['Website', 'Site'],
  'Datenschutz-URL': ['Privacy URL', 'URL de privacidade'],
  'Nutzungsbedingungen-URL': ['Terms URL', 'URL dos termos de uso'],
  'Entwicklername': ['Developer name', 'Nome do desenvolvedor'],

  /* Fehlermeldungen des Servers (err:<code>) */
  'err:forbidden': ['You do not have permission for this.', 'Você não tem permissão para isso.'],
  'err:invite_invalid': ['Invitation invalid or expired.', 'Convite inválido ou expirado.'],
  'err:mail': ['The invitation email could not be sent.', 'Não foi possível enviar o e-mail de convite.'],
  'err:mail_config': ['Email sending is not set up.', 'O envio de e-mails não está configurado.']
});

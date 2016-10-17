Package.describe({
  name: 'lichthagel:accounts-discord',
  version: '0.1.2',
  // Brief, one-line summary of the package.
  summary: 'Adds account support for Discord',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Lichthagel/meteor-accounts-discord',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.1.2');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.export('Discord');

  api.addFiles(['discord_configure.html', 'discord_configure.js'], 'client');

  api.addFiles('discord_server.js', 'server');

  api.addFiles('discord_client.js', 'client');

  api.addFiles('discord_login_button.css', 'client');

  api.addFiles('accounts-discord.js');
});

/*Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lichthagel:accounts-discord');
  api.mainModule('accounts-discord-tests.js');
});*/

Package.describe({
  name: 'lichthagel:accounts-discord',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'Adds account support for Discord',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Lichthagel/meteor-accounts-discord',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.use('ecmascript');
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.use('accounts-oauth', ['client', 'server']);
  api.use('lichthagel:discord-oauth');
  api.imply('lichthagel:discord-oauth');

  api.use(
    ['accounts-ui', 'lichthagel:discord-config-ui'],
    ['client', 'server'],
    { weak: true }
  );
  api.addFiles('notice.js');
  api.addFiles('discord.js');
});
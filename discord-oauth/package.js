Package.describe({
    name: 'lichthagel:discord-oauth',
    summary: 'Discord OAuth flow',
    version: '0.1.0',
    git: 'https://github.com/Lichthagel/meteor-accounts-discord/tree/master/discord-oauth'
});

Package.onUse(api => {
    api.use('ecmascript', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', 'server');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.addFiles('discord_client.js', 'client');
    api.addFiles('discord_server.js', 'server');

    api.mainModule('namespace.js');

    api.export('Discord');
});
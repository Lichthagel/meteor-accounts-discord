Package.describe({
    name: 'lichthagel:discord-oauth',
    summary: 'Discord OAuth flow',
    version: '0.1.0',
    git: 'https://github.com/Lichthagel/meteor-accounts-discord/tree/master/discord-oauth'
});

Package.onUse(api => {
    api.use('ecmascript@0.12.4', ['client', 'server']);
    api.use('oauth2@1.2.1', ['client', 'server']);
    api.use('oauth@1.2.7', ['client', 'server']);
    api.use('http@1.4.2', 'server');
    api.use('random@1.1.0', 'client');
    api.use('service-configuration@1.0.11', ['client', 'server']);

    api.addFiles('discord_client.js', 'client');
    api.addFiles('discord_server.js', 'server');

    api.mainModule('namespace.js');

    api.export('Discord');
});
Package.describe({
    name: 'lichthagel:discord-config-ui',
    summary: 'Blaze configuration templates for Discord OAuth.',
    version: '0.1.0',
    git: 'https://github.com/Lichthagel/meteor-accounts-discord/tree/master/discord-config-ui'
});

Package.onUse(api => {
    api.use('ecmascript@0.12.4', 'client');
    api.use('templating@1.2.13', 'client');
    api.addFiles('discord_login_button.css', 'client');
    api.addFiles(
        ['discord_configure.html', 'discord_configure.js'],
        'client'
    );
});
import Discord from './namespace.js';
import { Accounts } from 'meteor/accounts-base';

const hasOwn = Object.prototype.hasOwnProperty;

Discord.whitelistedFields = ['id', 'username', 'discriminator', 'avatar', 'bot', 'mfa_enabled', 'locale', 'verified', 'email', 'flags', 'premium_type'];

OAuth.registerService('discord', 2, null, query => {
    const tokens = getTokens(query);
    const identity = getIdentity(tokens.access_token);
    const scope = tokens.scope;

    var serviceData = {
        id: identity.id,
        username: identity.username,
        discriminator: identity.discriminator,
        accessToken: OAuth.sealSecret(tokens.access_token),
        tokenType: tokens.token_type,
        scope: scope
    };

    if (hasOwn.call(tokens, "expires_in")) {
        serviceData.expiresIn = Date.now() + 1000 * parseInt(tokens.expires_in, 10);
    }
    Discord.whitelistedFields.forEach(name => {
        if (hasOwn.call(identity, name))
            serviceData[name] = identity[name]
    });

    if (tokens.refresh_token) {
        serviceData.refreshToken = tokens.refresh_token;
    }

    return {
        serviceData,
        options: {
            profile: {
                name: identity.username + "#" + identity.discriminator
            }
        }
    }
});

let userAgent = "Meteor";
if (Meteor.release)
    userAgent += '/${Meteor.release}';

const getTokens = query => {
    const config = ServiceConfiguration.configurations.findOne({service: 'discord'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    let response;
    try {
        response = HTTP.post(
            "https://discord.com/api/oauth2/token", {
                headers: {
                    Accept: 'application/json',
                    "User-Agent": userAgent
                },
                params: {
                    grant_type: 'authorization_code',
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    redirect_uri: OAuth._redirectUri('discord', config),
                    state: query.state
                }
            });
    } catch (err) {
        throw Object.assign(
            new Error(`Failed to complete OAuth handshake with Discord. ${err.message}`),
            {response: err.response},
        );
    }
    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error(`Failed to complete OAuth handshake with Discord. ${response.data.error}`);
    } else {
        return response.data;
    }
};

const getIdentity = accessToken => {
    try {
        return HTTP.get(
            "https://discord.com/api/users/@me", {
                headers: {
                    "User-Agent": userAgent,
                    "Authorization": "Bearer " + accessToken
                },
            }).data;
    } catch (err) {
        throw Object.assign(
            new Error('Failed to fetch identity from Discord. ${err.message}'),
            {response: err.response},
        );
    }
};

Discord.retrieveCredential = (credentialToken, credentialSecret) => OAuth.retrieveCredential(credentialToken, credentialSecret);
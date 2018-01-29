// Adapted from accounts-google package:
// https://github.com/meteor/meteor/blob/bc0a25156b2d717785fea3b8149024ecfce19e39/packages/google-oauth/google_server.js

Discord = {};

var hasOwn = Object.prototype.hasOwnProperty;

var userAgent = 'Meteor';
if (Meteor.release)
  userAgent += '/' + Meteor.release;

// https://discordapp.com/developers/docs/resources/user
Discord.whitelistedFields = [
    'id',
    'username',
    'discriminator',
    'avatar',
    'bot',
    'mfa_enabled',
    'verified',
    'email',
];

function getServiceDataFromTokens(tokens) {
    var accessToken = tokens.accessToken;
    var token_type = tokens.token_type;
    var scope = tokens.scope;
    var user = getUser(accessToken);
    var serviceData = {
	accessToken: accessToken,
	token_type: token_type,
	scope: scope
    };

    if (hasOwn.call(tokens, "expiresIn")) {
	serviceData.expiresAt =
	    Date.now() + 1000 * parseInt(tokens.expiresIn, 10);
    }

    var fields = Object.create(null);
    Discord.whitelistedFields.forEach(function (name) {
	if (hasOwn.call(user, name)) {
	    fields[name] = user[name];
	}
    });

    Object.assign(serviceData, fields);

    // only set the token in serviceData if it's there. this ensures
    // that we don't lose old ones (since we only get this on the first
    // log in attempt)
    if (tokens.refreshToken) {
	serviceData.refreshToken = tokens.refreshToken;
    }

    return {
	serviceData: serviceData,
	options: {
	    profile: {
		name: user.name
	    }
	}
    };
}

Accounts.registerLoginHandler(function (request) {
    console.log('discord registerLoginHandler');
    console.log(request);
    
    if (request.discordSignIn !== true) {
	return;
    }

    const tokens = {
	accessToken: request.accessToken,
	refreshToken: request.refreshToken,
    };

    if (request.serverAuthCode) {
	Object.assign(tokens, getTokens({
	    code: request.serverAuthCode
	}));
    }

    const result = getServiceDataFromTokens(tokens);

    return Accounts.updateOrCreateUserFromExternalService("discord", {
	id: request.userId,
	accessToken: request.accessToken,
	email: request.email,
	picture: request.imageUrl,
	    ...result.serviceData,
    }, result.options);
});


// returns an object containing:
// - accessToken
// - token_type: (typically 'bearer')
// - scope: a space delimited list of scopes granted
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'discord'});
    if (!config)
	throw new ServiceConfiguration.ConfigError();

    var response;
    try {
	response = HTTP.post(
	    'https://discordapp.com/api/oauth2/token', {
		headers: {
		    Accept: 'application/json',
		    'User-Agent': userAgent
		},
		params: {
		    grant_type: 'authorization_code',
		    code: query.code,
		    client_id: config.clientId,
		    client_secret: OAuth.openSecret(config.secret),
		    redirect_uri: OAuth._redirectUri('discord', config),
		    state: query.state,
		}
	    });
    } catch (err) {
	throw Object.assign(
	    new Error("Failed to complete OAuth handshake with Discord. " + err.message),
	    { response: err.response }
	);
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
	throw new Error("Failed to complete OAuth handshake with Discord. " + response.data.error);
    } else {
	return {
	    accessToken: response.data.access_token,
	    token_type: response.data.token_type,
	    refreshToken: response.data.refresh_token,
	    expiresIn: response.data.expires_in,
	    scope: response.data.scope,
	};
    }
};

function getServiceData(query) {
    return getServiceDataFromTokens(getTokens(query));
}

OAuth.registerService('discord', 2, null, getServiceData);

var getUser = function (accessToken) {
  try {
    return HTTP.get(
      'https://discordapp.com/api/users/@me', {
        headers: {
          'User-Agent': userAgent,
          'Authorization': 'Bearer ' + accessToken
        }
      }).data;
  } catch (err) {
      throw Object.assign(
	  new Error('Failed to fetch user from Discord. ' + err.message),
      { response: err.response });
  }
};

Discord.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

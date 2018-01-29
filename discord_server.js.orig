Discord = {};

OAuth.registerService('discord', 2, null, function (query) {

  var accessToken = getAccessToken(query);
  var user = getUser(accessToken);

  return {
    serviceData: _.extend(user, { accessToken: OAuth.sealSecret(accessToken) }),
    options: { profile: { name: user.username } }
  };
});

var userAgent = 'Meteor';
if (Meteor.release)
  userAgent += '/' + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({ service: 'discord' });
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
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error('Failed to complete OAuth handshake with Discord. ' + err.message),
      { response: err.response });
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error('Failed to complete OAuth handshake with Discord. ' + response.data.error);
  } else {
    return response.data.access_token;
  }
};

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
    throw _.extend(new Error('Failed to fetch user from Discord. ' + err.message),
      { response: err.response });
  }
};

Discord.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

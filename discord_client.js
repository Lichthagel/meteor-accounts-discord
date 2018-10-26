Discord = {};

Discord.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({ service: 'discord' });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var scope = (options && options.requestPermissions) || ['identify', 'email', 'connections', 'guilds', 'guilds.join'];
  var flatScope = _.map(scope, encodeURIComponent).join(' ');
  var loginStyle = OAuth._loginStyle('discord', config, options);

  var loginUrl =
    'https://discordapp.com/api/oauth2/authorize' +
    '?client_id=' + config.clientId +
    '&response_type=code' +
    '&scope=' + flatScope +
    '&redirect_uri=' + OAuth._redirectUri('discord', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  OAuth.launchLogin({
    loginService: 'discord',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: { width: 450, height: 750 }
  });
};

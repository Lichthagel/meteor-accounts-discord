Template.configureLoginServiceDialogForDiscord.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForDiscord.fields = function () {
  return [
    { property: 'clientId', label: 'Client ID' },
    { property: 'secret', label: 'Client Secret' }
  ];
};
# accounts-discord

## Installation

`meteor add lichthagel:accounts-discord`

## Documentation

This package works similar to other accounts packages. See the [Meteor Guide](https://guide.meteor.com/accounts.html) for more details.

You may pass custom scopes with
```javascript
Accounts.ui.config({
  requestPermissions: {
    discord: ['scope-1', 'scope-2']
  }
});
```
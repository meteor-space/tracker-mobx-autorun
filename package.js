Package.describe({
  name: 'space:tracker-mobx-autorun',
  version: '0.1.0',
  summary: 'Meteor.Tracker and Mobx integration',
  git: 'https://github.com/meteor-space/reaction.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('tmeasday:check-npm-versions');
  api.mainModule('tracker-mobx-autorun.js', 'client');
});

Package.describe({
	summary: "Monitors the active sessions and subscriptions to your Meteor app"
});

Package.on_use(function (api, where) {
	api.add_files('common.js', ['client', 'server']);
	api.add_files('server.js', ['server']);
});

Package.on_test(function (api) {
	api.use('session-monitor');
	api.add_files('tests.js', ['server']);
});

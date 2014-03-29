Package.describe({
	summary: "Monitors the active sessions and subscriptions to your Meteor app"
});

Package.on_use(function (api, where) {
	api.add_files('session-monitor.js', ['server']);
});

Package.on_test(function (api) {
	api.use('session-monitor');
	api.add_files('session-monitor_tests.js', ['server']);
});

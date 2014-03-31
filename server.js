Meteor.startup(function(){
	// Clean up any old sessions
	Sessions.remove({});
});

Meteor.publish(null, function(){
	if (!this._session || !this._session.id || !this._session.socket) {
		// Give up as we don't have the info we need access to
		return this.ready();
	}

	var sessionID = this._session.id;

	var upsert = Sessions.upsert(sessionID, {
		$set: {
			sessionID: sessionID,
			connectionID: this.connection.id,
			userID: this.userId,
			login_at: new Date(),
			ip: this._session.socket.headers['x-forwarded-for'] || this._session.socket.remoteAddress
		},
		$setOnInsert: {
			connected_at: new Date(),
			subscriptions: []
		}
	});

	// Has the client just connected? i.e. Is this a new session?
	if (upsert.insertedId) {
		// We need to add some extra handlers to this session and its socket
		// but we only need to do it once so do it here
		this._session.socket.on('close', Meteor.bindEnvironment(
			function(){
				Sessions.remove(sessionID);
			}, function(e){
				throw e;
			}
		));

		// Wrap our own subscription tracking code around Meteor's subscription
		// handling code so that we can track the starting and stopping of subscriptions
		var oldStartSubHandler = this._session._startSubscription;
		var oldStopSubHandler = this._session._stopSubscription;
		this._session._startSubscription = function(){
			if (arguments.length != 4) return;
			var subID = arguments[1];
			var subArgs = arguments[2];
			var subName = arguments[3];
			Sessions.update(sessionID, { $push: { subscriptions: { name: subName, id: subID, args: subArgs } } });
			oldStartSubHandler.apply(this, arguments);
		};
		this._session._stopSubscription = function(){
			if (arguments.length == 0) return;
			var subID = arguments[0];
			Sessions.update(sessionID, { $pull: { subscriptions: { id: subID } } });
			oldStopSubHandler.apply(this, arguments);
		};

		// We need to add any subscriptions that have already been started
		this._session._eachSub(function(sub){
			if (typeof sub._name !== 'undefined') {
				Sessions.update(sessionID, { $push: { subscriptions: { name: sub._name, id: sub._subscriptionId } } });
			}
		});
	}

});

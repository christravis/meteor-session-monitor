Meteor.startup(function(){
	// Clean up any old connections
	Connections.remove({});
});

Meteor.publish(null, function(){
	var sessionID = this._session.id;
	console.log('Got new session: ' + sessionID);

	var info = {
		sessionID: sessionID,
		userID: this.userId,
		username: null,
		login_at: new Date(),
		ip: this._session.socket.headers['x-forwarded-for'] || this._session.socket.remoteAddress,
	};

	if (this.userId) {
		info.username = Meteor.user().username;
	}

	var session = Connections.findOne(sessionID);
	if (!session) {
		// Must be a new session
		info._id = info.sessionID;
		info.connected_at = new Date();
		info.subscriptions = [];
		Connections.insert(info);

		this._session.socket.on('close', Meteor.bindEnvironment(function(){
			Connections.remove(sessionID);
		}));

		// Add our own tracking code on top of Meteor's default subscription handling
		// so that we can track when a session subs/unsubs
		var oldStartSubHandler = this._session._startSubscription;
		var oldStopSubHandler = this._session._stopSubscription;
		this._session._startSubscription = function(){
			var subID = arguments[1];
			var subName = arguments[3];
			console.log('Session ' + sessionID + ' subbed to ' + subName + ' (' + subID + ')');
			Connections.update(sessionID, { $push: { subscriptions: { name: subName, id: subID } } });
			oldStartSubHandler.apply(this, arguments);
		};
		this._session._stopSubscription = function(){
			var subID = arguments[0];
			console.log('Session ' + sessionID + ' unsubbed from ' + subID);
			Connections.update(sessionID, { $pull: { subscriptions: { id: subID } } });
			oldStopSubHandler.apply(this, arguments);
		};

		// We need to add any subscriptions that have already been set up
		this._session._eachSub(function(sub){
			if (typeof sub._name !== 'undefined') {
				console.log('Session ' + sessionID + ' was already subbed to ' + sub._name + ' (' + sub._subscriptionId + ')');
				Connections.update(sessionID, { $addToSet: { subscriptions: { name: sub._name, id: sub._subscriptionId } } })
			}
		});

	} else {
		Connections.update(sessionID, { $set: info });
	}

});

Meteor.publish('connections', function(){
	return Connections.find();
});

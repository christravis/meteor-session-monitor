var activeSubs = [];

Meteor.startup(function(){
	Meteor.subscribe('connections');
});

Template.connectionList.connections = function(){
	return Connections.find();
};

Template.connectionList.connected_tstamp = function(){
	return this.connected_at.toGMTString();
};

Template.connectionList.login_tstamp = function(){
	return this.login_at.toGMTString();
};

Template.subSwitcher.subscriptions = function(){
	return CustomSubscriptions;
};

Template.subSwitcher.events({
	'click button': function(evt){
		var subID = evt.target.id;
		if (activeSubs[subID]) {
			activeSubs[subID].stop();
			delete activeSubs[subID];
			$(evt.target).removeClass('active');
		} else {
			activeSubs[subID] = Meteor.subscribe(subID);
			$(evt.target).addClass('active');
		}
	}
});

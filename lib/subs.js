CustomSubscriptions = ['books', 'fruit', 'posts', 'vehicles'];

if (Meteor.isServer) {
	for (var x = 0; x < CustomSubscriptions.length; x++) {
		Meteor.publish(CustomSubscriptions[x], function(){});
	}
}

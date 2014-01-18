# meteor-connection-monitor

This app maintains a record of all the current active connections to a Meteor server, along with the active subscriptions for each connection. It does this by adding callbacks to socket open and close events and by injecting handlers that wrap Meteor's internal code that handles the starting and stopping of subscriptions.

Although in this demo the information is made publically available to everyone who connects, only minor modifications would be required to make it only available to admins.

### Live Demo

http://connection-monitor.meteor.com

### Acknowledgements

Thanks go to [Andrew Mao](https://github.com/mizzao/) for his [meteor-user-status](https://github.com/mizzao/meteor-user-status) package which helped get me started on monitoring open connections.

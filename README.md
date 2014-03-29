# meteor-session-monitor

This package maintains a record of all the currently active sessions for a Meteor app, along with the active subscriptions for each session. It does this by adding callbacks to socket open and close events and by injecting handlers that wrap Meteor's internal code that handles the starting and stopping of subscriptions.

Although in this demo the information is made publically available to everyone who connects, only minor modifications would be required to make it only available to admins.

### Live Demo

http://session-monitor.meteor.com

### Acknowledgements

Thanks go to [Andrew Mao](https://github.com/mizzao/) for his [meteor-user-status](https://github.com/mizzao/meteor-user-status) package which helped get me started on monitoring open sessions.

# Google CLoud Platform

Create an app on Google Server (GCP)
Integrate GMAIL API from GCP into extension
Ask for permissions

# Extension

Once mailbox is loaded then:

- Insert button's in DOM for analysis
- Once button is clicked, get the message-id from DOM attribute
- Send the message-id to server / Request GCP for data and pass it to server for analysis
- Flag the email via DOM manipulation / Access user mailbox and using message-id mark it spam
- alert user about the actions taken

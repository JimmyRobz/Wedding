import admin = require('firebase-admin');
import functions = require('firebase-functions');

import api = require('./api');
import guests = require('./guests');

// == Init ==

admin.initializeApp(functions.config().firebase);

// == API ==

exports.api = functions.https.onRequest(api.app);

// == Guest document ==

exports.onGuestCreated = guests.onCreate;
exports.onGuestUpdated = guests.onUpdate;
exports.onGuestDeleted = guests.onDelete;

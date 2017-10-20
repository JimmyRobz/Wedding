import admin = require('firebase-admin');
import functions = require('firebase-functions');

import api = require('./api');

admin.initializeApp(functions.config().firebase);

exports.api = functions.https.onRequest(api.app);

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { app as api } from './api';
import * as guests from './guests';

// == Init ==

admin.initializeApp(functions.config().firebase);

// == API ==

exports.api = functions.https.onRequest(api);

// == Guest document ==

exports.onGuestCreated = guests.onCreate;
exports.onGuestUpdated = guests.onUpdate;
exports.onGuestDeleted = guests.onDelete;

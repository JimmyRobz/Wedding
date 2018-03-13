import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import * as map from 'p-map';

import { usingGuests } from './algolia';

// == API ==

export const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(auth);

app.get('/versions', versions);

app.get('/guest/search/:query', searchGuest);

app.get('/group/:groupId', getGroupById);

app.post('/group/:groupId/respond', isAuthenticated, isRegisteredInGroup, respondToGroup);

app.post('/group/:groupId/guest/:guestId', respondToGuest);

app.post('/guestbook', createGuestbookMessage);

app.get('/admin/summary', isAuthenticated, getSummary);

app.get('/admin/groups', isAuthenticated, getGroups);

app.get('/admin/group/:groupId', isAuthenticated, getGroupById);

app.post('/admin/group', isAuthenticated, createGroup);

app.post('/admin/group/:groupId/guests', isAuthenticated, createGuest);

app.post('/admin/group/:groupId/respond', isAuthenticated, respondToGroup);

app.delete('/admin/group/:groupId', isAuthenticated, deleteGroup);

app.put('/admin/group/:groupId', isAuthenticated, updateGroup);

app.put('/admin/group/:groupId/guest/:guestId', isAuthenticated, updateGuest);

app.delete('/admin/group/:groupId/guest/:guestId', isAuthenticated, deleteGuest);

app.use(errorHandler);

// == Functions ==

/**
 * Versions route prints node version and app version.
 * @param request
 * @param response
 */
function versions(request, response) {
    response.send({
        node: process.version,
        version: require('./../package.json').version
    });
}

/**
 * Searches guest using Algoliasearch.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function searchGuest(request, response) {
    const query = request.params.query;
    const result = await usingGuests(async index => {
        return await index.search({query});
    });
    const guests = _.map(result.hits, (hit: any) => {
        return {
            id: hit.objectID,
            firstName: hit.firstName,
            lastName: hit.lastName,
            groupId: hit.groupId,
        };
    });
    response.send(guests);
}

/**
 * Gets groups.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getGroups(request, response) {
    const snapshot = await admin.firestore().collection('groups').get();
    const groups = _.map(snapshot.docs, doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
    response.send(_.sortBy(groups, 'createdAt'));
}

/**
 * Gets group by id.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getGroupById(request, response) {
    const groupId = request.params.groupId;
    const snapshot = await admin.firestore().collection('groups').doc(groupId).get();
    const group = await deep(snapshot);

    if (!group.guests) group.guests = [];
    group.guests = _.sortBy(group.guests, 'createdAt');

    response.send(group);
}

/**
 * Updates all responses for guests in a group.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function respondToGroup(request, response) {
    const groupId = request.params.groupId;
    const responses = request.body;
    const firestore = admin.firestore();
    const guests = await firestore.collection('groups').doc(groupId).collection('guests');
    const batch = firestore.batch();
    _.each(responses, (guestResponse, guestId) => {
        batch.update(guests.doc(guestId), {response: guestResponse})
    });
    await batch.commit();
    response.send({
        success: true
    });
}

/**
 * Updates response for a guest in a group.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function respondToGuest(request, response) {
    const groupId = request.params.groupId;
    const guestId = request.params.guestId;
    const status = request.body.status;
    const firestore = admin.firestore();
    const guest = await firestore.collection('groups').doc(groupId).collection('guests').doc(guestId);
    await guest.update({
        status: status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    response.send({
        success: true
    });
}

/**
 * Creates a guestbookmessage.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function createGuestbookMessage(request, response) {
    const {name, message} = request.body;
    const firestore = admin.firestore();
    await firestore.collection('guestbook').add({
        name, message, date: admin.firestore.FieldValue.serverTimestamp()
    });
    response.send({
        success: true
    });
}

/**
 * Gets summary for admin view.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getSummary(request, response) {
    // Get complete groupcollection
    const snapshot = await admin.firestore().collection('groups').get();
    // Deeply fetch each group asynchronously
    const groups = await Promise.all(_.map(snapshot.docs, async doc => {
        const docSnapshot = await doc.ref.get();
        const group = await deep(docSnapshot);
        group.id = docSnapshot.id;
        if (!group.guests) group.guests = [];
        return group;
    }));
    // Flatten guests
    const guests = _.chain(groups).map(group => group.guests).flatten().value();
    // Respond
    response.send({
        guestCount: guests.length,
        groupCount: groups.length,
        comingGuests: _.filter(guests, guest => guest.status === 'coming').length,
        noAnswerGuests: _.filter(guests, guest => !guest.status).length,
        babyCount: _.filter(guests, guest => guest.age === 'baby').length,
        comingBabies: _.filter(guests, guest => guest.age === 'baby' && guest.status == 'coming').length,
        kidCount: _.filter(guests, guest => guest.age === 'kid').length,
        comingKids: _.filter(guests, guest => guest.age === 'kid' && guest.status == 'coming').length,
        adultCount: _.filter(guests, guest => guest.age === 'adult').length,
        comingAdults: _.filter(guests, guest => guest.age === 'adult' && guest.status == 'coming').length,
        femaleCount: _.filter(guests, guest => guest.sex === 'female').length,
        maleCount: _.filter(guests, guest => guest.sex === 'male').length,
    });
}

/**
 * Creates a group.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function createGroup(request, response) {
    const firestore = admin.firestore();
    const data: any = {
        name: 'Nouveau groupe',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const ref = await firestore.collection('groups').add(data);
    data.id = ref.id;
    // Success
    response.send(data);
}

/**
 * Creates a guest.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function createGuest(request, response) {
    const groupId = request.params.groupId;

    // Add guest
    const ref = await admin.firestore().collection('groups').doc(groupId).collection('guests').add({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Success
    response.send({
        success: true,
        id: ref.id
    });
}

/**
 * Deletes a group.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function deleteGroup(request, response) {
    const groupId = request.params.groupId;
    await admin.firestore().collection('groups').doc(groupId).delete();
    response.send({success: true});
}

/**
 * Updates a group.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function updateGroup(request, response) {
    const groupId = request.params.groupId;
    const data = request.body;
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection('groups').doc(groupId).update(data);
    response.send({success: true});
}

/**
 * Updates a guest.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function updateGuest(request, response) {
    const groupId = request.params.groupId;
    const guestId = request.params.guestId;
    const data = _.mapValues(request.body, value => {
        if (value === null) {
            return admin.firestore.FieldValue.delete();
        } else {
            return value;
        }
    });
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection('groups').doc(groupId).collection('guests').doc(guestId).update(data);
    response.send({success: true});
}

/**
 * Deletes a guest.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function deleteGuest(request, response) {
    const groupId = request.params.groupId;
    const guestId = request.params.guestId;
    await admin.firestore().collection('groups').doc(groupId).collection('guests').doc(guestId).delete();
    response.send({success: true});
}

/**
 * Simply handles errors.
 * @param error
 * @param request
 * @param response
 * @param next
 */
function errorHandler(error, request, response, next) {
    if (!error) {
        response.status(500).send({
            success: false,
            code: 500,
            message: 'Unhandled response'
        });
    } else if (error instanceof HttpError) {
        response.status(error.code).send({
            success: false,
            code: error.code,
            message: error.message
        });
    } else if (error instanceof Error) {
        response.status(500).send({
            success: false,
            code: 500,
            message: error.message
        });
    } else {
        response.status(500).send({
            success: false,
            code: 500,
            message: error.toString()
        });
    }
}

/**
 * Deeply get Firestore document (i.e. get a document and all documents in all subcollections)
 * @param documentSnapshot
 * @returns {Promise}
 */
async function deep(documentSnapshot) {
    const document = documentSnapshot.data();
    const subcollections = await documentSnapshot.ref.getCollections();
    await map(subcollections, async subcollection => {
        const querySnapshot = await subcollection.get();
        document[subcollection.id] = await map(querySnapshot.docs, async documentSnapshot => {
            const subdocument = await deep(documentSnapshot);
            subdocument.id = documentSnapshot.id;
            return subdocument;
        });
    });
    return document;
}

/**
 * Auth middleware. Verify user from Authorization token and save it to request `user` property.
 * @param request
 * @param response
 * @param next
 * @returns {Promise<void>}
 */
async function auth(request, response, next) {
    const authorization = request.headers.authorization;
    const prefix = 'Bearer ';
    if (authorization && authorization.startsWith(prefix)) {
        let idToken = authorization.substring(prefix.length);
        request.user = await admin.auth().verifyIdToken(idToken);
    }
    next();
}

/**
 * Middleware that checks if the user is authenticated or not.
 * @param request
 * @param response
 * @param next
 */
function isAuthenticated(request, response, next) {
    if (!request.user) throw unauthorized();
    else next()
}

/**
 * Middleware that checks if authenticated user's phone number is registered in group or not.
 * @param request
 * @param response
 * @param next
 * @returns {Promise<void>}
 */
async function isRegisteredInGroup(request, response, next) {
    const phoneNumber = request.user.phone_number;
    const groupId = request.params.groupId;
    const snapshot = await admin.firestore().collection('groups').doc(groupId).collection('phoneNumbers').get();
    const phoneNumbers = snapshot.docs;
    const isRegisteredInGroup = _.some(phoneNumbers, snapshot => snapshot.data().phoneNumber === phoneNumber);
    if (!isRegisteredInGroup) throw forbidden();
    else next();
}

/**
 * Simple error with HTTP error code and message.
 */
class HttpError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

/**
 * Generates unauthorized HTTP error.
 * @param {string} message
 * @returns {HttpError}
 */
function unauthorized(message = 'Unauthorized') {
    return new HttpError(401, message);
}

/**
 * Generates forbidden HTTP error.
 * @param {string} message
 * @returns {HttpError}
 */
function forbidden(message = 'Forbidden') {
    return new HttpError(403, message);
}

/**
 * Generates bad request HTTP error.
 * @param {string} message
 * @returns {HttpError}
 */
function badRequest(message = 'Bad request') {
    return new HttpError(400, message);
}

function success(request, response) {
    response.send({
        success: true
    });
}

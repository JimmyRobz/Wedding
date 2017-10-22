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

app.get('/', root);

app.get('/guest/search/:query', searchGuest);

app.post('/guest/request', isAuthenticated, requestGuest);

app.get('/group/:groupId', getGroupById);

app.post('/group/:groupId/request', isAuthenticated, isRegisteredInGroup, requestGuestForGroup);

app.post('/group/:groupId/respond', isAuthenticated, isRegisteredInGroup, respondToGroup);

app.post('/admin/request/list', isAuthenticated, isAdmin/* TODO , lisRequests */);

app.use(errorHandler);

// == Functions ==

/**
 * Root route pribts node version and app version.
 * @param request
 * @param response
 */
function root(request, response) {
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
 * Requests a new guest with no group.
 * @param request
 * @param response
 */
async function requestGuest(request, response) {
    const {firstName, lastName, phoneNumber} = request.body;
    if (request.user.phone_number !== phoneNumber) throw forbidden('Authenticated phone number does not match the one from the request');
    if (!firstName || !lastName || !phoneNumber) throw badRequest('First name, last name and phone number are mandatory');
    const ref = await admin.firestore().collection('requests').add({
        firstName,
        lastName,
        phoneNumber
    });
    response.send({id: ref.id});
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
    response.send(group);
}

/**
 * Requests a new guest to the group.
 * @param request
 * @param response
 */
async function requestGuestForGroup(request, response) {
    const groupId = request.params.groupId;
    const {firstName, lastName, phoneNumber} = request.body;
    if (!firstName || !lastName) throw badRequest('First name and last name are mandatory');
    const ref = await admin.firestore().collection('requests').add({
        groupId, firstName, lastName, phoneNumber
    });
    response.send({id: ref.id});
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
            return await deep(documentSnapshot);
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
    try {
        const authorization = request.headers.authorization;
        const prefix = 'Bearer ';
        if (authorization && authorization.startsWith(prefix)) {
            let idToken = authorization.substring(prefix.length);
            request.user = await admin.auth().verifyIdToken(idToken);
        }
    } finally {
        next();
    }
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
 * Middleware that checks if the authenticated use is admin or not.
 * @param request
 * @param response
 * @param next
 * @returns {Promise<void>}
 */
async function isAdmin(request, response, next) {
    const snapshot = await admin.firestore().collection('app').doc('admin').get();
    const isAdmin = _.includes(snapshot.data().uids, request.user.uid);
    if (!isAdmin) throw forbidden();
    else next();
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

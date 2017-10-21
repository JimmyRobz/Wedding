import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import * as map from 'p-map';

import { usingGuests } from './algolia';

// == API ==

export const app = express();

app.use(bodyParser.json());

app.get('/', wrapHandler(root));

app.get('/guest/search/:query', wrapHandler(searchGuest));

app.post('/guest/request', wrapHandler(requestGuest));

app.get('/group/:id', wrapHandler(getGroupById));

app.post('/group/:id/request', wrapHandler(requestGuestForGroup));

app.post('/group/:id/respond', wrapHandler(respondToGroup));

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

function requestGuest(request, response) {
    const guest = request.body;
    // TODO
}

/**
 * Gets group by id.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getGroupById(request, response) {
    const id = request.params.id;
    const snapshot = await admin.firestore().collection('Groups').doc(id).get();
    const group = await deep(snapshot);
    response.send(group);
}

function requestGuestForGroup(request, response) {
    const id = request.params.id;
    const guest = request.body;
    // TODO
}

function respondToGroup(request, response) {
    const id = request.params.id;
    const guest = request.body;
    // TODO
}

/**
 * Wraps the handler to ensure evertyhing runs as expected, and if not respond with a 500 error.
 * @param handler
 * @returns {(request, response) => Promise<any>}
 */
function wrapHandler(handler) {
    return async (request, response) => {
        try {
            await handler(request, response);
        } catch (error) {
            response.status(500).send({
                error: error.toString()
            });
        }
    };
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

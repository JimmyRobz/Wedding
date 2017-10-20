import algoliasearch = require('algoliasearch');
import functions = require('firebase-functions');
import pify = require('pify');

// == Config ==

const {appId, apiKey} = functions.config().algolia;
const client = algoliasearch(appId, apiKey);
const index = pify(client.initIndex('Guests'));

// == API ==

const guest = functions.firestore.document('/Groups/{groupId}/Guests/{guestId}');

export const onCreate = guest.onCreate(_onCreate);
export const onUpdate = guest.onUpdate(_onUpdate);
export const onDelete = guest.onDelete(_onDelete);

// == Functions ==

export async function _onCreate(event) {
    const guest = buildGuest(event);
    await index.addObject(guest);
}

export async function _onUpdate(event) {
    const guest = buildGuest(event);
    await index.saveObject(guest);
}

export async function _onDelete(event) {
    const guest = buildGuest(event);
    await index.deleteObject(guest);
}

function buildGuest(event) {
    const {groupId, guestId} = event.params;
    const data = event.data.data() || event.data.previous.data();

    return {
        objectID: guestId,
        firstName: data.firstName,
        lastName: data.lastName,
        groupId: groupId
    };
}

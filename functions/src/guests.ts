import * as functions from 'firebase-functions';

import { usingGuests } from './algolia';

// == API ==

const guest = functions.firestore.document('/groups/{groupId}/guests/{guestId}');

export const onCreate = guest.onCreate(_onCreate);
export const onUpdate = guest.onUpdate(_onUpdate);
export const onDelete = guest.onDelete(_onDelete);

// == Functions ==

export async function _onCreate(event) {
    const guest = buildGuest(event);
    await usingGuests(async index => {
        await index.addObject(guest);
    });
}

export async function _onUpdate(event) {
    const guest = buildGuest(event);
    await usingGuests(async index => {
        await index.saveObject(guest);
    });
}

export async function _onDelete(event) {
    const guest = buildGuest(event);
    await usingGuests(async index => {
        await index.deleteObject(guest.objectID);
    });
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

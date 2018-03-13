import * as functions from 'firebase-functions';
import * as _ from 'lodash';

import { usingGuests } from './algolia';

// == API ==

const group = functions.firestore.document('/groups/{groupId}');

export const onDelete = group.onDelete(_onDelete);

// == Functions ==

export async function _onDelete(event) {
    const guestsIds = await buildGuestsIds(event);
    console.log("Delete Group");
    console.log("Delete also guests " + guestsIds);
    await usingGuests(async index => {
        await index.deleteObjects(guestsIds);
    });
}

async function buildGuestsIds(event) {
    const guests = await event.data.previous.ref.collection('guests').get();
    return _.map(guests.docs, (doc: any) => doc.id);
}

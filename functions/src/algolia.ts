import * as algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';

// == Config ==

const {id, key} = functions.config().algolia;

// == API ==

export const usingGuests = async block => {
    const client = algoliasearch(id, key);
    const index = client.initIndex('Guests');
    const result = await block(index);
    client.destroy();
    return result
};

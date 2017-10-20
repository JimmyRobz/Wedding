import algoliasearch = require('algoliasearch');
import functions = require('firebase-functions');

// == Config ==

const {id, key} = functions.config().algolia;

// == API ==

export const client = () => algoliasearch(id, key);

export const guests = (client) => client.initIndex('Guests');

export const usingGuests = async (block) => {
    const _client = client();
    const index = guests(_client);
    const result = await block(index);
    _client.destroy();
    return result
};

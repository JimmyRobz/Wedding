import bodyParser = require('body-parser');
import express = require('express');
import _ = require('lodash');

import algolia = require('./algolia');

// == API ==

export const app = express();

app.use(bodyParser.json());

app.get('/guest/search/:query', searchGuest);

app.post('/guest/request', requestGuest);

app.get('/group/:id', getGroupById);

app.post('/group/:id/request', requestGuestForGroup);

app.post('/group/:id/respond', respondToGroup);

// == Functions ==

async function searchGuest(request, response) {
    const query = request.params.query;

    const result = await algolia.usingGuests(async index => {
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

function getGroupById(request, response) {
    const id = request.params.id;
    // TODO
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

// == Imports ==

import bodyParser = require('body-parser');
import express = require('express');

// == API ==

export const app = express();

app.use(bodyParser.json());

app.get('/guest/search/:query', searchGuest);

app.post('/guest/request', requestGuest);

app.get('/group/:id', getGroupById);

app.post('/group/:id/request', requestGuestForGroup);

app.post('/group/:id/respond', respondToGroup);

// == Functions ==

function searchGuest(request, response) {
    const query = request.params.query;
}

function requestGuest(request, response) {
    const guest = request.body;
}

function getGroupById(request, response) {
    const id = request.params.id;
}

function requestGuestForGroup(request, response) {
    const id = request.params.id;
    const guest = request.body;
}

function respondToGroup(request, response) {
    const id = request.params.id;
    const guest = request.body;
}

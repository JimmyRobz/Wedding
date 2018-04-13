import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

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

    sendEmailIfNecessary(event);
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

function sendEmailIfNecessary(event) {
    const current = event.data.data();
    const previous = event.data.previous.data();
    if (current.status !== previous.status) {
        const {address, pass} = functions.config().mailer;

        const smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: address,
                pass: pass
            }
        });

        const message = current.firstName + ' ' + current.lastName + ' ' + (current.status === 'coming' ? 'sera là' : 'ne sera pas là')

        const mailOptions = {
            from: '"Invités Mariage" <wedding.robz.re@gmail.com>',
            to: 'jimmy@robz.re, laup.ophelie@gmail.com',
            subject: message,
            text: message
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) console.error(error);
            else console.log('Email envoyé');
        });
    }
}

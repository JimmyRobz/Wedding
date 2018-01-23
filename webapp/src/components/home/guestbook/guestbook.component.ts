import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Component({
    selector: 'guestbook',
    templateUrl: './guestbook.component.html',
    styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent {

    static title = "Livre d'or";
    static fragment = 'guestbook';

    submitting: boolean = false;
    submitButtonText: string = 'Envoyer';

    constructor(private store: AngularFirestore) {
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.submitting = true;
            this.submitButtonText = 'Envoi en cours. Veuillez patienter...';

            this.store.collection('guestbook').add({
                name: form.value.name,
                message: form.value.message,
                date: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                form.resetForm();
                alert("Message envoyé. Merci 😃");

                this.submitting = false;
                this.submitButtonText = 'Envoyer';
            }).catch(error => {
                console.error(error);
                alert("Envoi du message impossible ☹️");

                this.submitting = false;
                this.submitButtonText = 'Envoyer';
            });
        } else {
            alert("⚠️ Entrez votre nom ET votre message");
        }
    }

}

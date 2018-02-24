import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';

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

    constructor(private http: HttpClient) {
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.submitting = true;
            this.submitButtonText = 'Envoi en cours. Veuillez patienter...';

            this.http
                .post(environment.api + 'guestbook', {
                    name: form.value.name,
                    message: form.value.message
                })
                .toPromise()
                .then(() => {
                    form.resetForm();
                    alert("Message envoyé. Merci 😃");

                    this.submitting = false;
                    this.submitButtonText = 'Envoyer';
                })
                .catch(error => {
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

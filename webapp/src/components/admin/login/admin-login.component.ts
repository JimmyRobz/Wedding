import { Component } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {


    submitting: boolean;
    submitButtonText: string = "Se connecter";

    constructor(private fireAuth: AngularFireAuth, private router: Router) {
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.submitting = true;
            this.submitButtonText = 'Authentification en cours. Veuillez patienter...';

            this.fireAuth.auth.signInWithEmailAndPassword(form.value.login, form.value.password)
                .then(() => {
                    form.resetForm();
                    alert("Authentification réussie 😃");
                    return this.router.navigate(['admin']);
                })
                .catch(error => {
                    console.error(error);
                    alert("Erreur d'authentification ☹️");

                    this.submitting = false;
                    this.submitButtonText = 'Se connecter';
                });
        } else {
            alert("⚠️ Entrez votre identifiant ET votre mot de passe");
        }
    }

}

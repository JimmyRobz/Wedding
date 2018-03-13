import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

    authenticated: Observable<boolean>;

    submitting: boolean;
    submitButtonText: string = "Se connecter";

    constructor(private fireAuth: AngularFireAuth) {
    }

    ngOnInit() {
        this.authenticated = this.fireAuth.authState.map(user => !!user);
    }

    onConnect(form: NgForm) {
        if (form.valid) {
            this.submitting = true;
            this.submitButtonText = 'Authentification en cours. Veuillez patienter...';

            this.fireAuth.auth.signInWithEmailAndPassword(form.value.login, form.value.password)
                .then(() => {
                    form.resetForm();
                    Snackbar.show({text: "Authentification réussie 😃", showAction: false, duration: 1500});

                    this.submitting = false;
                    this.submitButtonText = 'Se connecter';
                })
                .catch(error => {
                    console.error(error);
                    Snackbar.show({text: "Erreur d'authentification ☹️", showAction: false, duration: 1500});

                    this.submitting = false;
                    this.submitButtonText = 'Se connecter';
                });
        } else {
            Snackbar.show({text: "⚠️ Entrez votre identifiant ET votre mot de passe", showAction: false, duration: 1500});
        }
    }

    onDisconnect() {
        this.fireAuth.auth.signOut()
            .then(() => {
                Snackbar.show({text: 'Déconnexion réussie 😃', showAction: false, duration: 1500});
            })
            .catch(error => {
                Snackbar.show({text: 'Déconnexion impossible ☹️', showAction: false, duration: 1500});
            });
    }

}

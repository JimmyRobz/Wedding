// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyBVHQ0sLY1M8ClIzN8PyTTtngt9qfCWg9A",
        authDomain: "wedding-dev-6bfa5.firebaseapp.com",
        databaseURL: "https://wedding-dev-6bfa5.firebaseio.com",
        projectId: "wedding-dev-6bfa5",
        storageBucket: "wedding-dev-6bfa5.appspot.com",
        messagingSenderId: "1094156306206"
    },
    api: 'https://us-central1-wedding-dev-6bfa5.cloudfunctions.net/api/'
};

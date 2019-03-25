import Controller from '@ember/controller';
import Session from 'ember-simple-auth/services/session';
import { action } from '@ember/object';
import { reject } from 'rsvp';
import { inject as service } from '@ember/service';

interface changeset {
    emailAddress: string,
    password: string
    get(property: string): string;
}

export default class Login extends Controller {
    @service session!: Session;

    @action
    async authenticate(changeset: changeset) {
        const identification = changeset.get('emailAddress');
        const password = changeset.get('password');
        const authenticator = 'authenticator:oauth2';
        const scope = 'read write';

        try {
            let promise = await this.session.authenticate(authenticator, identification, password, scope);
            return promise;
        } catch (errors) {
            // get(this, 'notifications').error(get(this, 'intl').t(`serverErrors.${get(errors, 'oAuth2Exception.code')}`));
            return reject(errors);
        }
    }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'login': Login;
  }
}

import Controller from '@ember/controller';
import Session from 'ember-simple-auth/services/session';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
    @service session!: Session;

    @action
    logout() {
        //Should make api request to log out, then clear cookie
        this.session.invalidate();
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'application': ApplicationController;
  }
}

import AjaxService from 'ember-ajax/services/ajax';
import Session from 'ember-simple-auth/services/session';
import ENV from 'octane-bootcamp/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

export default class Ajax extends AjaxService {
    @service session!: Session;
    host: any = ENV.RESTAPI;

    @computed('session.{isAuthenticated,data.authenticated.access_token}')
    get authorizationHeaders(): object {
        const headers: any = { };
        if (this.session.isAuthenticated) {
            headers.Authorization = `Bearer ${this.session.data.authenticated.access_token}`;
        }
        return headers;
    };

    @computed('authorizationHeaders')
    get headers(): any {
        const headers = assign(
            {'Content-Type': 'application/vnd.api+json'},
            this.authorizationHeaders
        );
        return headers;
    };

    options() {
        let options = this._super(...arguments);
        if (!options.xhrFields) {
            options.xhrFields = {};
        }
        options.xhrFields.withCredentials = true;
        return options;
    };

    stringifyData(data: JSON) {
        return JSON.stringify({data});
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'AjaxService': Ajax;
  }
}

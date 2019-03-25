import Authenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from 'octane-bootcamp/config/environment';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { assign } from '@ember/polyfills';
import { makeArray } from '@ember/array';
import RSVP from 'rsvp';
// import { merge } from '@ember/polyfills';
// import { inject as service } from '@ember/service';
// import RSVP from 'rsvp';
// import $ from 'jquery';

export default Authenticator.extend({
    // appUpgrade: service(),
    serverTokenEndpoint: ENV['simple-auth-oauth2'].serverTokenEndpoint,
    async authenticate(identification, password, scope = [], headers = {}) {
        return new RSVP.Promise((resolve, reject) => {
            const data = { 'grant_type': 'password', username: identification, password, client_id: 'ember' };
            const serverTokenEndpoint = this.get('serverTokenEndpoint');
            const useResponse = this.get('rejectWithResponse');
            const scopesString = makeArray(scope).join(' ');
            if (!isEmpty(scopesString)) {
                data.scope = scopesString;
            }
            this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
                run(() => {
                    if (!this._validate(response)) {
                        reject('access_token is missing in server response');
                    }

                    const expiresAt = this._absolutizeExpirationTime(response['expires_in']);
                    this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
                    if (!isEmpty(expiresAt)) {
                        response = assign(response, { 'expires_at': expiresAt });
                    }

                    resolve(response);
                });
            }, (response) => {
                run(null, reject, useResponse ? response : (response.responseJSON || response.responseText));
            });
        });
    }

    // async makeRequest() {
    //     let response = await this._super(...arguments);
    //     get(this, 'appUpgrade').checkResponseHeaders(get(response, 'headers.map'));
    //     return response;
    // }
});

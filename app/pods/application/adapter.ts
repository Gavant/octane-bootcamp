import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'octane-bootcamp/config/environment';
import { collect } from 'ember-awesome-macros';

export default class ApplicationAdapter extends DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:oauth2'
}) {
    host:string = ENV.RESTAPI;
    invalidStatusCodes:[] = collect(400, 405, 422, 500);
    isInvalid(status: never) {
        return this.invalidStatusCodes.includes(status);
    }

    handleResponse(status: never) {
        if (status === 401) {
            if (this.session.isAuthenticated) {
                this.session.invalidate();
                return true;
            } else {
                // this.browserRedirect('/', 307, true);
            }
        } else {
            // get(this, 'appUpgrade').checkResponseHeaders(headers);
            return this._super(...arguments);
        }
    }

    appendQueryParams(url, snapshot) {
        let query = get(snapshot, 'adapterOptions.query');

        if(query) {
            url += `?${$.param(query)}`;
        }

        return url;
    }

    pathForType() {
        let pathName = this._super(...arguments);
        return dasherize(pathName);
    }

    ajaxOptions() {
        let hash = this._super(...arguments);
        if(!get(hash, 'xhrFields')) {
            set(hash, 'xhrFields', {});
        }

        set(hash, 'xhrFields.withCredentials', true);
        return hash;
    }

    query(store, type, query) {
        //Convert front end paging conventions to ODATA
        if (query.hasOwnProperty('offset')) {
            query.skip = query.offset;
            delete query.offset;
        }

        if (query.hasOwnProperty('limit')) {
            query.top = query.limit;
            delete query.limit;
        }

        return this._super(...arguments);
    }


}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'application': ApplicationAdapter;
  }
}

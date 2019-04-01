import Route from '@ember/routing/route';
import Intl from 'ember-intl/services/intl';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CurrentUser from '../current-user/service';
import Session from 'ember-simple-auth/services/session';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin, {}) {
    @service session!: Session;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;

    async beforeModel() {
        super.beforeModel(...arguments);
        // this._super(...arguments);
        if (this.session.isAuthenticated) {
            await this.currentUser.load()
        }
        return this.intl.setLocale('en-us');
    }

    async sessionAuthenticated() {
        const currentUser = await this.currentUser.load();
        super.sesssionAuthenticated(...arguments);
        return currentUser;
    }

    @action
    error(errorInfo: any) {
        if (errorInfo) {
            if (errorInfo.statusCode === 403) {
                return this.replaceWith('fourOhThree');
            } else if (errorInfo.statusCode === 401) {
                document.location.href = '/login';
            } else if (errorInfo.statusCode === 404) {
                return this.replaceWith('fourOhFour', '404');
            } else {
                //if the error isn't handled, let it bubble
                //so that an error substate route can be shown
                return true;
            }
        }
        return false;
    }

    @action
    invalidateSession() {
        return this.session.invalidate();
    }
}

import Route from '@ember/routing/route';
import Intl from 'ember-intl/services/intl';
import Session from 'ember-simple-auth/services/session';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CurrentUser from '../current-user/service';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin, {}) {
    @service session!: Session;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;

    async beforeModel() {
        this._super(...arguments);
        if (this.session.isAuthenticated) {
            await this.currentUser.load()
        }
        return this.intl.setLocale('en-us');
    }

    async sessionAuthenticated() {
        //workaround for gotcha of using this._super() after an `await`
        //https://github.com/ember-cli/ember-cli/issues/6282
        const _super = this._super;
        const args = arguments;
        //get the current user's model before transitioning from the login page
        const currentUser = await this.currentUser.load();
        _super.apply(this, args);
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

import Route from '@ember/routing/route';
import Intl from 'ember-intl/services/intl';
import Session from 'ember-simple-auth/services/session';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUser from '../current-user/service';
import Transition from '@ember/routing/-private/transition';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import ENV from 'octane-bootcamp/config/environment';
import Fastboot from 'ember-cli-fastboot/services/fastboot';

export default class ApplicationRoute extends Route {
    @service fastboot!: Fastboot;
    @service session!: Session;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;

    constructor(...args: any[]) {
        super(...args);
        this._subscribeToSessionEvents();
    }

    _subscribeToSessionEvents() {
        this.session.on('authenticationSucceeded', () => this.sessionAuthenticated());
        this.session.on('invalidationSucceeded', () => this.sessionInvalidated());
    }

    @computed()
    get routeAfterAuthentication () {
        return ENV['ember-simple-auth'].routeAfterAuthentication;
    }

    async sessionAuthenticated() {
        await this.currentUser.load();
        const attemptedTransition = this.session.attemptedTransition;
        const cookies = getOwner(this).lookup('service:cookies');
        const redirectTarget = cookies.read('ember_simple_auth-redirectTarget');

        if (attemptedTransition) {
            attemptedTransition.retry();
            // this.session.attemptedTransition = null;
            this.session.set('attemptedTransition', null);
            // this.set('session.attemptedTransition', null);
        } else if (redirectTarget) {
            this.transitionTo(redirectTarget);
            cookies.clear('ember_simple_auth-redirectTarget');
        } else {
            this.transitionTo(this.get('routeAfterAuthentication'));
        }
    }

    sessionInvalidated() {
        if (this.fastboot.isFastBoot) {
            this.transitionTo(ENV.rootURL);
        } else {
            window.location.replace(ENV.rootURL);
        }
    }

    async beforeModel(transition: Transition) {
        super.beforeModel(transition);
        // this._super(...arguments);
        if (this.session.isAuthenticated) {
            await this.currentUser.load()
        }
        return this.intl.setLocale('en-us');
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

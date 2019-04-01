import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import isFastBootCPM, { isFastBoot } from 'ember-simple-auth/utils/is-fastboot';
import { getOwner } from '@ember/application';
import ENV from 'octane-bootcamp/config/environment';
import Session from 'ember-simple-auth/services/session';
import Route from '@ember/routing/route';
import Transition from '@ember/routing/-private/transition';


type ConcreteSubclass<T> = new(...args: any[]) => T;

/**
 * If the user is unauthenticated, invoke `callback`
 *
 * @param {ApplicationInstance} owner The ApplicationInstance that owns the service (and possibly fastboot and cookie) service(s)
 * @param {Transition} transition Transition for the user's original navigation
 * @param {(...args: []any) => any} callback Callback that will be invoked if the user is unauthenticated
 */
function runIfUnauthenticated(owner: any, transition: any, callback: any) {
    const isFb = isFastBoot(owner);
    const sessionSvc = owner.lookup('service:session');
    if (!sessionSvc.get('isAuthenticated')) {
        if (isFb) {
            const fastboot = owner.lookup('service:fastboot');
            const cookies = owner.lookup('service:cookies');
            cookies.write('ember_simple_auth-redirectTarget', transition.intent.url, {
                path: '/',
                secure: fastboot.get('request.protocol') === 'https'
            });
        } else {
            sessionSvc.set('attemptedTransition', transition);
        }
        callback();
        return true;
    }
    return true;
}

export default function AuthenticatedRoute<T extends ConcreteSubclass<Route>>(RouteSubclass: T) {
    class AuthenticatedRoute extends RouteSubclass {
        /**
            The session service.
            @property session
            @readOnly
            @type SessionService
            @public
        */
        @service session!: Session;

        _isFastBoot = isFastBootCPM();


        /**
            Checks whether the session is authenticated and if it is not aborts the
            current transition and instead transitions to the
            {{#crossLink "Configuration/authenticationRoute:property"}}{{/crossLink}}.
            If the current transition is aborted, this method will save it in the
            session service's
            {{#crossLink "SessionService/attemptedTransition:property"}}{{/crossLink}}
            property so that  it can be retried after the session is authenticated
            (see
            {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
            If the transition is aborted in Fastboot mode, the transition's target
            URL will be saved in a `ember_simple_auth-redirectTarget` cookie for use by
            the browser after authentication is complete.
            __If `beforeModel` is overridden in a route that uses this mixin, the route's
            implementation must call `this._super(...arguments)`__ so that the mixin's
            `beforeModel` method is actually executed.

            @method beforeModel
            @param {Transition} transition The transition that lead to this route
            @public
        */
        beforeModel(transition: Transition) {
            const didRedirect = runIfUnauthenticated(getOwner(this), transition, () => {
                this.triggerAuthentication();
            });
            if (!didRedirect) {
                return super.beforeModel(transition);
                // return this._super(...arguments);
            }
        }

        /**
            Triggers authentication; by default this method transitions to the
            `authenticationRoute`. In case the application uses an authentication
            mechanism that does not use an authentication route, this method can be
            overridden.

            @method triggerAuthentication
            @protected
        */
        triggerAuthentication() {
            let authenticationRoute = this.authenticationRoute;
            assert('The route configured as Configuration.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== authenticationRoute);

            this._router.transitionTo(authenticationRoute);
        }

        @computed()
        get authenticationRoute () {
            return ENV['ember-simple-auth'].authenticationRoute;
        }

        @computed()
        get _router() {
            let owner = getOwner(this);
            return owner.lookup('service:router') || owner.lookup('router:main');
        }

    }
    return AuthenticatedRoute;
}

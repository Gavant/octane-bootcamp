import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import Configuration from './../configuration';
import isFastBoot from 'ember-simple-auth/utils/is-fastboot';
import { getOwner } from '@ember/application';
import ENV from 'octane-bootcamp/config/environment';
import Session from 'ember-simple-auth/services/session';
import Route from '@ember/routing/route';


type ConcreteSubclass<T> = new(...args: any[]) => T;

function runIfAuthenticated(owner: any, callback: any) {
    const sessionSvc = owner.lookup('service:session');
    if (sessionSvc.get('isAuthenticated')) {
        callback();
        return true;
    } else {
        return false;
    }
}

export default function unauthenticatedRoute<T extends ConcreteSubclass<Route>>(RouteSubclass: T) {
    class UnauthenticatedRoute extends RouteSubclass {
        @service session!: Session;

        _isFastBoot= isFastBoot();

        beforeModel() {
          const didRedirect = runIfAuthenticated(getOwner(this), () => {
            let routeIfAlreadyAuthenticated = this.routeIfAlreadyAuthenticated;
            assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== routeIfAlreadyAuthenticated);

            this.transitionTo(routeIfAlreadyAuthenticated);
          });
          if (!didRedirect) {
            return this._super(...arguments);
          }
        }

        @computed()
        get routeIfAlreadyAuthenticated () {
            return ENV['ember-simple-auth'].routeIfAlreadyAuthenticated;
        }

    }
    return UnauthenticatedRoute;
}

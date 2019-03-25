import Service from '@ember/service';
import Session from 'ember-simple-auth/services/session';
import Ajax from '../ajax/service';
import DS from 'ember-data';
import { inject as service } from '@ember/service';
import { reject } from 'rsvp';
import Employee from '../employee/model';

export default class CurrentUser extends Service {
    @service store!: DS.Store;
    @service session!: Session;
    @service ajax!: Ajax;
    user: any[] | DS.Model | null = null;

    load() {
        return this.fetchUser();
    }

    refresh() {
        //only attempt to refresh the user if there is a logged in user
        if (this.session.isAuthenticated) {
            return this.fetchUser();
        } else  {
            return reject();
        }
    }

    async fetchUser() {
        const response = await this.ajax.request('users/me');
        const json = this.store.normalize('employee', response.employee);
        const me = this.store.push(json) as Employee;
        this.user = me;
        this.session.user = { me };
        return me;
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUser;
  }
}

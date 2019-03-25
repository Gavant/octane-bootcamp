import Route from '@ember/routing/route';
import Validations from 'octane-bootcamp/validations/login';
import ChangesetRoute from 'gavant-ember-validations/mixins/changeset-route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default class Login extends Route.extend(ChangesetRoute, UnauthenticatedRouteMixin, {
    validations: Validations
}) {
    model() {
        return {
            emailAddress: null,
            password: null
        }
    }
}

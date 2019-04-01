import Route from '@ember/routing/route';
import Validations from 'octane-bootcamp/validations/login';
import ChangesetRoute from 'gavant-ember-validations/decorators/changeset-route';
import UnauthenticatedRoute from 'octane-bootcamp/decorators/unathenticated-route';

@UnauthenticatedRoute
@ChangesetRoute
export default class Login extends Route {
    validations = Validations;
    model() {
        return {
            emailAddress: null,
            password: null
        }
    }
}

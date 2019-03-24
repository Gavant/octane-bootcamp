import Route from '@ember/routing/route';
import ChangesetRoute from 'gavant-ember-validations/mixins/changeset-route';
import Validations from 'levrx-admin/validations/login';

export default class Login extends Route {
    validations: Validations
    model() {
        return {
            emailAddress: null,
            password: null
        }
    }
}

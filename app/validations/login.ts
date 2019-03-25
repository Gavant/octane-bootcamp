import { validatePresence } from 'ember-changeset-validations/validators';

export default {
    emailAddress: [validatePresence(true)],
    password: [validatePresence(true)]
};

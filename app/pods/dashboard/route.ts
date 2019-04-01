import Route from '@ember/routing/route';
import AuthenticatedRoute from 'octane-bootcamp/decorators/authenticated-route';

@AuthenticatedRoute
export default class Dashboard extends Route {
  // normal class body definition here
}

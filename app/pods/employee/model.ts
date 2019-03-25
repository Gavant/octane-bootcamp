import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default class Employee extends Model {
    @attr('string') firstName: string;
    @attr('string') lastName: string;
    @attr('string') email: string;
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'employee': Employee;
  }
}

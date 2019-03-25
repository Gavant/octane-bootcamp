import DS from 'ember-data';
import RESTSerializer from 'ember-data/serializers/rest';

interface serializeOptions {
    includeId?: boolean
}

export default class ApplicationSerializer extends RESTSerializer {
    serialize(snapshot: DS.Snapshot, options: serializeOptions) {
        if(!options) {
            options = {};
        }

        //include the record ID in the request body for PUTs, ect
        options.includeId = true;
        return this._super(snapshot, options);
    }

    serializeIntoHash(data: any, type: any, record: any, options: any) {
        Object.assign(data, this.serialize(record, options));
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    'application': ApplicationSerializer;
  }
}

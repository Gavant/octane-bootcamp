import DS from 'ember-data';
import RESTSerializer from 'ember-data/serializers/rest';

interface serializeOptions {
    includeId?: boolean
}

export default class ApplicationSerializer extends RESTSerializer {
    extractErrors(store: DS.Store, typeClass: any, payload: any) {
        if(payload && typeof payload === 'object' && payload._problems) {
            payload = payload._problems;
            this.normalizeErrors(typeClass, payload);
        }

        return payload;
    }

    payloadKeyFromModelName() {
        return 'data';
    }

    serialize(snapshot: DS.Snapshot, options: serializeOptions) {
        if(!options) {
            options = {};
        }

        //include the record ID in the request body for PUTs, ect
        options.includeId = true;
        return this._super(snapshot, options);
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    'application': ApplicationSerializer;
  }
}

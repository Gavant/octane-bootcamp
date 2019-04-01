import Service from '@ember/service';

declare module 'ember-cli-fastboot/services/fastboot' {
    export default class fastboot extends Service {
        isFastBoot: boolean
    }
}

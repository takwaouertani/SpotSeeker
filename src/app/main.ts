import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import './firebase-init'; // Import Firebase initialization
import { init as initFID } from 'first-input-delay'; // Import First Input Delay polyfill
import { environment } from '../environments/environment';
import { AppModule } from './app.module';

if (environment.production) {
  enableProdMode();
}

// Initialize the First Input Delay polyfill
initFID({
  callback: (firstInputDelay) => {
    console.log('First Input Delay:', firstInputDelay);
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

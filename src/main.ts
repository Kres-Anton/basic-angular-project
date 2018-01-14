import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/root-component/app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
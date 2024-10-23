/// <reference types="node" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { worker } from './mocks/browser';
import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

worker.start().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(),
      importProvidersFrom(
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCheckboxModule
      ),
      provideAnimations(),
      provideRouter(routes),
      provideExperimentalZonelessChangeDetection()
    ],
  }).catch((err) => console.error(err));
});

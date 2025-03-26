import { NgModule } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [],
  providers: []
})
export class AppModule {
  constructor() {
    bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes)
      ]
    }).catch(err => console.error(err));
  }
}
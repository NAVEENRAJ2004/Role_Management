import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

// Admin guard function
const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

// User guard function
const userGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent,
    canActivate: [userGuard]
  }
];

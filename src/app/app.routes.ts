import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.log('Not logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
  return true;
};

// Admin guard function
const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.log('Not logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  return authService.isAdmin().pipe(
    tap(isAdmin => console.log('Admin guard check:', isAdmin)),
    map(isAdmin => {
      if (!isAdmin) {
        console.log('Not an admin, redirecting to user dashboard');
        router.navigate(['/user-dashboard']);
        return false;
      }
      console.log('Admin access granted');
      return true;
    }),
    catchError(error => {
      console.error('Admin guard error:', error);
      router.navigate(['/login']);
      return of(false);
    })
  );
};

// User guard function
const userGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.log('Not logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  return authService.getCurrentUser().pipe(
    tap(user => console.log('User guard check:', user)),
    map(user => {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
      if (user.role === 'ADMIN') {
        console.log('Admin user, redirecting to admin dashboard');
        router.navigate(['/admin-dashboard']);
        return false;
      }
      console.log('User access granted');
      return true;
    }),
    catchError(error => {
      console.error('User guard error:', error);
      router.navigate(['/login']);
      return of(false);
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
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent,
    canActivate: [authGuard, userGuard]
  }
];

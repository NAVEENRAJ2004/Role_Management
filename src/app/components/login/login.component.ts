// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = false;
  errorMessage = '';
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loading$ = this.authService.loading$;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      // Add a small delay to show loading state
      this.authService.login(username, password, 500).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (!response.user || !response.user.role) {
            this.loginError = true;
            this.errorMessage = 'Invalid user data received';
            return;
          }

          // Navigate to the appropriate dashboard based on role
          switch(response.user.role) {
            case 'ADMIN':
              console.log('Navigating to admin dashboard');
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'USER':
              console.log('Navigating to user dashboard');
              this.router.navigate(['/user-dashboard']);
              break;
            default:
              this.loginError = true;
              this.errorMessage = 'Invalid user role';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loginError = true;
          this.errorMessage = error.error?.message || 'Invalid username or password';
        }
      });
    }
  }
}
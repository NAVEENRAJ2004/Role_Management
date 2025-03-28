import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string = ''; // Store error message
  showPassword = false; // Toggle password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);

          // ✅ Display user-friendly error messages
          if (err.status === 400 && err.error?.message) {
            if (err.error.message.includes("User with this email or username already exists")) {
              this.registerError = "⚠ User with this email or username already exists!";
            } else {
              this.registerError = "⚠ Registration failed. Please try again.";
            }
          } else {
            this.registerError = "⚠ Registration failed. Please check your details.";
          }
        }
      });
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
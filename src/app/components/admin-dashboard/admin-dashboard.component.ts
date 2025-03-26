import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  users: User[] = [];
  editingUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  loading$: Observable<boolean>;
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.loading$ = this.authService.loading$;
  }

  ngOnInit() {
    // First get current user
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          console.log('Current user loaded:', user);
          this.currentUser = user;
          if (user?.role !== 'ADMIN') {
            console.log('Not an admin user, redirecting to login');
            this.router.navigate(['/login']);
            return;
          }
          // Then load all users
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error loading current user:', error);
          this.errorMessage = 'Error loading user information';
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadUsers() {
    console.log('Loading users...');
    this.subscriptions.add(
      this.authService.getUsers(1000).subscribe({
        next: (users: User[]) => {
          console.log('Users loaded:', users);
          this.users = users.filter(user => user._id !== this.currentUser?._id);
          console.log('Filtered users:', this.users);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.errorMessage = 'Error loading users list';
        }
      })
    );
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'ADMIN').length;
  }

  getUserCount(): number {
    return this.users.filter(u => u.role === 'USER').length;
  }

  startEdit(user: User) {
    this.editingUser = { ...user };
  }

  cancelEdit() {
    this.editingUser = null;
  }

  updateUser(user: User) {
    if (!user._id) {
      this.errorMessage = 'Invalid user ID';
      return;
    }

    this.subscriptions.add(
      this.authService.updateUser(user._id, {
        role: user.role,
        approved: user.approved
      }, 500).subscribe({
        next: () => {
          this.successMessage = 'User updated successfully';
          this.loadUsers();
          this.editingUser = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Error updating user';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      })
    );
  }

  deleteUser(userId: string | undefined) {
    if (!userId) {
      this.errorMessage = 'Invalid user ID';
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.subscriptions.add(
      this.authService.deleteUser(userId, 500).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Error deleting user';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      })
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
// src/app/components/user-dashboard/user-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  tasks: Task[] = [];
  newTaskTitle: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // Mock tasks
    this.tasks = [
      { id: 1, title: 'Complete project report', completed: false },
      { id: 2, title: 'Attend team meeting', completed: true },
      { id: 3, title: 'Review code changes', completed: false }
    ];
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.tasks.push({
        id: this.tasks.length + 1,
        title: this.newTaskTitle,
        completed: false
      });
      this.newTaskTitle = '';
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
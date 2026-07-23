import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BUSINESS_CONTACT } from './constants/business-contact';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'KNOTIX';
  contact = BUSINESS_CONTACT;
  
  // Theme state signal
  isDarkMode = signal<boolean>(false);

  // Role state signal
  isAdmin = signal<boolean>(false);

  ngOnInit(): void {
    // Detect theme preference from localStorage or fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.isDarkMode.set(true);
    } else {
      this.isDarkMode.set(false);
    }

    this.applyTheme();

    // Check initial user role
    const currentRole = localStorage.getItem('role');
    const currentToken = localStorage.getItem('token');
    if (currentRole === 'ADMIN' || currentToken === 'admin-token') {
      this.isAdmin.set(true);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
    this.applyTheme();
  }

  toggleRole(): void {
    if (this.isAdmin()) {
      localStorage.setItem('role', 'CUSTOMER');
      localStorage.removeItem('token');
      this.isAdmin.set(false);
      
      // Redirect to catalog if on admin route
      const currentPath = window.location.pathname;
      if (currentPath.includes('register') || currentPath.includes('edit')) {
        window.location.href = '/';
      }
    } else {
      localStorage.setItem('role', 'ADMIN');
      localStorage.setItem('token', 'admin-token');
      this.isAdmin.set(true);
    }
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'KNOTIX';
  
  // Theme state signal
  isDarkMode = signal<boolean>(false);

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
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
    this.applyTheme();
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

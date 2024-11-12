import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }

  navigateToHomeAndScroll() {
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        const element = document.getElementById('forms');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0); 
    });
}
}

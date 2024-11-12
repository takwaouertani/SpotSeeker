import { AfterViewInit, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { AuthAdminService } from '../../service/auth-admin.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit {
  constructor(private firestore: AngularFirestore,private authservice:AuthAdminService) { }
  ngOnInit() {
  
    this.CommentCount$ = this.firestore.collection('comments').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    

   
  }
  CommentCount$!: Observable<number>;

  ngAfterViewInit(): void {

    this.setupDocumentEvents();
  }
  menuOpen: boolean = false; // Track the state of the menu

  private setupDocumentEvents(): void {
    document.addEventListener('DOMContentLoaded', (): void => {
      const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

      allSideMenu.forEach((item: Element): void => {
        const li = item.parentElement as HTMLElement;

        item.addEventListener('click', (): void => {
          allSideMenu.forEach((i: Element): void => {
            (i.parentElement as HTMLElement).classList.remove('active');
          });
          li.classList.add('active');
        });
      });

      const menuBar = document.querySelector('#content nav .bx.bx-menu') as HTMLElement;
      const sidebar = document.getElementById('sidebar') as HTMLElement;
      const logo = document.querySelector('.brand img') as HTMLElement;

      menuBar.addEventListener('click', (): void => {
        sidebar.classList.toggle('hide');
        logo.classList.toggle('small');
      });

      const searchButton = document.querySelector('#content nav form .form-input button') as HTMLElement;
      const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx') as HTMLElement;
      const searchForm = document.querySelector('#content nav form') as HTMLElement;

      searchButton.addEventListener('click', (e: MouseEvent): void => {
        if (window.innerWidth < 576) {
          e.preventDefault();
          searchForm.classList.toggle('show');
          if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
          } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
          }
        }
      });

      if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
      } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
      }

      window.addEventListener('resize', (): void => {
        if (window.innerWidth > 576) {
          searchButtonIcon.classList.replace('bx-x', 'bx-search');
          searchForm.classList.remove('show');
        }
      });

      const switchMode = document.getElementById('switch-mode') as HTMLInputElement;

      switchMode.addEventListener('change', (): void => {
        if (switchMode.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
    });
  }
    darkMode: boolean = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.toggleImageSize(); // Call the method to adjust image size
  }
  toggleImageSize() {
    const logo = document.querySelector('.brand img') as HTMLElement;
    if (this.menuOpen || this.darkMode) {
      logo.classList.add('large');
    } else {
      logo.classList.remove('large');
    }
  }
  logout(){
    this.authservice.logout();
  }
}

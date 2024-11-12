import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
  ) {}

  isAuthenticated(): boolean {
    return localStorage.getItem('isAdmin') === 'true' && this.fireauth.currentUser !== null;
  }

  logout(): void {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('isAdmin');
      this.router.navigate(['/home']);
    }).catch((err) => {
      alert(err.message);
    });
  }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      userCredential.user?.getIdTokenResult().then((idTokenResult) => {
        // Manually handle admin verification
        if (email === 'ayariessia228@gmail.com') { 
          localStorage.setItem('isAdmin', 'true');
          this.router.navigate(['/admin/dashboard']);
        } else {
          alert('You are not authorized to access the admin dashboard.');
          this.logout(); 
        }
      }).catch((err) => {
        alert('Failed to retrieve token: ' + err.message);
      });
    }).catch((err) => {
      alert(err.message);
      this.router.navigate(['/login_admin']);
    });
  }
}

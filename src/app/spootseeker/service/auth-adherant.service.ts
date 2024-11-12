import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Route, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { LoginAdherant } from '../classes/login-adherant';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthAdherantService {
  user$: Observable<any>; 

  constructor(private fireauth: AngularFireAuth, private router: Router , private firestore: AngularFirestore) {
    this.user$ = fireauth.authState;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user) 
    );
  }
  checkUserExists(email: string, password: string): Promise<boolean> {
    return this.firestore.collection('login_adherant', ref =>
      ref.where('email', '==', email).where('password', '==', password))
      .get()
      .toPromise()
      .then(querySnapshot => {
        // Vérifier si le querySnapshot est défini et non vide
        if (querySnapshot && !querySnapshot.empty) {
          return true; // L'utilisateur existe
        } else {
          return false; // L'utilisateur n'existe pas
        }
      })
      .catch(error => {
        console.error('Error checking user existence:', error);
        return false; // En cas d'erreur, renvoyer false pour indiquer que l'utilisateur n'existe pas
      });
  }
  //login method
  login(email: string, password: string): Promise<void> {
    return this.fireauth.signInWithEmailAndPassword(email, password)
      .then(() => {
        localStorage.setItem('token', 'true');
      });
  }
  private addUserToLoginAdherant(email: string, password: string): Promise<void> {
    const loginAdherant = new LoginAdherant(email, password);
    return this.firestore.collection('login_adherant').add({ ...loginAdherant }) .then(() => {
      // Retourne simplement void après que l'opération est terminée
  });
  }
  //register method
  register(email: string, password: string): Promise<void> {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then((res) => {
        // Enregistrer l'utilisateur dans Firestore
        const user = new LoginAdherant(email, password);
        return this.firestore.collection('login_adherant').add(Object.assign({}, user)).then(() => {
            return this.sendEmailVerification(res.user);
        });
    });
}
 
 

  //SIGN OUT
  logout(): Promise<void> {
    return this.fireauth.signOut().then(() => {
        localStorage.removeItem('token');
    });
}
async emailExists(email: string): Promise<boolean> {
  try {
    const emailSnapshot = await this.firestore.collection('login_adherant', ref => ref.where('email', '==', email)).get().toPromise();

    // Check if emailSnapshot is defined and not empty
    return emailSnapshot ? !emailSnapshot.empty : false;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false; // In case of error, assume the email does not exist
  }
}
  async forgotPass(email: string): Promise<void> {
    await this.fireauth.sendPasswordResetEmail(email);
  }

  // async emailExists(email: string): Promise<boolean> {
  //   try {
  //     // Utiliser la méthode fetchSignInMethodsForEmail pour vérifier les méthodes de connexion disponibles pour l'email
  //     const signInMethods = await this.fireauth.fetchSignInMethodsForEmail(email);
  //     // Si la liste n'est pas vide, l'email existe
  //     return signInMethods.length > 0;
  //   } catch (error) {
  //     // En cas d'erreur (comme un problème de réseau), loguer l'erreur et retourner false
  //     console.error('Error checking email existence:', error);
  //     return false;
  //   }
  // }

  async sendEmailVerification(user: any): Promise<void> {
    await user.sendEmailVerification();
  }
  //sign in with google
  async googlesignin(): Promise<void> {
    try {
      const result = await this.fireauth.signInWithPopup(new GoogleAuthProvider());
      // You can store additional user info if needed
      localStorage.setItem('token', JSON.stringify(result.user?.uid));
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }
}

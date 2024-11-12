import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comments } from '../classes/comments';
import { map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {


  constructor(private afs:AngularFirestore , private firestore: AngularFirestore , private fireauth: AngularFireAuth){}

  //add comment
  checkEmailExistsInComments(email: string): Observable<boolean> {
    return this.firestore.collection('comments', ref => ref.where('email_adhrent', '==', email))
      .get()
      .pipe(
        map(snapshot => !snapshot.empty)  // Retourne `true` si l'email existe, `false` sinon
      );
  }
  addComment(comment: Comments): Promise<void> {
    return this.firestore.collection('comments').add(comment)
      .then(() => {
        console.log('Comment added to Firestore');
      })
      .catch(error => {
        console.error('Error adding comment to Firestore:', error);
      });
  }
  //get comment

  getcomment(){
    return this.afs.collection('/comments').snapshotChanges();
  }
  getAverageRating(destinationId: string): Observable<number> {
    return this.firestore.collection<Comments>('comments', ref => ref.where('id_destination', '==', destinationId))
      .valueChanges().pipe(
        map(comments => {
          // Afficher les commentaires récupérés pour vérification
        
  
          // Calculer le total des évaluations
          const totalRatings = comments.reduce((acc, comment) => {
            const rating = Number(comment.rates);
            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
              return acc + rating;
            }
            return acc; // Ignorer les évaluations invalides
          }, 0);
    
          // Nombre de commentaires pour la destination spécifique
          const numberOfComments = comments.length;
    
          // Calculer la moyenne
          const averageRating = numberOfComments > 0 ? totalRatings / numberOfComments : 0;
    
          // Afficher les résultats pour vérification
       
    
          return averageRating;
        })
      );
  }
  countComments(): Observable<number> {
    return this.firestore.collection('/comments').get().pipe(
      map(snapshot => snapshot.size)
    );
  }
  //delete comment

  deletecomment(comment:Comments){
    return this.afs.doc('/comments/'+comment.id_comment).delete();
  }

  //update comment

  updatecomment(comment:Comments){
    this.deletecomment(comment);
    this.addComment(comment);

  }
  getCommentsByDestinationId(destinationId: string) {
    return this.afs.collection('/comments', ref => ref.where('id_destination', '==', destinationId)).snapshotChanges();
  }


  
  
}

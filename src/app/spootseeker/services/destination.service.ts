import { Injectable } from '@angular/core';
import { Destination } from '../classes/destination';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  constructor(private afs:AngularFirestore){}

  //add destination

  adddestination(destination: Destination): Promise<any> {
    destination.id_destination = this.afs.createId(); // Corrected method call
    return this.afs.collection('/destination').add(destination);
  }

  //get destination

  getdestination(){
    return this.afs.collection('/destination').snapshotChanges();
  }

  //delete destination

  deletedestination(destination:Destination){
    return this.afs.doc('/destination/'+destination.id_destination).delete();
  }

  //update destination

  updatedest(destination:Destination){
    this.deletedestination(destination);
    this.adddestination(destination);

  }
// Get destination by ID
getDestinationById(id: string): Observable<Destination | undefined> {
  return this.afs.doc<Destination>(`/destination/${id}`).valueChanges().pipe(
    switchMap(destination => {
      if (destination) {
        return of(destination);
      } else {
        // Handle the case where destination is undefined
        return of(undefined);
      }
    })
  );
}

}

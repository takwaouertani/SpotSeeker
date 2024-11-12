import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Destination } from '../classes/destination';

@Injectable({
  providedIn: 'root'
})
export class OwnersRequestsService {
  constructor(private afs:AngularFirestore){}

  //add owner_request

  addowner_request(destination:Destination){
    destination.id_destination=this.afs.createId();
    return this.afs.collection('/owner_request').add(destination);
  }
//get owner_request

getowner_request(){
  return this.afs.collection('/owner_request').snapshotChanges();
}

//delete owner_request

deleteowner_request(destination:Destination){
  return this.afs.doc('/owner_request/'+destination.id_destination).delete();
}

//update owner_request

updateowner_request(destination:Destination){
  this.deleteowner_request(destination);
  this.addowner_request(destination);

}
}

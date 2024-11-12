import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Events } from '../classes/events';

@Injectable({
  providedIn: 'root'
})
export class OrganiserRequestsService {

  constructor(private afs:AngularFirestore){}

  //add organiser_request

  addorganiser_request(event:Events){
    event.id_event=this.afs.createId();
    return this.afs.collection('/organiser_request').add(event);
  }
//get organiser_request

getorganiser_request(){
  return this.afs.collection('/organiser_request').snapshotChanges();
}

//delete organiser_request

deleteorganiser_request(event:Events){
  return this.afs.doc('/organiser_request/'+event.id_event).delete();
}

//update organiser_request

updateorganiser_request(event:Events){
  this.deleteorganiser_request(event);
  this.addorganiser_request(event);

}}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Events } from '../classes/events';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private afs:AngularFirestore){}

  //add event

  addevent(event:Events){
    event.id_event=this.afs.createId();
    return this.afs.collection('/event').add(event);
  }

  //get event

  getevent(){
    return this.afs.collection('/event').snapshotChanges();
  }

  //delete event

  deleteevent(event:Events){
    return this.afs.doc('/event/'+event.id_event).delete();
  }

  //update event

  updateevent(event:Events){
    this.deleteevent(event);
    this.addevent(event);



    
  }
//get event by id
  geteventbyid(id: string): Observable<Events | undefined> {
    return this.afs.doc<Events>(`/event/${id}`).valueChanges().pipe(
      switchMap(event => {
        if (event) {
          return of(event);
        } else {
          // Handle the case where destination is undefined
          return of(undefined);
        }
      })
    );
  }}

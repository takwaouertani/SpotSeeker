import { Time } from "@angular/common";

export class Events {
    constructor(
        public id_event: string,
        public name_event: string,
        public adresse: string,
        public description: string,
        public category: string,
        public type_event: string,
        public date_debut:Date,
        public date_fin: Date,
        public heure_debut: Time,
        public heure_fin: Time,
        public prix:number,
        public Dress_Code: string,
        public access_vip: boolean,
        public free_tickets: boolean,
        public state:string,
        public city:string,
        public facebook:string,
        public instagram: string,
        public website: string,
        public Capacity:number,
        public email_events: string,
        public event_phone_number:number,
        public  images: string[],
        public organiserdata: {
          first_name: string,
          last_name: string,
          email: string,
          Phone_number: number,
        }[] 
        
      ) {}
}

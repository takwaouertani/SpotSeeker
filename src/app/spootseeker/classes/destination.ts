import { Time } from "@angular/common";
import { Comments } from "./comments";

export class Destination {
    constructor(
      public id_destination: string,
      public name_destination: string,
      public adresse: string,
      public description: string,
      public city: string,
      public state: string,
      public category: string,
      public type_destination: string,
      public menu: string[],
      public smoking_area: boolean,
      public wifi_availibily: boolean,
      public pet_friendly: boolean,
      public kids_corner: boolean,
      public parking: boolean,
      public credit_card: boolean,
      public reservation: boolean,
      public opening_hour: Time,
      public closing_hour: Time,
     public min_price: number, // New attribute for minimum price
     public max_price: number, // New attribute for maximum price    
     public email_destination: string,
      public destinaition_phone_number: number,
      public facebook: string,
      public instagram: string,
      public website: string,
      public rate:string,
      public images: string[], 
      public ownerdata: {
        first_name: string,
        last_name: string,
        email: string,
        Phone_number: number,
      }[],

    ) {}
  }
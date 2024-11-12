import { Component } from '@angular/core';
import { Events } from '../classes/events';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { event } from 'jquery';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent {
  eventlist: Events[] = [];
  eventCategorylist: Events[] = [];
   filtrer=false
   nonfilter:boolean=false;
   adresse!: string ;
   description!: string ;
   category!: string ;
   email_events!: string ;
   event_phone_number!: number ;
   facebook!: string;
   instagram!: string ;
   access_vip!: string ;
   free_tickets!: string ;
   selectedcategory!:string;
   website!: string ;
   images!: string ;
   eventparnomlist: Events[] = [];
   filtrernom:boolean=false;
   searchTerm: string = ''; 
 city: string='';
 state: string='';
 eventslistparcitystate: Events[] = [];
 evntsFoundparcitystate:boolean=false;
 selectedState: string = ''; 
 selectedCity: string = '';
 cities: string[] = [];
   constructor(private eventnservice: EventsService, private router: Router) {}
   ngOnInit(): void {
     this.getevents();
   }
 
 
   getevents() {
     this.eventnservice.getevent().subscribe(
       (res: any) => {
         this.eventlist = res.map((e: any) => {
           const data = e.payload.doc.data();
           return {
             id_event: e.payload.doc.id,
             name_event: data.name_event,
             adresse: data.adresse,
             description: data.description,
             category: data.category,
             type_event: data.type_event,
             access_vip: data.access_vip,
             free_tickets: data.free_tickets,
             Dress_Code: data.Dress_Code,
             city: data.city,
             state: data.state,
             date_debut: data.date_debut,
             date_fin: data.date_fin,
             heure_debut: data.heure_debut,
             heure_fin: data.heure_fin,
             prix: data.prix,
             email_events: data.email_events,
             event_phone_number: data.event_phone_number,
             facebook: data.facebook,
             instagram: data.instagram,
             website: data.website,
             rate: data.rate,
             images: data.images || [],
             organiserdata: data.organiserdata || [],
             
           };
         });
       },
       err => {
         console.error('Error fetching destinations:', err);
       }
     );
   }
 
   
 
  
   
   
 
   
 
   navigateToDetails(evenid: string): void {
     this.router.navigate(['/event', evenid]);
   }
 
   
   priceRange!:string 
  priceevents: Events[] = [];
 
   
 
 
  Destinationfiltree(): void {

    let eventCategorylist = this.eventlist;
  
    if (this.selectedCity) {
      eventCategorylist = eventCategorylist.filter(event => event.city === this.selectedCity);
    }
  
    if (this.free_tickets) {
      eventCategorylist = eventCategorylist.filter(event => event.free_tickets === true);
    }
  
    if (this.access_vip) {
      eventCategorylist = eventCategorylist.filter(event => event.access_vip === true);
    }
  
    if (this.selectedcategory) {
      eventCategorylist = eventCategorylist.filter(event => event.category === this.selectedcategory);
    }
  
    
    this.eventCategorylist = eventCategorylist;
   this.filtrernom = false;
   this.filtrer = true;
   this.nonfilter=false;
   if(this.eventCategorylist.length==0){
     this.nonfilter=true;
     this.filtrernom = false;
   this.filtrer = true;
   this.evntsFoundparcitystate=false;
 
   }
 
 }
 
 Destinationfiltreeparnom(): void {
   if (this.searchTerm.trim() === '') {
       this.eventparnomlist = this.eventlist;
   } else {
       this.eventparnomlist = this.eventlist.filter(event =>
         event.name_event.toLowerCase().includes(this.searchTerm.toLowerCase())
       );
   }
   this.filtrernom = true;
   this.filtrer = false;
   this.nonfilter=false;
   this.evntsFoundparcitystate=false;
 }
   
   // Define cities by state
   citiesByState: { [key: string]: string[] } = {
     "Tunis": ["Tunis", "La Marsa", "Carthage", "Le Bardo", "Sidi Bou Said"],
     "Ariana": ["Ariana", "Ettadhamen", "Sidi Thabet", "Raoued", "La Soukra"],
     "Ben Arous": ["Ben Arous", "Megrine", "Hammam Lif", "Hammam Chott", "Mohamedia-Fouchana"],
     "Manouba": ["Manouba", "Den Den", "Douar Hicher", "Oued Ellil", "Tebourba"],
     "Nabeul": ["Nabeul", "Hammamet", "Dar Chaabane", "Kelibia", "Menzel Temime"],
     "Zaghouan": ["Zaghouan", "Zriba", "El Fahs", "Nadhour", "Bir Mcherga"],
     "Bizerte": ["Bizerte", "Menzel Bourguiba", "Mateur", "Ras Jebel", "Ghar El Melh"],
     "Béja": ["Béja", "Medjez El Bab", "Testour", "Nefza", "Teboursouk"],
     "Jendouba": ["Jendouba", "Tabarka", "Aïn Draham", "Fernana", "Balta"],
     "Kef": ["Le Kef", "Dahmani", "Tajerouine", "Jérissa", "Sakiet Sidi Youssef"],
     "Siliana": ["Siliana", "Bou Arada", "Gaâfour", "Makthar", "El Krib"],
     "Kairouan": ["Kairouan", "Sousse", "Sfax", "Monastir", "Mahdia"],
     "Kasserine": ["Kasserine", "Sbeitla", "Fériana", "Sbiba", "Thala"],
     "Sidi Bouzid": ["Sidi Bouzid", "Cebbala Ouled Asker", "Menzel Bouzaiane", "Meknassy", "Jilma"],
     "Sousse": ["Sousse", "Hammam Sousse", "Ksibet Thrayet", "Akouda", "Kalâa Kebira"],
     "Mahdia": ["Mahdia", "Ouled Chamekh", "Chebba", "Mellouleche", "Bou Merdes"],
     "Monastir": ["Monastir", "Moknine", "Ksar Hellal", "Ouerdanine", "Téboulba"],
     "Gabès": ["Gabès", "Médenine", "Tataouine", "Matmata", "Zarzis"],
     "Médenine": ["Médenine", "Ben Gardane", "Zarzis", "Djerba", "Houmt Souk"],
     "Tataouine": ["Tataouine", "Ghomrassen", "Remada", "Bir Lahmar", "Dhehiba"],
     "Gafsa": ["Gafsa", "Métlaoui", "El Ksar", "Redeyef", "Moulares"],
     "Tozeur": ["Tozeur", "Degache", "Tamerza", "Nefta", "El Hamma du Jérid"],
     "Kebili": ["Kebili", "Douz", "Souk Lahad", "Faouar", "El Golâa"],
     "Sfax": ["Sfax", "Sakiet Ezzit", "Sakiet Eddaier", "Chihia", "Gremda"]
   };
  
   displayCities() {
     this.cities = this.citiesByState[this.selectedState] || [];
   }
   getStates(): string[] {
     return Object.keys(this.citiesByState);
   }
  
 eventstatecity:boolean=false;
   filterevent() {
     console.log("Selected State:", this.selectedState);
     console.log("Selected City:", this.selectedCity);
     if (this.selectedState.trim() === '' && this.selectedCity.trim() === '') {
         this.eventslistparcitystate = this.eventlist;
     } else {
         this.eventslistparcitystate = this.eventlist.filter(event =>
             (event.state && event.state.toLowerCase().includes(this.selectedState.toLowerCase())) && 
             (event.city && event.city.toLowerCase().includes(this.selectedCity.toLowerCase()))
         );
          this.eventstatecity = true;
          this.filtrernom = false;
           this.filtrer = false;
           this.nonfilter=false;
           this.evntsFoundparcitystate=true;

         
         this.evntsFoundparcitystate = this.eventslistparcitystate.length > 0;
     }
     console.log('this.destinationFoundparcitystate', this.evntsFoundparcitystate);
     if(this.eventslistparcitystate.length==0){
      this.nonfilter=true;
      this.filtrernom = false;
    this.filtrer = false;
    this.eventstatecity = true;
  
    }
 }
}

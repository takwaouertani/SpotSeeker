import { Component } from '@angular/core';
import { Destination } from '../classes/destination';
import { Router } from '@angular/router';
import { DestinationService } from '../services/destination.service';

@Component({
  selector: 'app-all-picnicspots',
  templateUrl: './all-picnicspots.component.html',
  styleUrl: './all-picnicspots.component.css'
})
export class AllPicnicspotsComponent {
  destinationlist: Destination[] = [];
  destinationCategorylist: Destination[] = [];
  filtrer=false
  nonfilter:boolean=false;
  adresse!: string;
  description!: string ;
  category!: string ;
  menu!: string ;
  wifi_availibily!: boolean ;
  email_destination!: string ;
  destinaition_phone_number!: number ;
  facebook!: string ;
  instagram!: string ;
  website!: string ;
  rate!:string 
  images!: string ;
  destinationparnomlist: Destination[] = [];
  filtrernom:boolean=false;
  searchTerm: string = ''; 
city: string='';
state: string='';
destinationlistparcitystate: Destination[] = [];
destinationFoundparcitystate:boolean=false;
selectedState: string = ''; 
selectedCity: string = '';
cities: string[] = [];
  constructor(private destinationservice: DestinationService, private router: Router) {}
  ngOnInit(): void {
    this.getdestination();
  }

getdestination() {
    this.destinationservice.getdestination().subscribe(
      (res: any) => {
        this.destinationlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          if (data.category === 'park' || data.category == 'amusement-parks' || data.category == 'acamping-center') {
            return {
              id_destination: e.payload.doc.id,
              name_destination: data.name_destination,
              adresse: data.adresse,
              description: data.description,
              category: data.category,
              type_destination: data.type_destination,
              city: data.city,
              state: data.state,
              menu: data.menu,
              smoking_area: data.smoking_area,
              wifi_availibily: data.wifi_availibily,
              pet_friendly: data.pet_friendly,
              kids_corner: data.kids_corner,
              parking: data.parking,
              credit_card: data.credit_card,
              reservation: data.reservation,
              opening_hour: data.opening_hour,
              closing_hour: data.closing_hour,
              price_range: data.price_range,
              email_destination: data.email_destination,
              destinaition_phone_number: data.destinaition_phone_number,
              facebook: data.facebook,
              instagram: data.instagram,
              website: data.website,
              rate: data.rate,
              images: data.images || [],
              ownerdata: data.ownerdata || [],
            };
          } else {
            
            return null;
          }
        }).filter((destination: any) => destination !== null); 
      },
      err => {
        console.error('Error fetching destinations:', err);
      }
    );
  }
 navigateToDetails(destinationId: string) {
    this.router.navigate(['/place', destinationId]);
}

  Scenic_Picnic_Spot:boolean=false
  credit_card:boolean=false
  parking_Space:boolean=false
  Outdoor_Space:boolean=false
  Free_Wifi:boolean=false
  Pet_Friendly:boolean=false
  Kids_Corner:boolean=false
  smoking_area:boolean=false
  Reservation:boolean=false
  Free_wifi:boolean=false
  selectedtype:string=''
  priceRange:string=''
 pricedestinations: Destination[] = [];

  


 Destinationfiltree(): void {
  this.destinationCategorylist = this.destinationlist;

  if (this.selectedtype) {
    this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
      return destination.type_destination && destination.type_destination.toLowerCase() === this.selectedtype.toLowerCase();
    });
  }

  if (this.priceRange) {
    this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
      if (this.priceRange === 'under_30dt') {
        return destination.min_price <= 30;
      } else if (this.priceRange === '30dt_70dt') {
        return destination.max_price > 30 && destination.min_price <= 70;
      } else if (this.priceRange === '70dt_100dt') {
        return destination.max_price > 70 && destination.min_price <= 100;
      } else if (this.priceRange === 'over_100dt') {
        return destination.max_price > 100;
      }
      return true; 
    });
  }

  this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
    return (
      (!this.credit_card || destination.credit_card) &&
      (!this.parking_Space || destination.parking) &&
      (!this.Free_Wifi || destination.wifi_availibily) &&
      (!this.Pet_Friendly || destination.pet_friendly) &&
      (!this.Kids_Corner || destination.kids_corner) &&
      (!this.Reservation || destination.reservation) &&
      (!this.smoking_area || destination.smoking_area)
    );
  });

  console.log('Filtered Destination List:', this.destinationCategorylist);

  this.filtrernom = false;
  this.filtrer = true;
  this.destinationstatecity = false;
  this.nonfilter = this.destinationCategorylist.length === 0;

  if (this.nonfilter) {
    this.filtrernom = false;
    this.filtrer = true;
    this.destinationstatecity = false;
  }

 this.resetFilters();
}
resetFilters(){
  this.credit_card = false;
  this.parking_Space = false;
  this.Outdoor_Space = false;
  this.Free_Wifi = false;
  this.Pet_Friendly = false;
  this.Kids_Corner = false;
  this.smoking_area = false;
  this.Reservation = false;
  this.Free_wifi = false;
  this.selectedtype = '';
  this.priceRange = '';
}

Destinationfiltreeparnom(): void {
  if (this.searchTerm.trim() === '') {
      this.destinationparnomlist = this.destinationlist;
  } else {
      this.destinationparnomlist = this.destinationlist.filter(destination =>
          destination.name_destination.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  // Met à jour les variables pour afficher le message approprié
  this.filtrernom = true;
  this.filtrer = false;
  this.destinationstatecity = false;
  this.nonfilter = this.destinationparnomlist.length === 0;
  
  this.resetFilters();
}
  
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
 
destinationstatecity:boolean=false;
  filterDestinations() {
    console.log("Selected State:", this.selectedState);
    console.log("Selected City:", this.selectedCity);
    if (this.selectedState.trim() === '' && this.selectedCity.trim() === '') {
        this.destinationlistparcitystate = this.destinationlist;
    } else {
        this.destinationlistparcitystate = this.destinationlist.filter(destination =>
            (destination.state && destination.state.toLowerCase().includes(this.selectedState.toLowerCase())) && 
            (destination.city && destination.city.toLowerCase().includes(this.selectedCity.toLowerCase()))
        );
         this.destinationstatecity = true;
         this.filtrernom = false;
          this.filtrer = false;
          this.nonfilter=false;
        this.destinationFoundparcitystate = this.destinationlistparcitystate.length > 0;
        ;

        if (this.destinationlistparcitystate.length === 0) {
          this.filtrernom = false;
          this.filtrer = false;
          this.destinationstatecity = true;
          this.nonfilter=true;
        }
    }
    console.log('this.destinationFoundparcitystate', this.destinationFoundparcitystate);
    this.selectedCity="";
    this. selectedState="";
}
}

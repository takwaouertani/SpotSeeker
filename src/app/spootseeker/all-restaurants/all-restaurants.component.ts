import { Component } from '@angular/core';
import { Destination } from '../classes/destination';
import { DestinationService } from '../services/destination.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrl: './all-restaurants.component.css'
})
export class AllRestaurantsComponent {
  destinationlist: Destination[] = [];
  destinationCategorylist: Destination[] = [];
  filtrer=false
  nonfilter:boolean=false;
  adresse: string | undefined;
  description: string | undefined;
  category: string | undefined;
  menu: string | undefined;
  wifi_availibily: boolean | undefined;
  email_destination: string | undefined;
  destinaition_phone_number: number | undefined;
  facebook: string | undefined;
  instagram: string | undefined;
  website: string | undefined;
  rate:string | undefined
  images: string | undefined;
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
selectedType:string=''
priceRange!:string 

pricedestinations: Destination[] = [];
  constructor(private destinationservice: DestinationService, private router: Router) {}
  ngOnInit(): void {
    this.getdestination();
  }


  getdestination() {
    this.destinationservice.getdestination().subscribe(
      (res: any) => {
        this.destinationlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          if (data.category === 'restaurant') {
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
Destinationfiltree(): void {
  console.log('Selected Characteristics:');
  console.log('Credit Card:', this.credit_card);
  console.log('Parking Space:', this.parking_Space);
  console.log('Outdoor Space:', this.Outdoor_Space);
  console.log('Free Wifi:', this.Free_Wifi);
  console.log('Pet Friendly:', this.Pet_Friendly);
  console.log('Kid\'s Corner:', this.Kids_Corner);
  console.log('Reservation:', this.Reservation);
  console.log('Smoking Area:', this.smoking_area);
  console.log('Selected Cuisine:', this.selectedType);
  console.log('Price Range:', this.priceRange);
  let filteredList = this.destinationlist;
  if (this.selectedType) {
    filteredList = filteredList.filter(destination =>
      destination.type_destination && destination.type_destination.toLowerCase() === this.selectedType.toLowerCase()
    );
  }

  if (this.priceRange) {
    filteredList = filteredList.filter(destination => {
      const minPrice = destination.min_price !== undefined ? destination.min_price : 0;
      const maxPrice = destination.max_price !== undefined ? destination.max_price : Infinity;

      let inRange = false;

      if (this.priceRange === 'under_30dt') {
        inRange = maxPrice <= 30;
      } else if (this.priceRange === '30dt_70dt') {
        inRange = minPrice <= 70 && maxPrice >= 30;
      } else if (this.priceRange === '70dt_100dt') {
        inRange = minPrice <= 100 && maxPrice >= 70;
      } else if (this.priceRange === 'over_100dt') {
        inRange = minPrice > 100;
      }

      return inRange;
    });
  }
  filteredList = filteredList.filter(destination => {
    return (
      (!this.credit_card || destination.credit_card === true) &&
      (!this.parking_Space || destination.parking === true) &&
      (!this.Free_Wifi || destination.wifi_availibily === true) &&
      (!this.Pet_Friendly || destination.pet_friendly === true) &&
      (!this.Kids_Corner || destination.kids_corner === true) &&
      (!this.Reservation || destination.reservation === true) &&
      (!this.smoking_area || destination.smoking_area === true)
    );
  });
  console.log('Filtered Destination List:', filteredList);
  this.destinationCategorylist = filteredList;
  this.filtrer = true;
  this.filtrernom = false;
  this.destinationstatecity = false;
  this.nonfilter = filteredList.length === 0;
  this.resetFilters();
}

resetFilters(): void {
  this.Scenic_Picnic_Spot = false;
  this.credit_card = false;
  this.parking_Space = false;
  this.Outdoor_Space = false;
  this.Free_Wifi = false;
  this.Pet_Friendly = false;
  this.Kids_Corner = false;
  this.smoking_area = false;
  this.Reservation = false;
  this.selectedType = '';
  this.priceRange = '';
  this.selectedState = ''; 
  this.selectedCity = '';
}

Destinationfiltreeparnom(): void {
  if (this.searchTerm.trim() === '') {
      this.destinationparnomlist = this.destinationlist;
  } else {
      this.destinationparnomlist = this.destinationlist.filter(destination =>
          destination.name_destination.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

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

  const selectedState = this.selectedState.trim().toLowerCase();
  const selectedCity = this.selectedCity.trim().toLowerCase();

  if (selectedState === '') {
      this.destinationlistparcitystate = this.destinationlist;
  } else if (selectedCity === '') {
      this.destinationlistparcitystate = this.destinationlist.filter(destination => {
          console.log("Checking destination:", destination);
          return destination.state && destination.state.toLowerCase().includes(selectedState);
      });
  } else {
      this.destinationlistparcitystate = this.destinationlist.filter(destination => {
          console.log("Checking destination:", destination);
          return destination.state && destination.state.toLowerCase().includes(selectedState) &&
                 destination.city && destination.city.toLowerCase().includes(selectedCity);
      });
  }
  this.destinationFoundparcitystate = this.destinationlistparcitystate.length > 0;
  this.destinationstatecity = true;
  this.filtrernom = false;
  this.filtrer = !this.destinationFoundparcitystate;
  this.nonfilter = this.filtrer;
  if (!this.destinationFoundparcitystate) {
      console.warn("No destinations found for the selected state and city.");
      this.filtrernom = false;
      this.filtrer = true;
      this.nonfilter = true;
      this.destinationstatecity = true;
      console.log('filtrer',this.filtrer);
      console.log('nonfilter',this.nonfilter);
      console.log('destinationstatecity',this.destinationstatecity);

  }
  this.resetFilters();
  console.log('Filtered destinations:', this.destinationlistparcitystate);
  console.log('Destination found:', this.destinationFoundparcitystate);
}

  
  

}



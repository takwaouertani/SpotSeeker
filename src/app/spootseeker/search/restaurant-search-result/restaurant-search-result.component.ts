import { Component } from '@angular/core';
import { Destination } from '../../classes/destination';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-restaurant-search-result',
  templateUrl: './restaurant-search-result.component.html',
  styleUrl: './restaurant-search-result.component.css'
})
export class RestaurantSearchResultComponent {
  filteredDestinations: Destination[] = [];
  destinationlist: Destination[] = [];
  destinationCategorylist: Destination[] = [];
  filtrer=false
  nonfilter:boolean=false;
  adresse!: string ;
  description!: string ;
  category!: string ;
  menu!: string ;
  wifi_availibily!: boolean ;
  email_destination!: string ;
  destinaition_phone_number!: number ;
  facebook!: string ;
  instagram!: string ;
  website!: string ;
  rate!:string; 
  images!: string;
  destinationparnomlist: Destination[] = [];
  filtrernom:boolean=false;
  searchTerm: string = ''; 
city: string='';
state: string='';
destinationlistparcitystate: Destination[] = [];

selectedState: string = ''; 
selectedCity: string = '';
cities: string[] = [];
  credit_card: any;
  parking_Space: any;

  Pet_Friendly: any;
  Kids_Corner: any;
  Reservation: any;
  smoking_area: any;
  selectedReview: any;
  priceRange: string='' ;
  selectedCuisine: any;
  selectedCategory:any;
constructor(private route: ActivatedRoute,private destinationservice: DestinationService, private router: Router) {}

ngOnInit(): void {
  this.route.queryParams.subscribe((params: { [key: string]: any }) => {
    if (params['filteredDestinations']) {
      this.filteredDestinations = JSON.parse(params['filteredDestinations']);
      console.log('Filtered Destinations:', this.filteredDestinations);
      if(this.filteredDestinations.length==0){
        this.nonfilter=true;
        this.filtrerecherche1=true;
        this.filtrerecherche2=false;
        this.filtrerecherche3=false;
    
      }
    }
    
  });


  this.getdestination();




}
currentIndex: { [key: string]: number } = {};

nextSlide(destination: any) {
    if (!this.currentIndex.hasOwnProperty(destination.id_destination)) {
        this.currentIndex[destination.id_destination] = 0;
    }
    this.currentIndex[destination.id_destination] = (this.currentIndex[destination.id_destination] + 1) % destination.images.length;
}

navigateToDetails(destinationId: string) {
  this.router.navigate(['/place', destinationId]);
}

prevSlide(destination: any) {
    if (!this.currentIndex.hasOwnProperty(destination.id_destination)) {
        this.currentIndex[destination.id_destination] = 0;
    }
    this.currentIndex[destination.id_destination] = (this.currentIndex[destination.id_destination] - 1 + destination.images.length) % destination.images.length;
}




  getdestination() {
    this.destinationservice.getdestination().subscribe(
      (res: any) => {
        this.destinationlist = res.map((e: any) => {
          const data = e.payload.doc.data();
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
        });
      },
      err => {
        console.error('Error fetching destinations:', err);
      }
    );
  }
filtrerecherche1:boolean=true;
filtrerecherche2:boolean=false;
filtrerecherche3:boolean=false;
Destinationfiltree(): void {
  
  this.destinationCategorylist = this.destinationlist.filter(destination => {
    return (
      (!this.credit_card || destination.credit_card) &&
      (!this.parking_Space || destination.parking) &&
      (!this.wifi_availibily|| destination.wifi_availibily) &&
      (!this.Pet_Friendly || destination.pet_friendly) &&
      (!this.Kids_Corner || destination.kids_corner) &&
      (!this.Reservation || destination.reservation) &&
      (!this.smoking_area || destination.smoking_area)
    );
  });

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
  if(this.selectedCategory){
    this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
      return destination.category.toLowerCase() === this.selectedCategory.toLowerCase();
    });
}

  if (this.selectedCuisine) {
    this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
      return destination.type_destination.toLowerCase() === this.selectedCuisine.toLowerCase();
    });
  }

  if (this.selectedReview) {
    this.destinationCategorylist = this.destinationCategorylist.filter(destination => {
      return destination.rate === this.selectedReview;
    });
  }

  this.filtrerecherche1 = false;
  this.filtrerecherche2 = true;
  this.nonfilter = false;
  this.filtrerecherche3 = false;
  console.log('filtrerecherche1', this.filtrerecherche1);
  console.log('filtrerecherche2', this.filtrerecherche2);
  console.log('filtrerecherche3', this.filtrerecherche3);
  console.log('nonfilter', this.nonfilter);
  console.log('Filtered Destination List:', this.destinationCategorylist);

  if (this.destinationCategorylist.length === 0) {
    this.nonfilter = true;
    this.filtrerecherche1 = false;
    this.filtrerecherche2 = true;
    this.filtrerecherche3 = false;
  }
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
      this.filtrerecherche1 = false;
      this.filtrerecherche2 = false;
      this.nonfilter = false;
      this.filtrerecherche3 = true;
      console.log('this.destinationlistparcitystate', this.destinationlistparcitystate);
  }

  if (this.destinationlistparcitystate.length == 0) {
      this.nonfilter = true;
      this.filtrerecherche1 = false;
      this.filtrerecherche2 = false;
      this.filtrerecherche3 = true;
  }
}

}

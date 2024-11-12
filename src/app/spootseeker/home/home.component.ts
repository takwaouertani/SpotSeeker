import { Component, OnInit } from '@angular/core';
import { Destination } from '../classes/destination';
import { DestinationService } from '../services/destination.service';
import { Router } from '@angular/router';
import { CommentsService } from '../services/comments.service';
import { Comments } from '../classes/comments';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  destinationlist: Destination[] = [];
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
  rate!: string ;
  images!: string ;
  destinationparnomlist: Destination[] = [];
  filtrernom: boolean = false;
  city: string = '';
  state: string = '';
  destinationlistparcitystate: Destination[] = [];
  destinationFoundparcitystate: boolean = false;
  selectedState: string = '';
  selectedCity: string = '';
  cities: string[] = [];
  parking_Space: any;
  credit_card: any;

  commentslist:Comments[]=[];
  mostRatedDestinations: Destination[] = [];
  constructor(private destinationservice: DestinationService, private router: Router,private commentsService: CommentsService) { }
  ngOnInit(): void {
    this.getDestinations();
    console.log("Initial commentslist:", this.commentslist); 
    this.commentsService.getcomment().subscribe(comments => {
      this.commentslist = comments.map(comment => comment.payload.doc.data() as Comments);
      console.log("les commentaires", this.commentslist); 
      this.updateMostRatedDestinations();
      console.log("this.mostRatedDestinations",this.mostRatedDestinations)

    });
  }
  updateMostRatedDestinations(): void {
    const destinationRatings: { destination: Destination; averageRate: number; }[] = []; 

    this.destinationlist.forEach(destination => {
      let totalRates = 0; 
      const destinationComments = this.commentslist.filter(comment => comment.id_destination === destination.id_destination);
      if (destinationComments.length > 0) {
        destinationComments.forEach(comment => {
          totalRates += comment.rates;
        });
        const averageRate = totalRates / destinationComments.length;
        destinationRatings.push({ destination, averageRate }); 
      }
    });

    destinationRatings.sort((a, b) => b.averageRate - a.averageRate);

    this.mostRatedDestinations = destinationRatings.slice(0, 6).map(item => item.destination);

    console.log("mostRatedDestinations", this.mostRatedDestinations);
  }

  getDestinations() {
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
        console.log('restaurant_search_result',this.destinationlist)
      },
      err => {
        console.error('Error fetching destinations:', err);
      }
    );
  }
  selectedCategory: string = '';

  filters = {
    wifi: false,
    reservation: false,
    smokingPlace: false,
    outdoorPlace: false,
    petFriendly: false,
    kidsCorner: false,
    parking_Space:false,
    credit_card:false,
    selectedState:'',
    selectedCity:''
    
  };

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  filteredDestinations:Destination[]=[];
  // applyFilters() {
  //   console.log('Destination list before filtering:', this.destinationlist);
  //   const filteredDestinations = this.destinationlist.filter(destination => {
  //     return (!this.selectedState || destination.state?.toLowerCase() === this.selectedState.toLowerCase()) &&
  //       (!this.selectedCity || destination.city?.toLowerCase() === this.selectedCity.toLowerCase()) &&
  //       (!this.filters.wifi || destination.wifi_availibily === this.filters.wifi) &&
  //       (!this.filters.reservation || destination.reservation === this.filters.reservation) &&
  //       (!this.filters.smokingPlace || destination.smoking_area === this.filters.smokingPlace) &&
  //       (!this.filters.petFriendly || destination.pet_friendly === this.filters.petFriendly) &&
  //       (!this.selectedCategory || destination.category?.toLowerCase() === this.selectedCategory.toLowerCase()) &&
  //       (!this.filters.kidsCorner || destination.kids_corner === this.filters.kidsCorner);
  //   });

  //   console.log('Filtered destinations after filtering:', filteredDestinations);
  //   this.router.navigate(['/restaurant_search_result'], { queryParams: { filteredDestinations: JSON.stringify(filteredDestinations) } });
  // }
  



  applyFilters(): void {
    this.filteredDestinations = this.destinationlist.filter(destination => {
      return (
        (!this.filters.credit_card || destination.credit_card) &&
        (!this.filters.parking_Space || destination.parking) &&
        (!this.filters.wifi || destination.wifi_availibily) &&
        (!this.filters.petFriendly || destination.pet_friendly) &&
        (!this.filters.kidsCorner || destination.kids_corner) &&
        (!this.filters.reservation || destination.reservation) &&
        (!this.filters.smokingPlace || destination.smoking_area) 
        // (!this.filters.selectedState || destination.state === this.filters.selectedState) &&
        // (!this.filters.selectedCity || destination.city === this.filters.selectedCity) &&
        // (!this.selectedCategory || destination.category?.toLowerCase() === this.selectedCategory.toLowerCase())
      );
    });

     if (this.filters.selectedState) {
      this.filteredDestinations = this.filteredDestinations.filter(destination => {
        return destination.state.toLowerCase() === this.filters.selectedState.toLowerCase() && destination.city.toLowerCase() === this.filters.selectedCity.toLowerCase();
      });
    }

    if (this.selectedCategory) {
      this.filteredDestinations = this.filteredDestinations.filter(destination => {
        return destination.category.toLowerCase() === this.selectedCategory.toLowerCase() ;
      });
    }
  
    console.log('Filtered Destination List:', this.filteredDestinations);
    this.router.navigate(['/restaurant_search_result'], { queryParams: { filteredDestinations: JSON.stringify(this.filteredDestinations) } });
  }
  
  
  

  resetFilters() {
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCategory = '';
    this.cities = [];
    this.filters = {
      wifi: false,
      reservation: false,
      smokingPlace: false,
      outdoorPlace: false,
      petFriendly: false,
      kidsCorner: false,
      parking_Space:false,
      credit_card:false,
      selectedState:'',
      selectedCity:''

    };
  }


  navigateToDetails(destinationId: string) {
    this.router.navigate(['/place', destinationId]);
  }


  currentSlide = 0;
  translateX = 0;
  
  
  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.translateX += this.getSlideWidth();
    }
  }
  
  nextSlide(): void {
    if (this.currentSlide < this.mostRatedDestinations.length / 3 - 1) {
      this.currentSlide++;
      this.translateX -= this.getSlideWidth();
    }
  }
  
  getSlideWidth(): number {
    const containerWidth = document.querySelector('.carousel-wrapper')?.clientWidth || 0;
    return containerWidth / 3;
  }










  openModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = "block";
    }
  }
  
  closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = "none";
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


  isPopupVisible2: boolean = false;
  openPopup2() {
    this.isPopupVisible2 = true;
  }

  closePopup2() {
    this.isPopupVisible2 = false;
  }
}

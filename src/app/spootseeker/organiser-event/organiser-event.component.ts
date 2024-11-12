import { Component, ElementRef } from '@angular/core';
import { Events } from '../classes/events';
import { Time } from '@angular/common';
import { OrganiserRequestsService } from '../services/organiser-requests.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-organiser-event',
  templateUrl: './organiser-event.component.html',
  styleUrl: './organiser-event.component.css'
})
export class OrganiserEventComponent {
  currentStep: number = 1;
  steps: any[] = [
    { iconClass: 'fa-regular fa-user' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' }, 
    { iconClass: 'fa-sharp fa-solid fa-check-circle' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } ,
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } 
  ];

  selectedCategory: string = ''; 
  selectedType:string=''

  // Method to select a category
  selectCategory(cat: string) {
    this.category = cat;
    this.type_event='';
  }
  selecttype(type: string) {
    this.selectedType = type;
    console.log('Selected Type:', this.selectedType); 

  }

  isCategorySelected(cat: string): boolean {
    return this.category === cat;
  }
  isTypeSelected(type: string): boolean {
    return this.type_event === type;
  }

  private scrollContainerToTop() {
    const scrollContainer = this.elRef.nativeElement.querySelector('.scrollable-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }
  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.scrollContainerToTop();
    }
    
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollContainerToTop();
    }
  }
  updateValue(event: Event, span: HTMLSpanElement) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    const adjustedValue = Math.round(value / 5) * 5;
    span.textContent = adjustedValue.toString();
  }
  isPopupVisible2: boolean = false;
  openPopup2() {
    this.isPopupVisible2 = true;
  }
  closePopup2() {
    this.isPopupVisible2 = false;
  }


  eventlist:Events[]=[];

  d:Date=new Date;

eventobj: Events = {
  id_event: '',
  name_event: '',
  adresse: '',
  description: '',
  category: '',
  type_event: '',
  date_debut: this.d,
  date_fin: this.d,
  heure_debut: { hours: 0, minutes: 0 },
  heure_fin: { hours: 0, minutes: 0 },
  prix: 0,
  Dress_Code: '',
  access_vip: false,
  facebook: '',
  instagram: '',
  website: '',
  Capacity: 0,
  email_events: '',
  images: [],
  organiserdata: [],
  event_phone_number: 0,
  free_tickets: false,
  state: '',
  city: ''
};
step: number = 1;

 

id_event:string='';
name_event : string='';
   adresse:string='';
   description:string='';
   category:string='';
   type_event:string='';
   date_debut:Date=this.d;
   date_fin:Date=this.d;
   heure_debut:Time={
    hours: 0,
    minutes: 0
   };
   heure_fin:Time={
    hours: 0,
    minutes: 0
   };
   prix:number=0;
   Dress_Code:string="";
   access_vip:boolean=false;
   free_tickets:boolean=false;

   facebook:string="";
   instagram:string="";
   website:string='';
   Capacity:number=0;
   email_events:string='';
   images:string='';
   event_phone_number:number=0;
   organiserdata: { first_name: string, last_name: string, email: string, Phone_number: number }[] = [{ first_name: '', last_name: '', email: '', Phone_number: 0 }];
   eventImages: FileList | null = null; // Property to hold the selected event images

   onEventImagesSelected(event: any) {
    this.eventImages = event.target.files; // Set the selected event images
  }
 
  


  constructor(private organiserrequestservice:OrganiserRequestsService,  private elRef: ElementRef ,
    private router: Router, private firestorage:AngularFireStorage
     ){}
  ngOnInit(): void {
    this.getorganiserrequest();
  }
  // to get an organiser request

  getorganiserrequest() {
    this.organiserrequestservice.getorganiser_request().subscribe(
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
            date_debut: data.date_debut,
            date_fin: data.date_fin,
            heure_debut: data.heure_debut,
            heure_fin: data.heure_fin,
            prix: data.prix,
            Dress_Code:data.Dress_Code,
            access_vip:data.access_vip,
            facebook: data.facebook,
            instagram: data.instagram,
            website: data.website,
            Capacity:data.Capacity,
            email_events:data.email_events,
            images:data.images|| [],
            event_phone_number:data.event_phone_number,
            organiserdata: data.organiserdata || []
          };
        });
      },
      err => {
        
        console.error('Error fetching events:', err);
      }
    );
  }
// to add an organiser event
async addorganiser_request() {
    const dynamicRowsData = this.organiserdata.map(row => ({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      Phone_number: row.Phone_number,
      
    }));
    const eventImagesURLs: string[] = [];
    if (this.eventImages) {
      for (let i = 0; i < this.eventImages.length; i++) {
        const imageURL = URL.createObjectURL(this.eventImages[i]);
        eventImagesURLs.push(imageURL);
      }
    }
    const eventobj: Events = {
      id_event: '',
      name_event: this.name_event,
      adresse: this.adresse,
      description: this.description,
      category: this.category,
      type_event: this.selectedType,
      date_debut: this.date_debut,
      date_fin: this.date_fin,
      heure_debut: this.heure_debut,
      heure_fin: this.heure_fin,
      prix: this.prix,
      Dress_Code: this.Dress_Code,
      access_vip: this.access_vip,
      free_tickets: this.free_tickets,

      facebook: this.facebook,
      instagram: this.instagram,
      website: this.website,
      Capacity: this.Capacity,
      email_events: this.email_events,
      images: this.eventImagesURLs,
      event_phone_number: this.event_phone_number,
      organiserdata: dynamicRowsData,
      state: '',
      city: ''
    };
  
    this.organiserrequestservice.addorganiser_request(eventobj).then(() => {
      console.log('Event added successfully!');
      this.currentStep=5;

    }).catch(error => {
       console.log('Error adding the event', error);
    });
  }
  

deleteorganiserrequest(organiser_request:Events){
  if(window.confirm('are you sure that you want to delete this event? '))
  this.organiserrequestservice.deleteorganiser_request(organiser_request);
}
selectedState: string = '';
cities: string[] = [];



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

// Function to display cities based on selected state
displayCities() {
  this.cities = this.citiesByState[this.selectedState] || [];
}
getStates(): string[] {
  return Object.keys(this.citiesByState);
}

//for the event poster





//for the types
showOptionInput = false;
  newOption = '';
  options: string[] = [];

  async onfilechange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `yt/${Date.now()}_${file.name}`;
        const uploadTask = await this.firestorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        this.eventImagesURLs.push(url); // Store the URL in the array
      }
    }
  }

  addOptionInput() {
    this.showOptionInput = !this.showOptionInput;
  }

  toggleOptionInput() {
    this.showOptionInput = !this.showOptionInput;
  }
  addOption() {
    console.log('Adding option:', this.newOption);

    if (this.newOption.trim() !== '' && !this.options.includes(this.newOption)) {
      this.options.push(this.newOption.trim()); 
      this.newOption = ''; 
      this.showOptionInput = false;
    }else {
      console.log('Option is empty or already included in options array.');
  }
  }



  
eventImagesURLs: string[] = []; // URLs of menu images uploaded to Firebase
uploadedImages: { file: File, url: string }[] = []; // Menu images with their URLs

onFileSelected(event: any) {
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);
    this.uploadedImages.push({ file, url });
  }
  this.uploadFilesToFirebase(files, this.uploadedImages, this.eventImagesURLs);
}


async uploadFilesToFirebase(files: FileList, uploadedImages: { file: File, url: string }[], eventImagesURLs: string[]) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `event/${Date.now()}_${file.name}`;
    const uploadTask = await this.firestorage.upload(path, file);
    const url = await uploadTask.ref.getDownloadURL();
    eventImagesURLs.push(url);
  }
}
selectedCity: string = '';



removeImage(index: number) {
  this.uploadedImages.splice(index, 1); 
} 

}

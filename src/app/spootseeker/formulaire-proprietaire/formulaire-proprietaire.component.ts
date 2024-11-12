import { Time } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { Destination } from '../classes/destination';
import { OwnersRequestsService } from '../services/owners-requests.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formulaire-proprietaire',
  templateUrl: './formulaire-proprietaire.component.html',
  styleUrl: './formulaire-proprietaire.component.css'
})
export class FormulaireProprietaireComponent {
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
  form!:any;

  // Method to select a category
  selectCategory(cat: string) {
    this.category = cat;
    this.type_destination='';
    console.log(this.category);
  }

  isCategorySelected(cat: string): boolean {
    return this.category === cat;

  }

  selecttype(type: string) {
    this.selectedType = type;
    console.log('Selected Type:', this.selectedType); 

  }
  isTypeSelected(type: string): boolean {
    return this.type_destination === type;
  }



  showOptionInput = false;
  newOption = '';
  options: string[] = [];
  addOptionInput() {
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

  
  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

minValue: number = 0;
maxValue: number = 400;
currentRange: number = 100;
isMaxVisible: boolean = true;

updateMinValue(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  
  // Prevent minValue from exceeding maxValue
  if (value > this.maxValue - 5) {
    this.minValue = this.maxValue - 5;
  } else {
    this.minValue = value;
  }

  this.updateVisibility();
  this.updateCurrentRange();
}

updateMaxValue(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);

  // Prevent maxValue from being less than minValue
  if (value < this.minValue + 5) {
    this.maxValue = this.minValue + 5;
  } else {
    this.maxValue = value;
  }

  this.updateVisibility();
  this.updateCurrentRange();
}

updateVisibility() {
  // Set visibility based on the distance between min and max values
  this.isMaxVisible = this.maxValue > this.minValue + 5;
}

updateCurrentRange() {
  this.currentRange = (this.minValue + this.maxValue) / 2;
}

removeImage(index: number) {
  this.uploadedImages.splice(index, 1);
}

removeImage2(index: number) {
  this.uploadedImages2.splice(index, 1);
}

  constructor(private owner_destination:OwnersRequestsService,  private elRef: ElementRef ,private firestorage:AngularFireStorage
    , private router: Router,private fb: FormBuilder
      ){this.form = this.fb.group({
       selectedState: [''],
       selectedCity: ['']
     });}
  destinationlist:Destination[]=[];


  destinationobj: Destination = {
    id_destination: '',
    name_destination: '',
    adresse: '',
    description: '',
    category: '',
    type_destination: '',
    menu: [],
    smoking_area: false,
    wifi_availibily: false,
    pet_friendly: false,
    kids_corner: false,
    parking: false,
    credit_card: false,
    reservation: false,
    opening_hour: { hours: 0, minutes: 0 },
    closing_hour: { hours: 0, minutes: 0 },
    min_price: 0,
    max_price: 0,

    email_destination: '',
    destinaition_phone_number: 0,
    facebook: '',
    instagram: '',
    website: '',
    ownerdata: [],
    city: '',
    state: '',
    rate: '',
    images: []
  };
  step: number = 1;
  
   
  
  id_destination:string='';
     name_destination : string='';
     adresse:string='';
     description:string='';
     category:string='';
     type_destination:string='';
     menu:string='';
     smoking_area:boolean=false;
     wifi_availibily:boolean=false;
     pet_friendly:boolean=false;
     kids_corner:boolean=false;
     parking:boolean=false;
     credit_card:boolean=false;
     reservation:boolean=false;
     opening_hour:Time={
      hours: 0,
      minutes: 0
     };
     closing_hour:Time={
      hours: 0,
      minutes: 0
     };
  
     min_price:number=0;
     max_price:number=0;
state:string='';
city:string='';

selectedCity: string = '';

     email_destination:string='';
     destinaition_phone_number:number=0;
     facebook:string="";
     instagram:string="";
     website:string='';
   
     eventImages: FileList | null = null; 
     onEventImagesSelected(event: any) {
      this.eventImages = event.target.files; 
    }
// to add a destination
adddestination() {
  const dynamicRowsData = this.ownerdata.map(row => ({
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
  const destinationobj: Destination = {
    id_destination: '',
    name_destination: this.name_destination,
    adresse: this.adresse,
    description: this.description,
    category: this.category,
    type_destination: this.selectedType,
    
    menu: this.eventImagesURLs,
    smoking_area: this.smoking_area,
    wifi_availibily: this.wifi_availibily,
    pet_friendly: this.pet_friendly,
    kids_corner: this.kids_corner,
    parking: this.parking,
    credit_card: this.credit_card,
    reservation: this.reservation,
    opening_hour: this.opening_hour,
    closing_hour: this.closing_hour,
    min_price: this.min_price,
    max_price: this.max_price,

    email_destination: this.email_destination,
    destinaition_phone_number: this.destinaition_phone_number,
    facebook: this.facebook,
    instagram: this.instagram,
    website: this.website,
    ownerdata: dynamicRowsData,
    city: '',
    state: '',
    rate: '',
    images: this.eventImagesURLs2
  };

  this.owner_destination.addowner_request(destinationobj).then(() => {
      console.log('Destination added successfully!');
      this.currentStep=5;
}).catch(error => {
      // Check if the error is related to ownerdata
      if (error.message.includes('ownerdata')) {
          console.error('Error adding ownerdata:', error);
          alert('Failed to add ownerdata. Please check the provided data and try again.');
      } else {
          console.error('Error adding destination:', error);
          alert('Failed to add destination. Please try again.');
      }
  });
}

ownerdata: { first_name: string, last_name: string, email: string, Phone_number: number }[] = [{ first_name: '', last_name: '', email: '', Phone_number: 0 }];

eventImagesURLs: string[] = []; 
uploadedImages: { file: File, url: string }[] = []; 
uploadedImages2: { file: File, url: string }[] = [];

onFileSelected(event: any) {
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);
    this.uploadedImages.push({ file, url });
  }
  this.uploadFilesToFirebase(files, this.uploadedImages, this.eventImagesURLs);
}

onDestinationFileSelected(event: any) {
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);
    this.uploadedImages2.push({ file, url });
  }
  this.uploadFilesToFirebase2(files, this.uploadedImages2, this.eventImagesURLs2);
}

async uploadFilesToFirebase(files: FileList, uploadedImages: { file: File, url: string }[], eventImagesURLs: string[]) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `yt/${Date.now()}_${file.name}`;
    const uploadTask = await this.firestorage.upload(path, file);
    const url = await uploadTask.ref.getDownloadURL();
    eventImagesURLs.push(url);
  }
}

eventImagesURLs2: string[] = [];


async uploadFilesToFirebase2(files: FileList, uploadedImages2: { file: File, url: string }[], eventImagesURLs2: string[]) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `dest/${Date.now()}_${file.name}`;
    console.log("Uploading destination image:", file.name); 
    const uploadTask = await this.firestorage.upload(path, file);
    console.log("Upload task:", uploadTask); 
    const url = await uploadTask.ref.getDownloadURL();
    console.log("Download URL:", url); 
    eventImagesURLs2.push(url); 
    console.log("Event images URLs after push:", eventImagesURLs2); 
  }
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
  console.log("Selected state:", this.selectedState);
  console.log("Cities by state:", this.citiesByState[this.selectedState]);
  this.cities = this.citiesByState[this.selectedState] || [];
  console.log("Cities:", this.cities);
}




getStates(): string[] {
  return Object.keys(this.citiesByState);
}


}






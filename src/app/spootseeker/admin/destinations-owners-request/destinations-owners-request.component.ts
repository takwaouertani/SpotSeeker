import { Component, Input } from '@angular/core';
import { Destination } from '../../classes/destination';
import { Time } from '@angular/common';
import { OwnersRequestsService } from '../../services/owners-requests.service';
import { Router } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-destinations-owners-request',
  templateUrl: './destinations-owners-request.component.html',
  styleUrl: './destinations-owners-request.component.css'
})
export class DestinationsOwnersRequestComponent {
  currentStep: number = 1;
  steps: any[] = [
    { iconClass: 'fa-regular fa-user' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' }, 
    { iconClass: 'fa-sharp fa-solid fa-check-circle' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } ,
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } 
  ];
  searchText: any;
  minValue: number = 0;
  maxValue: number = 400;
  currentRange: number = 100;
  isMaxVisible: boolean = true;
  showOptionInput = false;
  newOption = '';
  options: string[] = [];
  isPopupVisible3: boolean = false;
  selectedCity: string = '';
  selectedState: string = '';
  form: FormGroup;
  cities: string[] = [];
  showform: boolean = false;
  showform2: boolean = false;
  @Input() googleMapsLink!: string;
  safeMapUrl!: SafeResourceUrl;
  eventImagesURLs: string[] = []; 
  eventImages: FileList | null = null; 
  uploadedImages: { file: File; url: string }[] = [];
  uploadedImages2: { file: File; url: string }[] = [];
  

 

  openPopup3() {
    this.isPopupVisible3 = true;
  }
  closePopup3() {
    this.isPopupVisible3 = false;
    this.clearForm();
    this.currentStep = 1;
  }


  ownerrequestlist:Destination[]=[];
  ownerrequesobj: Destination = {
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
  max_price:0,
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
   city:string='';
   state:string='';
   email_destination:string='';
   destinaition_phone_number:number=0;
   facebook:string="";
   instagram:string="";
   website:string='';
   images: string[] = []; 

   onEventImagesSelected(event: any) {
    this.eventImages = event.target.files; 
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

    if (this.selectedState && this.citiesByState[this.selectedState]) {
      this.cities = this.citiesByState[this.selectedState];
    } else {
      this.cities = []; 
    }

  }


  onStateChange() {
    const selectedState = this.form.get('selectedState')?.value; 
    
    this.cities = this.citiesByState[selectedState] || [];
  }
 
  getStates(): string[] {
    return Object.keys(this.citiesByState);
  }
  constructor(private ownerrequestservice:OwnersRequestsService,  
    private router: Router,private destinationservice:DestinationService,private fb: FormBuilder,private firestorage:AngularFireStorage
     ){this.form = this.fb.group({
      selectedState: [''],
      selectedCity: ['']
    });}


    async adddestination() {
      const dynamicRowsData = this.ownerdata.map(row => ({
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        email: row.email || '',
        Phone_number: row.Phone_number || 0,  // Provide a default number
      }));
      const uploadedImagesURLs = await this.uploadImagesToFirebase(this.uploadedImages2);

      const destinationobj: Destination = {
        id_destination: '',
        name_destination: this.name_destination || '',
        adresse: this.adresse || '',
        description: this.description || '',
        category: this.category || '',
        type_destination: this.type_destination || '',
        smoking_area: this.smoking_area || false,
        wifi_availibily: this.wifi_availibily || false,
        pet_friendly: this.pet_friendly || false,
        kids_corner: this.kids_corner || false,
        parking: this.parking || false,
        credit_card: this.credit_card || false,
        reservation: this.reservation || false,
        opening_hour: this.opening_hour || '',
        closing_hour: this.closing_hour || '',
        min_price: this.min_price || 0,
        max_price: this.max_price || 0, 
        email_destination: this.email_destination || '',
        facebook: this.facebook || '',
        instagram: this.instagram || '',
        website: this.website || '',
        ownerdata: dynamicRowsData,

        images: uploadedImagesURLs,
        city: this.city|| '',
        state: this.state|| '',
        menu: [],
        destinaition_phone_number: 0,
        rate: ''
      };
    
      console.log(destinationobj); 
    
      this.destinationservice.adddestination(destinationobj).then(() => {
        alert('Destination added successfully!');
        this.clearForm();
      }).catch(error => {
        console.error('Error adding destination:', error);
        alert('Failed to add destination. Please check the provided data and try again.');
      });
    }
    




  ngOnInit(): void {
    this.getownerrequest();
    
  }


  // to get an ownerrequest
  getownerrequest() {
    this.ownerrequestservice.getowner_request().subscribe(
      (res: any) => {
        this.ownerrequestlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            id_destination: e.payload.doc.id,
            name_destination: data.name_destination,
            adresse: data.adresse,
            description: data.description,
            category: data.category,
            type_destination: data.type_destination,
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
            min_price: data.min_price,
            max_price: data.max_rice,
            email_destination: data.email_destination,
            destination_phone_number: data.destination_phone_number,
            facebook: data.facebook,
            instagram: data.instagram,
            website: data.website,
            ownerdata: data.ownerdata || []
          };
        });
      },
      err => {
        console.error('Error fetching destinations:', err);
      }
    );
  }

// to add an owner request
  addownerrequest() {
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

    const ownerrequestobj: Destination = {
      id_destination: '',
      name_destination: this.name_destination,
      adresse: this.adresse,
      description: this.description,
      category: this.category,
      type_destination: this.type_destination,
      menu: eventImagesURLs,
      smoking_area: this.smoking_area,
      wifi_availibily: this.wifi_availibily,
      pet_friendly: this.pet_friendly,
      kids_corner: this.kids_corner,
      parking: this.parking,
      credit_card: this.credit_card,
      reservation: this.reservation,
      opening_hour: this.opening_hour,
      closing_hour: this.closing_hour,
      min_price: this.minValue,
      max_price:this.maxValue,

      email_destination: this.email_destination,
      destinaition_phone_number: this.destinaition_phone_number,
      facebook: this.facebook,
      instagram: this.instagram,
      website: this.website,
      ownerdata: dynamicRowsData,
      city: this.city,
      state: this.state,
      rate: '',
      images: []
    };
  
    this.ownerrequestservice.addowner_request(ownerrequestobj).then(() => {
        alert('owner request added successfully!');
        this.closePopup2();
        this.clearForm();

    }).catch(error => {
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







  // to delete an owner request
deleteownerrequest(destination:Destination){
  if(window.confirm('are you sure that you want to delete this owner request? '))
  this.ownerrequestservice.deleteowner_request(destination);
}

//to update an owner request
updateownerrequest() {
  const dynamicRowsData = this.ownerdata.map(row => ({
    first_name: row.first_name || '',
    last_name: row.last_name || '',
    email: row.email || '',
    Phone_number: Number(row.Phone_number) || 0 
  }));

  const fetchPromises: Promise<Blob | null>[] = []; 
  const eventImagesURLs: string[] = []; 
  if (this.menu && this.menu.length > 0) {
    for (let i = 0; i < this.menu.length; i++) {
      const fetchPromise = fetch(this.menu[i] as string) 
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); 
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          return null; 
        });

      fetchPromises.push(fetchPromise); 
    }
  }

  Promise.all(fetchPromises)
    .then(blobs => {
      for (const blob of blobs) {
        if (blob) {
          const imageURL = URL.createObjectURL(blob); 
          eventImagesURLs.push(imageURL);
        }
      }

      const updateownerdestination: Destination = {
        id_destination: this.id_destination || '',
        name_destination: this.name_destination || '',
        adresse: this.adresse || '',
        description: this.description || '',
        category: this.category || '',
        type_destination: this.type_destination || '',
        menu: eventImagesURLs,
        smoking_area: this.smoking_area ?? false,
        wifi_availibily: this.wifi_availibily ?? false,
        pet_friendly: this.pet_friendly ?? false,
        kids_corner: this.kids_corner ?? false,
        parking: this.parking ?? false,
        credit_card: this.credit_card ?? false,
        reservation: this.reservation ?? false,
        opening_hour: this.opening_hour || '',
        closing_hour: this.closing_hour || '',
        min_price: this.minValue || 0,
        max_price:  this.maxValue || 0,
        email_destination: this.email_destination || '',
        destinaition_phone_number: Number(this.destinaition_phone_number) || 0, 
        facebook: this.facebook || '',
        instagram: this.instagram || '',
        website: this.website || '',
        ownerdata: dynamicRowsData.length > 0 ? dynamicRowsData : [],
        images: [],
        city: this.city,
        state: this.city,
        rate: ''
      };

      return this.ownerrequestservice.updateowner_request(updateownerdestination);
    })
    .then(() => {
      alert('Owner request updated successfully');
      this.closePopup3();

    })
    .catch(error => {
      console.error('Error updating owner request:', error);
      alert('Failed to update owner request. Please check the console for more details.');
    });
}

  toggleForm() {
    this.showform = !this.showform;
  }
  toggleForm2() {
    this.showform2 = !this.showform2;
  }
  updateForm(destination: Destination) {
    this.id_destination = destination.id_destination || '';
    this.name_destination = destination.name_destination || '';
    this.adresse = destination.adresse || '';
    this.description = destination.description || '';
    this.category = destination.category || '';
    this.type_destination = destination.type_destination || '';
    this.menu = Array.isArray(destination.menu) ? destination.menu.join(', ') : destination.menu || '';
    this.smoking_area = destination.smoking_area ?? false;
    this.wifi_availibily = destination.wifi_availibily ?? false;
    this.pet_friendly = destination.pet_friendly ?? false;
    this.kids_corner = destination.kids_corner ?? false;
    this.parking = destination.parking ?? false;
    this.credit_card = destination.credit_card ?? false;
    this.reservation = destination.reservation ?? false;
    this.opening_hour = destination.opening_hour || '';
    this.closing_hour = destination.closing_hour || '';
    this.facebook = destination.facebook || '';
    this.instagram = destination.instagram || '';
    this.min_price = destination.min_price || 0;
    this.max_price = destination.max_price || 0;
    this.email_destination = destination.email_destination || '';
    this.destinaition_phone_number = destination.destinaition_phone_number || 0;
    this.ownerdata = destination.ownerdata || [{ first_name: '', last_name: '', email: '', Phone_number: '' }];
    this.city=destination.city||'';
    this.state=destination.state||''; 

  this.uploadedImages = []; 
  this.uploadedImages2 = []; 

  if (destination.menu) {
    this.uploadedImages = destination.menu.map(url => ({
      file: null as unknown as File, 
      url
    }));
  }

  if (destination.images) {
    this.uploadedImages2 = destination.images.map(url => ({
      file: null as unknown as File, 
      url
    }));
  }

    this.openPopup3();
  }
  


onFileSelected(event: any) {
  const files: FileList = event.target.files;
  
  this.uploadedImages = []; 

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);  
    
    this.uploadedImages.push({ file, url });
  }

  this.uploadFilesToFirebase(this.uploadedImages, this.eventImagesURLs);
}

deleteImage(index: number) {
  URL.revokeObjectURL(this.uploadedImages[index].url); 
  this.uploadedImages.splice(index, 1); 
}



onDestinationFileSelected(event: any) {
  const files: FileList = event.target.files;
  
  this.uploadedImages2 = []; 

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file); // Create a URL for the selected file
    
    this.uploadedImages2.push({ file, url });
  }

  this.uploadFilesToFirebase2(this.uploadedImages2);
}


eventImagesURLs2: string[] = [];


async uploadFilesToFirebase(uploadedImages: { file: File; url: string }[], eventImagesURLs: string[]) {
  eventImagesURLs.length = 0; // Clear previous URLs

  for (const image of uploadedImages) {
    const file = image.file;
    const path = `yt/${Date.now()}_${file.name}`;
    try {
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      eventImagesURLs.push(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}


async uploadFilesToFirebase2(uploadedImages2: { file: File; url: string }[]) {
  this.eventImagesURLs2.length = 0; // Clear previous URLs

  for (const image of uploadedImages2) {
    const file = image.file;
    const path = `dest/${Date.now()}_${file.name}`;
    try {
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.eventImagesURLs2.push(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}
uploadedDestinationImages: { file: File; url: string }[] = [];
uploadedMenuImages: { file: File; url: string }[] = [];

async uploadImagesToFirebase(images: { file: File; url: string }[]): Promise<string[]> {
  const imageUrls: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const file = images[i].file;
    const path = `dest/${Date.now()}_${file.name}`;

    try {
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      imageUrls.push(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  return imageUrls;
}

removeImageMenu(index: number) {
  this.uploadedImages.splice(index, 1);

}

removeImagedestination(index: number) {
  this.uploadedImages2.splice(index, 1);

}

updateMinValue(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  
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

  if (value < this.minValue + 5) {
    this.maxValue = this.minValue + 5;
  } else {
    this.maxValue = value;
  }

  this.updateVisibility();
  this.updateCurrentRange();
}
updateVisibility() {
  this.isMaxVisible = this.maxValue > this.minValue + 5;
}

updateCurrentRange() {
  this.currentRange = (this.minValue + this.maxValue) / 2;
}

// to clear the form 
clearForm() {
  this.name_destination = '';
  this.adresse = '';
  this.description = '';
  this.category = '';
  this.type_destination = '';
  
  this.eventImagesURLs2 = [];
  this.smoking_area = false;
  this.wifi_availibily = false;
  this.pet_friendly = false;
  this.kids_corner = false;
  this.parking = false;
  this.credit_card = false;
  this.reservation = false;
  this.opening_hour = {
    hours: 0,
    minutes: 0
  };

  this.closing_hour = {
    hours: 0,
    minutes: 0
  };
  this.min_price = this.minValue;
  this.max_price = this.maxValue;
  this.email_destination = '';
  this.destinaition_phone_number = 0;
  this.facebook = '';
  this.instagram = '';
  this.website = '';
  this.ownerdata = [{
    first_name: '',
    last_name: '',
    email: '',
    Phone_number: 0
  }];
  this.city = '';
  this.state = '';
  this.eventImagesURLs2 = [];
  this.currentStep = 1;

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
  this.currentStep = 1;
}
selectCategory(cat: string) {
  this.category = cat;
}

isCategorySelected(cat: string): boolean {
  return this.category === cat;
}

selecttype(type: string) {
  this.type_destination = type;
}

istypeSelected(type: string): boolean {
  return this.type_destination === type;
}
addOptionInput() {
  this.showOptionInput = !this.showOptionInput;
}

addOption() {
  if (this.newOption.trim() !== '') {
    this.options.push(this.newOption);
    this.newOption = ''; 
  }
}
selectdtype(option: string) {
  this.type_destination = option;
}
}

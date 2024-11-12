import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Destination } from '../../classes/destination';
import { Time } from '@angular/common';
import { DestinationService } from '../../services/destination.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-destinations-management',
  templateUrl: './destinations-management.component.html',
  styleUrl: './destinations-management.component.css'
})
export class DestinationsManagementComponent implements OnInit{
  currentStep: number = 1;
  steps: any[] = [
    { iconClass: 'fa-regular fa-user' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' }, 
    { iconClass: 'fa-sharp fa-solid fa-check-circle' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } ,
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } 
  ];
  constructor(private destinationservice:DestinationService,  private firestorage:AngularFireStorage
    ,private router: Router,private fb: FormBuilder,private sanitizer: DomSanitizer
     ){ this.form = this.fb.group({
      selectedState: [''],
      selectedCity: ['']
    });}
  @Input() googleMapsLink!: string;
  safeMapUrl!: SafeResourceUrl;
  searchText: any;
  isPopupVisible3: boolean = false;
  isPopupVisible2: boolean = false;
  step: number = 1;
  cities: string[] = [];
  selectedCity: string = '';
  selectedState: string = '';
  selectedCategory: string = ''; 
  showOptionInput = false;
  newOption = '';
  showform: boolean = false;
  showform2: boolean = false;
  options: string[] = [];
  form: FormGroup;
  eventImages: FileList | null = null; 
  eventImagesURLs: string[] = []; 
  ownerdata: { first_name: string, last_name: string, email: string, Phone_number: number }[] = [{ first_name: '', last_name: '', email: '', Phone_number: 0 }];
  uploadedImages: { file: File; url: string }[] = [];
  uploadedImages2: { file: File; url: string }[] = [];
  destinationlist:Destination[]=[];
  minValue: number = 0;
  maxValue: number = 400;
  currentRange: number = 100;
  isMaxVisible: boolean = true;
  showFilter = false;
  filterName: string = ''; 
  filterAddress: string = ''; 

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

  email_destination:string='';
  destinaition_phone_number:number=0;
  facebook:string="";
  instagram:string="";
  website:string='';
city:string='';
state:string='';

images: string[] = []; 

  
  // to get a destination
  getDestinations() {
    this.destinationservice.getdestination().subscribe(
      (res: any) => {
        this.destinationlist = res.map((e: any) => {
          const data = e.payload.doc.data();
  
          // Extract and sanitize the Google Maps URL if available
          let safeMapUrl = null;
          if (data.adresse) {
            const iframeMatch = data.adresse.match(/src="([^"]+)"/);
            if (iframeMatch && iframeMatch[1]) {
              safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeMatch[1]);
            }
          }
  
          return {
            id_destination: e.payload.doc.id,
            name_destination: data.name_destination,
            adresse: data.adresse,
            description: data.description,
            category: data.category,
            type_destination: data.type_destination,
            menu: data.menu || [],
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
            max_price: data.max_price,
            state: data.state,
            city: data.city,
            email_destination: data.email_destination,
            destination_phone_number: data.destination_phone_number,
            facebook: data.facebook,
            instagram: data.instagram,
            website: data.website,
            images: data.images || [], // Fetch images here
            eventImagesURLs2: data.eventImagesURLs2 || [],
            ownerdata: data.ownerdata || [],
            safeMapUrl: safeMapUrl // Add the sanitized Google Maps URL here
          };
        });
      },
      err => {
        console.error('Error fetching destinations:', err);
      }
    );
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


// to add a destination
async adddestination() {
  // Upload images and get their URLs
  const uploadedImagesURLs = await this.uploadImagesToFirebase(this.uploadedImages2);
  
  const dynamicRowsData = this.ownerdata.map(row => ({
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    Phone_number: row.Phone_number,
  }));

  const destinationobj: Destination = {
    id_destination: '',
    name_destination: this.name_destination,
    adresse: this.adresse,
    description: this.description,
    category: this.category,
    type_destination: this.type_destination,
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
    min_price: this.minValue,
    max_price: this.maxValue,
    email_destination: this.email_destination,
    destinaition_phone_number: this.destinaition_phone_number,
    facebook: this.facebook,
    instagram: this.instagram,
    website: this.website,
    ownerdata: dynamicRowsData,
    city: this.city,
    state: this.state,
    rate: '',
    images: uploadedImagesURLs 
  };

  this.destinationservice.adddestination(destinationobj).then(() => {
    alert('Destination added successfully!');
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

showTooltip: boolean = false;

  toggleTooltip(): void {
    this.showTooltip = !this.showTooltip;
  }

  
  // to delete a destination
deletedestination(destination:Destination){
  if(window.confirm('are you sure that you want to delete this destination? '))
  this.destinationservice.deletedestination(destination);
}




//to update a destination
async updatedestination() {
  try {
    // Upload images and get their URLs
    const uploadedImagesURLs = await this.uploadImagesToFirebase(this.uploadedImages2);
    const updatedOwnerdata = this.ownerdata.length > 0 ? this.ownerdata : this.destinationobj.ownerdata;

    // Log URLs for debugging
    console.log('Uploaded images URLs:', uploadedImagesURLs);
    const updatedestinations: Destination = {
      id_destination: this.id_destination,
      name_destination: this.name_destination || this.destinationobj.name_destination, 
      adresse: this.adresse || this.destinationobj.adresse,
      description: this.description || this.destinationobj.description,
      category: this.category || this.destinationobj.category,
      type_destination: this.type_destination || this.destinationobj.type_destination,
      menu: this.eventImagesURLs.length > 0 ? this.eventImagesURLs : this.destinationobj.menu, 
      smoking_area: this.smoking_area !== undefined ? this.smoking_area : this.destinationobj.smoking_area,
      wifi_availibily: this.wifi_availibily !== undefined ? this.wifi_availibily : this.destinationobj.wifi_availibily,
      pet_friendly: this.pet_friendly !== undefined ? this.pet_friendly : this.destinationobj.pet_friendly,
      kids_corner: this.kids_corner !== undefined ? this.kids_corner : this.destinationobj.kids_corner,
      parking: this.parking !== undefined ? this.parking : this.destinationobj.parking,
      credit_card: this.credit_card !== undefined ? this.credit_card : this.destinationobj.credit_card,
      reservation: this.reservation !== undefined ? this.reservation : this.destinationobj.reservation,
      opening_hour: this.opening_hour || this.destinationobj.opening_hour,
      closing_hour: this.closing_hour || this.destinationobj.closing_hour,
      email_destination: this.email_destination || this.destinationobj.email_destination,
      destinaition_phone_number: this.destinaition_phone_number || this.destinationobj.destinaition_phone_number,
      facebook: this.facebook || this.destinationobj.facebook,
      instagram: this.instagram || this.destinationobj.instagram,
      website: this.website || this.destinationobj.website,
      min_price: this.minValue !== undefined ? this.minValue : this.destinationobj.min_price, 
      max_price: this.maxValue !== undefined ? this.maxValue : this.destinationobj.max_price, 
      city: this.city || this.destinationobj.city,
      state: this.state || this.destinationobj.state,
      rate: this.destinationobj.rate || '', 
      images: uploadedImagesURLs.length > 0 ? uploadedImagesURLs : this.destinationobj.images, 
      ownerdata: updatedOwnerdata 
    };

    // Update the destination
    await this.destinationservice.updatedest(updatedestinations);
    
    alert('Destination updated successfully');
    this.closePopup3();
  } catch (error) {
    console.error('Error updating destination:', error);
    alert('Failed to update destination. Please check the console for more details.');
  }
}


// for the update (retrieve all the data)
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
  this.opening_hour = destination.opening_hour || { hours: 0, minutes: 0 };
  this.closing_hour = destination.closing_hour || { hours: 0, minutes: 0 };
  this.facebook = destination.facebook || '';
  this.instagram = destination.instagram || '';
  this.min_price = destination.min_price || 0;
  this.max_price = destination.max_price || 0;
  this.email_destination = destination.email_destination || '';
  this.destinaition_phone_number = destination.destinaition_phone_number || 0;
  this.ownerdata = destination.ownerdata || [{ first_name: '', last_name: '', email: '', Phone_number: '' }];
  this.city = destination.city || '';
  this.state = destination.state || '';
  this.website = destination.website || '';


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

  this.form.patchValue({
    selectedState: this.state,
    selectedCity: this.city
  });

  this.onStateChange();

  if (this.cities.includes(this.city)) {
    this.form.patchValue({
      selectedCity: this.city
    });
  } else {
    console.log('City not found in the list');
    this.form.patchValue({
      selectedCity: ''
    });
  }

  this.openPopup3();
}

clearForm() {
  this.name_destination = '';
  this.adresse = '';
  this.description = '';
  this.category = '';
  this.type_destination = '';
  this.eventImagesURLs = [];
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
  this.menu='';

}



  toggleForm() {
    this.showform = !this.showform;
  }
  toggleForm2() {
    this.showform2 = !this.showform2;
  }

  
  



toggleFilter() {
  this.showFilter = !this.showFilter;
}

applyFilter() {
  console.log('Filtering by:', this.filterName, this.filterAddress);
  this.showFilter = false; 
}

clearFilter() {
  this.filterName = '';
  this.filterAddress = '';
}

// for the destination pic and menu

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



// Upload function for menu images
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
  this.eventImagesURLs2.length = 0;

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




eventImagesURLs2: string[] = [];



deleteImage(index: number) {
  URL.revokeObjectURL(this.uploadedImages[index].url);
  this.uploadedImages.splice(index, 1);
}


  selectCategory(cat: string) {
    this.category = cat;
    this.type_destination='';
  }

  isCategorySelected(cat: string): boolean {
    return this.category === cat;
  }

  selecttype(type: string) {
    this.type_destination = type;
  }

isTypeSelected(type: string): boolean {
  return this.type_destination === type;
}

// to add options in the types of destiantions
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

// to display the cities in the select 
displayCities() {
  if (this.selectedState && this.citiesByState[this.selectedState]) {
    this.cities = this.citiesByState[this.selectedState];
  } else {
    this.cities = []; 
  }
}

// to display the states in the select 
getStates(): string[] {
  return Object.keys(this.citiesByState);
}

onStateChange() {
  const selectedState = this.form.get('selectedState')?.value; 
  

  this.cities = this.citiesByState[selectedState] || [];
}

// For removing a menu image
removeImageMenu(index: number) {
    this.uploadedImages.splice(index, 1);

}

removeImagedestination(index: number) {
    this.uploadedImages2.splice(index, 1);

}


// to scroll to the top of the page when we click on next or previous 
scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

//to move to next button
nextStep() {
  if (this.currentStep < this.steps.length) {
    this.currentStep++;
    this.scrollToTop();
  }
}

//to move to previous button
previousStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
    this.scrollToTop();
  }
}

updateValue(event: Event, span: HTMLSpanElement) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value);
  const adjustedValue = Math.round(value / 5) * 5;
  span.textContent = adjustedValue.toString();
}


// to close and open the popups
openPopup2() {
  this.isPopupVisible2 = true;
}
closePopup2() {
  this.isPopupVisible2 = false;
  this.clearForm();

  this.currentStep = 1;
}

openPopup3() {
  this.isPopupVisible3 = true;
}
closePopup3() {
  this.isPopupVisible3 = false;
  this.clearForm();
  this.currentStep = 1;
}

// for price range 
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


ngOnInit(): void {
  this.getDestinations();
  const embedUrl = this.convertToEmbedUrl(this.googleMapsLink);
  this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}

// for the maps
updateMap(): void {
  const embedUrl = this.convertToEmbedUrl(this.adresse);
  this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}
extractMapUrl(destination: any): void {
  // Match the src URL inside the iframe code
  const iframeMatch = destination.adresse.match(/src="([^"]+)"/);

  if (iframeMatch && iframeMatch[1]) {
    // Extract and store the map URL for each destination individually
    destination.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeMatch[1]);
    console.log('Extracted map URL for destination:', destination.safeMapUrl);
  } else {
    // Assign an empty safe URL if no valid iframe src is found
    destination.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
    console.log('No valid iframe src found for this destination');
  }
}


mapIframe: string = '';
mapSrc: SafeResourceUrl | null = null;
convertToEmbedUrl(link: string): string {
  const baseUrl = 'https://www.google.com/maps/embed';

  if (link.includes('/maps/place/')) {
    const parts = link.split('/maps/place/');
    const place = parts[1]?.split('/')[0];
    if (place) {
      return `${baseUrl}?q=${encodeURIComponent(place)}`;
    }
  }

  else if (link.includes('@')) {
    const parts = link.split('@');
    const [latLng] = parts[1].split(',');
    return `${baseUrl}?ll=${latLng}&z=15`;
  }

  else if (link.includes('goo.gl') || link.includes('maps.app.goo.gl')) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(link)}`;
  }

  else {
    return link.replace('/maps', '/maps/embed');
  }

  return ''; 
}
}
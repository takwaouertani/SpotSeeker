import { Time } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { Events } from '../../classes/events';
import { OrganiserRequestsService } from '../../services/organiser-requests.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event-organiser-request',
  templateUrl: './event-organiser-request.component.html',
  styleUrl: './event-organiser-request.component.css'
})
export class EventOrganiserRequestComponent {
  currentStep: number = 1;
  steps: any[] = [
    { iconClass: 'fa-regular fa-user' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' }, 
    { iconClass: 'fa-sharp fa-solid fa-check-circle' },  
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } ,
    { iconClass: 'fa-sharp fa-solid fa-check-circle' } 
  ];


  constructor(private eventservice:OrganiserRequestsService,  private elRef: ElementRef ,private firestorage:AngularFireStorage
    ,private fb: FormBuilder,private eventservices:EventsService,
   ){this.form = this.fb.group({
    selectedState: [''],
    selectedCity: ['']
  });}
   ngOnInit(): void {
     this.getevent();
   }
   d:Date=new Date;
   form: FormGroup;
   selectedState: string = '';
  cities: string[] = [];
  uploadedImages: { file: File, url: string }[] = []; 
  searchText: any;
  showOptionInput = false;
  newOption = '';
  isPopupVisible3: boolean = false;
  options: string[] = [];
  eventImagesURLs: string[] = [];
   eventlist:Events[]=[];

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
     eventImages: FileList | null = null; 
  
     onEventImagesSelected(event: any) {
      this.eventImages = event.target.files; 
    }
   
  // to get an event
  getevent() {
    this.eventservice.getorganiser_request().subscribe(
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
            free_tickets:data.free_tickets,
            Dress_Code:data.Dress_Code,
            access_vip:data.access_vip,
            city:data.city,
            state:data.state,
            facebook: data.facebook,
            instagram: data.instagram,
            website: data.website,
            Capacity:data.Capacity,
            email_events:data.email_events,
            images:data.images,
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


// to add an event request
async addeventrequest() {
    const dynamicRowsData = this.organiserdata.map(row => ({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      Phone_number: row.Phone_number,
      
    }));

    
    const eventobj: Events = {
      id_event: '',
      name_event: this.name_event,
      adresse: this.adresse,
      description: this.description,
      category: this.category,
      type_event: this.type_event,
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
      state: this.state,
      city: this.city    };
  
    this.eventservice.addorganiser_request(eventobj).then(() => {
        alert('event added successfully!');
        this.closePopup2();
    }).catch(error => {
       console.log('Error adding the event', error);
    });
  }





// to add an event
async addevent() {
  const dynamicRowsData = this.organiserdata.map(row => ({
    first_name: row.first_name|| '',
    last_name: row.last_name|| '',
    email: row.email|| '',
    Phone_number: row.Phone_number|| 0,
    
  }));

  
  const eventobj: Events = {
    id_event: '',
    name_event: this.name_event|| '',
    adresse: this.adresse|| '',
    description: this.description|| '',
    category: this.category|| '',
    type_event: this.type_event|| '',
    date_debut: this.date_debut|| this.d,
    date_fin: this.date_fin|| this.d,
    heure_debut: this.heure_debut|| '',
    heure_fin: this.heure_fin|| '',
    prix: this.prix|| 0,
    Dress_Code: this.Dress_Code|| '',
    access_vip: this.access_vip|| false,
    free_tickets: this.free_tickets|| false,

    facebook: this.facebook|| '',
    instagram: this.instagram|| '',
    website: this.website|| '',
    Capacity: this.Capacity|| 0,
    email_events: this.email_events|| '',
    images: this.eventImagesURLs|| '',
    event_phone_number: this.event_phone_number|| 0,
    organiserdata: dynamicRowsData|| '',
    state: this.state|| '',
    city: this.city|| ''
  };

  this.eventservices.addevent(eventobj).then(() => {
      alert('event added successfully!');
      this.closePopup2();
  }).catch(error => {
     console.log('Error adding the event', error);
  });
}


 // pour la mise a jour du formulaire
 updateForm(destination:Events) {
  this.id_event = destination.id_event;
  this.name_event = destination.name_event;
  this.adresse = destination.adresse;
  this.description = destination.description;
  this.category = destination.category;
  this.type_event = destination.type_event;
  this.images = Array.isArray(destination.images) ? destination.images.join(', ') : destination.images || '';
  this.date_debut = destination.date_debut;
  this.date_fin = destination.date_fin;
  this.heure_debut = destination.heure_debut;
  this.heure_fin = destination.heure_fin;
  this.prix = destination.prix;
  this.Dress_Code = destination.Dress_Code;
  this.access_vip = destination.access_vip;
  this.website = destination.website;
  this.Capacity = destination.Capacity;
  this.facebook = destination.facebook;
  this.instagram = destination.instagram;
  this.email_events = destination.email_events;
  this.event_phone_number = destination.event_phone_number;
  this.event_phone_number = destination.event_phone_number;
  this.city=destination.city;
  this.free_tickets=destination.free_tickets;
  this.state=destination.state;
  this.organiserdata = destination.organiserdata || [{ first_name: '', last_name: '', email: '', Phone_number: '' }];


  this.openPopup3();
}



  // to delete an event
deleteevent(event:Events){
  if(window.confirm('are you sure that you want to delete this event? '))
  this.eventservice.deleteorganiser_request(event);
}



openPopup3() {
  this.isPopupVisible3 = true;
}
closePopup3() {
  this.isPopupVisible3 = false;
  this.clearForm();
  this.currentStep = 1;

}

  selectCategory(cat: string) {
    this.category = cat;
  }

  isCategorySelected(cat: string): boolean {
    return this.category === cat;
  }

  selecttype(type: string) {
    this.type_event = type;
  }

  istypeSelected(type: string): boolean {
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
    this.currentStep = 1;

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

// to display the cities in the select 
displayCities() {
  if (this.selectedState && this.citiesByState[this.selectedState]) {
    this.cities = this.citiesByState[this.selectedState];
  } else {
    this.cities = []; 
  }
}
city:string='';
  state:string='';
// to display the states in the select 
getStates(): string[] {
  return Object.keys(this.citiesByState);
}

onStateChange() {
  const selectedState = this.form.get('selectedState')?.value; 
  
  this.cities = this.citiesByState[selectedState] || [];
}

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
    const path = `yt/${Date.now()}_${file.name}`;
    const uploadTask = await this.firestorage.upload(path, file);
    const url = await uploadTask.ref.getDownloadURL();
    eventImagesURLs.push(url);
  }
}


deleteImage(index: number) {
  URL.revokeObjectURL(this.uploadedImages[index].url); 
  this.uploadedImages.splice(index, 1); 
}

  addOptionInput() {
    this.showOptionInput = !this.showOptionInput;
  }

  addOption() {
    if (this.newOption && !this.options.includes(this.newOption)) {
      this.options.push(this.newOption);
      this.newOption = '';
    }
  }

  selectdtype(option: string) {
    this.type_event = option;
  }

// to update an event request
  updateorganisereventrequest() {
    const dynamicRowsData = this.organiserdata.map(row => ({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      Phone_number: row.Phone_number
    }));
  
    const fetchPromises: Promise<Blob>[] = []; 
    const eventImagesURLs: string[] = []; 
  
    if (this.images) {
      for (let i = 0; i < this.images.length; i++) {
        const fetchPromise = fetch(this.images[i] as string) 
          .then(response => response.blob()) 
          .catch(error => {
            console.error('Error fetching image:', error);
            throw error; 
          });
  
        fetchPromises.push(fetchPromise); 
      }
    }
  
    Promise.all(fetchPromises)
      .then(blobs => {
        for (let i = 0; i < blobs.length; i++) {
          const imageURL = URL.createObjectURL(blobs[i]); 
          eventImagesURLs.push(imageURL);
        }
  
        const updateownerdestination: Events = {
          id_event: this.id_event,
          name_event:this.name_event,
          adresse: this.adresse,
          description: this.description,
          category: this.category,
          type_event: this.type_event,
          date_debut: this.date_debut,
          date_fin: this.date_fin,
          heure_debut: this.heure_debut,
          heure_fin:this.heure_fin,
          prix: this.prix,
          Dress_Code: this.Dress_Code,
          access_vip: this.access_vip,
          free_tickets: this.free_tickets,
          state: this.state,
          city: this.city,
          facebook: this.facebook,
          instagram: this.instagram,
          website: this.website,
          Capacity: this.Capacity,
          email_events: this.email_events,
          event_phone_number:this.event_phone_number,
          images: [],
          organiserdata: dynamicRowsData
        };
  
        return this.eventservice.updateorganiser_request(updateownerdestination);
      })
      .then(() => {
        alert('event updated successfully');
        this.closePopup3();

      })
      .catch(error => {
        console.error('Error updating event:', error);
      });
  }
  

   // to clear the form 
clearForm() {
  this.name_event = '';
  this.adresse = '';
  this.description = '';
  this.category = '';
  this.Capacity = 0;
  this.prix = 0;

  this.type_event = '';
  this.Dress_Code = '';
  this.eventImagesURLs = [];
  this.free_tickets = false;
  this.access_vip = false;
  this.heure_debut = {
    hours: 0,
    minutes: 0
  };

  this.heure_fin = {
    hours: 0,
    minutes: 0
  };
  this.date_fin = this.d;
  this.date_debut = this.d;

  this.email_events = '';
  this.event_phone_number = 0;
  this.facebook = '';
  this.instagram = '';
  this.website = '';
  this.organiserdata = [{
    first_name: '',
    last_name: '',
    email: '',
    Phone_number: 0
  }];
  this.city = '';
  this.state = '';
  this.eventImagesURLs = [];
  this.currentStep = 1;

}


}

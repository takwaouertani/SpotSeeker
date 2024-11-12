import { Component } from '@angular/core';
import { AuthAdherantService } from '../service/auth-adherant.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { Events } from '../classes/events';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { CommentsService } from '../services/comments.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comments } from '../classes/comments';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  slider!: HTMLElement;
  items!: NodeListOf<Element>;
  next!: HTMLElement;
  prev!: HTMLElement;
  dots!: NodeListOf<Element>;
  lengthItems!: number;
  active: number = 0;
  refreshInterval: any;

  constructor(private authService: AuthAdherantService, private afAuth: AngularFireAuth,private router:Router,private activatedRoute:ActivatedRoute,
        private eventservice:EventsService
  ) { }

  event!: Events;

  menuImagesa: { url: string; style: string }[] = []; 
  menuImagesb: { url: string; style: string }[] = []; 
  menuImagesc: { url: string; style: string }[] = []; 
  menuImagesd: { url: string; style: string }[] = []; 
  menuImagese: { url: string; style: string }[] = []; 
  menuImagesf: { url: string; style: string }[] = []; 
  menuImagesg: { url: string; style: string }[] = []; 



  ngOnInit(): void {
    
    const id = this.activatedRoute.snapshot.params['iden'];
    this.eventservice.geteventbyid(id).subscribe((event: Events | undefined) => {
      if (event) {
        this.event = event;
        this.menuImagesa = [
          { url: event.images[0], style: 'height: 300px; width: 220px; margin-top: 20px; border-radius: 9px;' },
          ];
        this.menuImagesb = [
           { url: event.images[1], style: 'height: 144px; width: 180px; border-radius: 9px;' },
          { url: event.images[2], style: 'height: 144px; width: 180px; border-radius: 9px;' },

        ];
        this.menuImagesc = [
          { url: event.images[3],style:"height: 144px; width: 180px;border-radius: 9px;margin-top: 20px; margin-left: 10px;" },

       ];

       this.menuImagesd = [
       { url: event.images[4],  style:"height: 144px; width: 180px;border-radius: 9px;margin-top: 175px; margin-left: -180px;" },

     ];
     this.menuImagese = [
      { url: event.images[1],  style:"height: 300px; width: 220px; margin-top: 20px;border-radius: 9px;"},

    ];
    this.menuImagesf = [
      { url: event.images[2],  style:"height: 144px; width: 180px;border-radius: 9px;" },
      { url: event.images[3],  style:"height: 144px; width: 180px;border-radius: 9px;margin-top: 175px; margin-left: -180px;" },


    ];
    this.menuImagesg = [
      { url: event.images[8],  style:"height: 144px; width: 180px;border-radius: 9px;margin-top: 175px; margin-left: -180px;" },

    ];




      } else {
      }
    });
  
  

    this.slider = document.querySelector('.slider .list')!;
    this.items = document.querySelectorAll('.slider .list .item');
    this.next = document.getElementById('next')!;
    this.prev = document.getElementById('prev')!;
    this.dots = document.querySelectorAll('.slider .dots li');

    if (!this.slider || !this.next || !this.prev || !this.dots) {
      console.error("One or more required elements not found!");
      return;
    }

    this.lengthItems = this.items.length - 1;

    this.next.addEventListener('click', () => this.nextSlide());
    this.prev.addEventListener('click', () => this.prevSlide());

    this.refreshInterval = setInterval(() => { this.next.click() }, 3000);

    this.dots.forEach((li, key) => {
      li.addEventListener('click', () => this.goToSlide(key));
    });

    window.addEventListener('resize', () => this.reloadSlider());
    
  }

  nextSlide(): void {
    this.active = this.active + 1 <= this.lengthItems ? this.active + 1 : 0;
    this.reloadSlider();
  }

  prevSlide(): void {
    this.active = this.active - 1 >= 0 ? this.active - 1 : this.lengthItems;
    this.reloadSlider();
  }

  reloadSlider(): void {
    const currentSlide = this.items[this.active] as HTMLElement;
    this.slider.style.left = -currentSlide.offsetLeft + 'px';

    const lastActiveDot = document.querySelector('.slider .dots li.active');
    if (lastActiveDot) {
      lastActiveDot.classList.remove('active');
    }
    this.dots[this.active].classList.add('active');

    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => { this.next.click() }, 3000);
  }

  goToSlide(index: number): void {
    this.active = index;
    this.reloadSlider();
  }
  isPopupVisible: boolean = false;

  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }
  chartData = [
    { label: 'Excellent', value: 120 },
    { label: 'Very good', value: 56 },
    { label: 'Average', value: 19 },
    { label: 'Poor', value: 9 },
    { label: 'Terrible', value: 6 }
  ];

  isPopupVisible2: boolean = false;
  openPopup2() {
    this.isPopupVisible2 = true;
  }
  closePopup2() {
    this.isPopupVisible2 = false;
  }



  
  showRateForm: boolean = false;

  toggleRateForm() {
    this.showRateForm = !this.showRateForm;
  }
  rating: number = 0;
  description: string = '';
  reviewTitle:string = '';
  rate(value: number) {
    this.rating = value;
  }
  isPopupVisible3: boolean = false;

  openPopup3() {
    this.isPopupVisible3 = true;
  }

  closePopup3() {
    this.isPopupVisible3 = false;
  }
  
  


  


 
  


  

  

  





}

  

  

  







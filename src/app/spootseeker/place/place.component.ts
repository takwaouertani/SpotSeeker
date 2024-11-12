import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthAdherantService } from '../service/auth-adherant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../services/comments.service';
import { Comments } from '../classes/comments';
import { Time } from '@angular/common';
import { Destination } from '../classes/destination';
import { DestinationService } from '../services/destination.service';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export class PlaceComponent implements OnInit,AfterViewInit{
  averageRating: number = 0;
  CommentCount$!: Observable<number>;
  mostFrequentRating: number = 0; 
  slider!: HTMLElement;
  items!: NodeListOf<Element>;
  next!: HTMLElement;
  prev!: HTMLElement;
  dots!: NodeListOf<Element>;
  lengthItems!: number;
  active: number = 0;
  refreshInterval: any;
  identif!: string;
  showAllComments = false;
  totalComments: number = 0;
  pass:string='';
  emailSignUp:string='';
  passwordSignUp:string='';
  passwordConfirm:string='';
      emailF:string='';
  loginForm! : FormGroup;
  signUpForm! : FormGroup;
  passwordsMismatch: boolean = false;
  errorLoginMessage: string = '';
  constructor(private authService: AuthAdherantService, 
    private afAuth: AngularFireAuth,
    private router:Router,
    private commentsService: CommentsService,
    private activatedRoute:ActivatedRoute,
        private destinationService:DestinationService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer , 
         private firestore: AngularFirestore ,
          private fb:FormBuilder ,
  ) { }

  destination!: Destination;

  menuImagesa: { url: string; style: string }[] = []; 
  menuImagesb: { url: string; style: string }[] = []; 
  menuImagesc: { url: string; style: string }[] = []; 
  menuImagesd: { url: string; style: string }[] = []; 
  menuImagese: { url: string; style: string }[] = []; 
  menuImagesf: { url: string; style: string }[] = []; 
  menuImagesg: { url: string; style: string }[] = []; 

  ngAfterViewInit(): void {
    this.items = document.querySelectorAll('.slider .list .item');
  
    if (!this.items.length) {
      console.error('No slider items found.');
      return;
    }
  
    this.lengthItems = this.items.length - 1;
    
    const nextElement = document.getElementById('next');
    const prevElement = document.getElementById('prev');
  
    if (!nextElement || !prevElement) {
      console.error("One or more required elements not found!");
      return;
    }
  
    this.next = nextElement as HTMLElement;
    this.prev = prevElement as HTMLElement;
  
    this.dots = document.querySelectorAll('.slider .dots li');
  
    if (!this.dots) {
      console.error("Dot elements not found!");
      return;
    }
  
    this.next.addEventListener('click', () => this.nextSlide());
    this.prev.addEventListener('click', () => this.prevSlide());
  
    this.refreshInterval = setInterval(() => { this.nextSlide() }, 3000);
  
    this.dots.forEach((li, key) => {
      li.addEventListener('click', () => this.goToSlide(key));
    });
  
    window.addEventListener('resize', () => this.reloadSlider());
  }
  
 
  ngOnInit(): void {
    this.loginForm = this.fb.nonNullable.group(
      {
      emailInput:['', [Validators.required , Validators.email]],
      passwordInput:['', [Validators.required]]
      }
      )
      this.signUpForm = this.fb.group(
        {
          emailInp: ['', [Validators.required, Validators.email]],
          passwordInp: ['', [Validators.required, Validators.minLength(6)]],
          passwordInpConfirm: ['', [Validators.required]],
        }, );
    this.route.paramMap.subscribe(params => {
      this.identif = params.get('identif') || 'default-id'; 
      console.log('Retrieved identif:', this.identif);
  
      this.CommentCount$ = this.firestore.collection('comments', ref => ref.where('id_destination', '==', this.identif))
      .snapshotChanges()
      .pipe(
        map(actions => actions.length)
      );
     this.commentsService.getCommentsByDestinationId(this.identif).subscribe(comments => {
        this.commentslist = comments.map(comment => comment.payload.doc.data() as Comments);
        console.log("Comments List:", this.commentslist);
  
       
       
      });
      this.commentsService.getAverageRating(this.identif).subscribe(rating => {
        this.averageRating = rating;
        console.log('Average Rating for Destination:', rating);
      });
      // Fetch destination details by ID
      this.destinationService.getDestinationById(this.identif).subscribe((destination: Destination | undefined) => {
        if (destination) {
          this.destination = destination;
          this.setupMenuImages(destination);
        }
      });
    });
  
    this.initializeSlider();
  }
  
  setupMenuImages(destination: Destination): void {
    this.menuImagesa = [
      { url: destination.menu[0], style: 'height: 300px; width: 220px; margin-top: 20px; border-radius: 9px;' },
    ];
    this.menuImagesb = [
      { url: destination.menu[1], style: 'height: 144px; width: 180px; border-radius: 9px;' },
      { url: destination.menu[2], style: 'height: 144px; width: 180px; border-radius: 9px;' },
    ];
    this.menuImagesc = [
      { url: destination.menu[3], style: 'height: 144px; width: 180px; border-radius: 9px; margin-top: 20px; margin-left: 10px;' },
    ];
    this.menuImagesd = [
      { url: destination.menu[4], style: 'height: 144px; width: 180px; border-radius: 9px; margin-top: 175px; margin-left: -180px;' },
    ];
    this.menuImagese = [
      { url: destination.menu[1], style: 'height: 300px; width: 220px; margin-top: 20px; border-radius: 9px;' },
    ];
    this.menuImagesf = [
      { url: destination.menu[2], style: 'height: 144px; width: 180px; border-radius: 9px;' },
      { url: destination.menu[3], style: 'height: 144px; width: 180px; border-radius: 9px; margin-top: 175px; margin-left: -180px;' },
    ];
    this.menuImagesg = [
      { url: destination.menu[8], style: 'height: 144px; width: 180px; border-radius: 9px; margin-top: 175px; margin-left: -180px;' },
    ];
  }

  initializeSlider(): void {
    this.slider = document.querySelector('.slider .list')!;
    this.items = document.querySelectorAll('.slider .list .item');
    this.next = document.getElementById('next')!;
    this.prev = document.getElementById('prev')!;
    this.dots = document.querySelectorAll('.slider .dots li');

    if (!this.slider || !this.next || !this.prev || !this.dots) {
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
    console.log('Next slide clicked');
    this.active = this.active + 1 <= this.lengthItems ? this.active + 1 : 0;
    this.reloadSlider();
  }
  
  prevSlide(): void {
    console.log('Previous slide clicked');
    this.active = this.active - 1 >= 0 ? this.active - 1 : this.lengthItems;
    this.reloadSlider();
  }
  
  reloadSlider(): void {
    console.log('Reloading slider');
    console.log('this.active:', this.active);
    console.log('this.items:', this.items);
  
    const currentSlide = this.items[this.active] as HTMLElement;
    console.log('currentSlide:', currentSlide);
  
    if (!currentSlide) {
      console.error('Current slide is undefined');
      return;
    }
  
    this.slider.style.left = -currentSlide.offsetLeft + 'px';
  
    const lastActiveDot = document.querySelector('.slider .dots li.active');
    if (lastActiveDot) {
      lastActiveDot.classList.remove('active');
    }
    this.dots[this.active].classList.add('active');
  
    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => { this.nextSlide() }, 3000);
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
    if (this.showRateForm) {
      setTimeout(() => {
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
          reviewForm.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
      this.resetForm();
    }
  }
  toggleCommentsSection() {
    this.showAllComments = !this.showAllComments;
    if (this.showAllComments) {
      setTimeout(() => {
        const commentsSection = document.getElementById('commentsSection');
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
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
  rememberMe: boolean = false;
  closePopup3() {

    this.isPopupVisible3 = false;
    if (!this.rememberMe) {
      this.resetForm2();
    } else {
      this.isPopupVisible3 = false;
      // Ne pas appeler resetForm2() si "Remember me" est coché
    }
  }
  loginSuccessMessage: string = '';

  signupSuccessMessage: string = '';
  errorSignupMessage: string = '';
  forgotpassmessage: string = '';
  InexistantAccountMessage:string='';

  showSignUpForm: boolean = false;
  showSforgotpassForm: boolean = false;
  email: string = '';

  login(email: string, password: string) {
    const isSignedUp = localStorage.getItem('isSignedUp');
    
    if (isSignedUp === 'true') {
      // Vérifie si l'utilisateur existe dans la collection Firestore
      this.authService.checkUserExists(email, password).then(userExists => {
        if (userExists) {
          // Si l'utilisateur existe, procéder à la connexion Firebase
          this.authService.login(email, password).then(() => {
            this.loginSuccessMessage = 'Login successful!';
            this.closePopup3();  // Fermer le popup
            
            // Après la connexion, l'utilisateur peut ajouter un commentaire
            // Il faut un appel explicite à addComment() après la connexion réussie
          }).catch(error => {
            console.error('Erreur lors de la connexion :', error);
          });
        } else {
          this.InexistantAccountMessage='Invalid email or password. Please try again.';
        }
      }).catch(error => {
        console.error('Erreur lors de la vérification de l\'utilisateur :', error);
      });
    } else {
      alert('Vous devez vous inscrire avant de pouvoir vous connecter.');
    }
  }
 
  isSignupSuccess: boolean = false;
  signup(email: string, password: string) {
    this.authService.register(email, password).then(() => {
      localStorage.setItem('isSignedUp', 'true');
      this.signupSuccessMessage = 'Registration successful! Please proceed to sign in.';
      this.isSignupSuccess = true;
      
      // Déconnexion après l'inscription
      this.authService.logout().then(() => {
        this.closeSignUpForm();
        this.openPopup3(); // Ouvre le formulaire de connexion
      });
  
    }).catch(error => {
      console.error('Erreur lors de l\'inscription :', error);
    });
  }

  // Vérifier l'état de connexion
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  // Afficher/Masquer formulaire d'inscription
  toggleSignIn() {
    this.showSignUpForm = !this.showSignUpForm;
  }

  closeSignUpForm() {
    this.showSignUpForm = false;
  }

  // Afficher/Masquer formulaire de mot de passe oublié
  toggleforgotpass() {
    this.showSforgotpassForm = !this.showSforgotpassForm;
  }

  closeforgotpass() {
    this.showSforgotpassForm = false;
    this.resetForgotPasswordForm();
  }

  // Méthode pour mot de passe oublié
  
  async forgotpassword() {
    try {
      // Check if the email exists in the login_adherant collection
      const exists = await this.authService.emailExists(this.emailF);
  
      if (exists) {
        // If the email exists, send the password reset email
        await this.authService.forgotPass(this.emailF);
        this.forgotpassmessage = 'A password reset email has been sent to your address. Please check your inbox and follow the instructions to reset your password.';
      } else {
        // If the email does not exist, show an appropriate message
        this.forgotpassmessage = 'This email does not exist. ';
      }
    } catch (error) {
      // General error handling
      console.error('Error handling password reset:', error);
      this.forgotpassmessage = 'Error handling password reset. Please try again.';
    }
  }

  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }

  // Connexion avec Google
  signinwithgoogle() {
    this.authService.googlesignin().then(() => {
      // Handle successful sign-in
      console.log('Google sign-in successful');
    }).catch(error => {
      // Handle sign-in errors
      console.error('Google sign-in error:', error);
    });
  }

  // Vérifier l'état de l'utilisateur
  checkAuthStatus() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.showRateForm = isLoggedIn;
    });
  }
// for the comments

commentslist:Comments[]=[];
commentsobj: Comments = {
  id_comment: '',
  email_adhrent: '',
  rates: 0,
  title_comment: '',
  content: '',
  id_destination: '',
  id_event: ''
}
id_comment:string='';
email_adhrent:string='';
rates:number=0;
title_comment:string='';
content:string='';
id_destination:string='';

addComment(email: string, password: string) {
  // Vérifier si l'utilisateur existe dans la collection Firestore
  this.authService.checkUserExists(email, password).then(userExists => {
    if (userExists) {
      // Utiliser l'email et mot de passe de l'utilisateur validé
      const commentsobj: Comments = {
        id_comment: '',
        email_adhrent: email, // Utilise l'email validé
        rates: this.rates,
        title_comment: this.title_comment,
        content: this.content,
        id_destination: this.identif,
        id_event: ''
      };

      this.commentsService.addComment(commentsobj).then(() => {
        
        console.log('Comments List:', this.commentslist);
        this.clearForm();
      }).catch(error => {
        console.error('Error adding comment:', error);
      });
    } else {
      this.InexistantAccountMessage='Invalid email or password. Please try again.';
    }
  }).catch(error => {
    console.error('Erreur lors de la vérification de l\'utilisateur :', error);
  });
}


resetForm(): void {
  this.rates = 0;
  this.title_comment = '';
  this.content = '';
}
clearForm() {
  this.commentsobj = {
    id_comment: '',
    email_adhrent: '',
    rates: 0,
    title_comment: '',
    content: '',
    id_destination:'',
    id_event:'',

  };
}

getStarIcons(rating: number, starColor: string): SafeHtml {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${starColor}" class="bi bi-star-fill " viewBox="0 0 16 16">
                  <path d="M5.707 1.568l1.088 2.547 2.869.218c.636.048.902.876.42 1.312l-2.225 1.938.662 2.886c.147.64-.529 1.15-1.052.802l-2.591-1.578-2.588 1.578c-.523.348-1.198-.162-1.05-.802l.664-2.886-2.228-1.938c-.482-.419-.215-1.267.42-1.312l2.869-.218 1.088-2.547c.24-.565 1.107-.565 1.347 0z"/>
                </svg>`;
    } else {
      stars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star star" viewBox="0 0 16 16">
                  <path d="M5.707 1.568l1.088 2.547 2.869.218c.636.048.902.876.42 1.312l-2.225 1.938.662 2.886c.147.64-.529 1.15-1.052.802l-2.591-1.578-2.588 1.578c-.523.348-1.198-.162-1.05-.802l.664-2.886-2.228-1.938c-.482-.419-.215-1.267.42-1.312l2.869-.218 1.088-2.547c.24-.565 1.107-.565 1.347 0z"/>
                </svg>`;
    }
  }
  return this.sanitizer.bypassSecurityTrustHtml(stars);
}



getProgressBarWidth(rating: number): string {
  const count = this.commentslist.filter(comment => comment.rates == rating && comment.id_destination === this.identif).length;
  console.log('Count for rating', rating, ':', count); 
  const totalCount = this.commentslist.filter(comment => comment.id_destination === this.identif).length;
  if (totalCount === 0) {
    return '0%';
  }
  const percentage = (count * 100) / totalCount;
  return percentage.toFixed(2) + '%';
}

getCommentText(rates: number): string {
  switch (rates) {
    case 5: return 'Excellent';
    case 4: return 'Very Good';
    case 3: return 'Good';
    case 2: return 'Poor';
    case 1: return 'Terrible';
    default: return '';
  }
}
getFilteredImages(images: any[]) {
  // Filtrer les images avec une URL valide et limiter à 5 images maximum
  return images.filter(image => image && image.url).slice(0, 5);
}
getAllFilteredImages() {
const allImages = [
...this.getFilteredImages(this.menuImagesa),
...this.getFilteredImages(this.menuImagesb),
...this.getFilteredImages(this.menuImagesc),
...this.getFilteredImages(this.menuImagesd)
];
return allImages;
}






get emailInput(){
  return this.loginForm.get('emailInput');
  }
  get passwordInput(){
    return this.loginForm.get('passwordInput');
    }
    get emailInp(){
      return this.loginForm.get('emailInp');
      }
      get passwordInp(){
        return this.loginForm.get('passwordInp');
        }
          get passwordInpConfirm(){
            return this.loginForm.get('passwordInpConfirm');
            }
        
            getMostFrequentRatingStars(): SafeHtml {
            
              let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= this.averageRating) {
      stars += `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007f9c" class="bi bi-star-fill " style=" margin-bottom: 16px;" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.329-.314-.158-.888.283-.95l4.898-.696L8 1.252l2.045 4.167 4.898.696c.441.062.612.636.283.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
               </svg>`;
    } else {
      stars += `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star " style=" margin-bottom: 16px;" viewBox="0 0 16 16">
                  <path d="M8 12.146l-4.389 2.256.83-4.73L1.388 6.316l4.898-.696L8 1.252l2.045 4.167 4.898.696-3.522 3.356.83 4.73L8 12.146zM8 11.293l3.86 2.011-.73-4.154 3.005-2.861-4.166-.592L8 2.653 5.03 5.697l-4.166.592 3.005 2.861-.73 4.154L8 11.293z"/>
               </svg>`;
    }
  }
  return this.sanitizer.bypassSecurityTrustHtml(stars);}
  
  resetForm2(): void {
   
    this.email = '';
    this.pass = '';
    this.InexistantAccountMessage='';
  }
  resetSignUpForm(): void {
   
    this.emailSignUp = '';
    this.passwordSignUp = '';
    this.passwordConfirm = '';
    this.passwordsMismatch = false;
    this.signupSuccessMessage = '';
  }
  resetForgotPasswordForm(): void {
    this.emailF = '';
    this.forgotpassmessage = '';
  }
  countComments(): Observable<number> {
    return this.firestore.collection('comment', ref => ref.where('id_destination', '==', this.identif)).get().pipe(
      map(snapshot => snapshot.size)
    );
  }







}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaceComponent } from './spootseeker/place/place.component';
import { NavbarComponent } from './spootseeker/navbar/navbar.component';
import { FormulaireReviewsComponent } from './spootseeker/formulaire-reviews/formulaire-reviews.component';
import { ErrorComponent } from './spootseeker/error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginAdherantComponent } from './spootseeker/login-adherant/login-adherant.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import{AngularFireModule}from '@angular/fire/compat'
import { environment } from '../environments/environment';
import { AdminDashboardComponent } from './spootseeker/admin/admin-dashboard/admin-dashboard.component';
import { DestinationsManagementComponent } from './spootseeker/admin/destinations-management/destinations-management.component';
import { ReviewsManagementComponent } from './spootseeker/admin/reviews-management/reviews-management.component';
import { EventsManagementComponent } from './spootseeker/admin/events-management/events-management.component';
import { MenuComponent } from './spootseeker/admin/menu/menu.component';
import { DestinationsOwnersRequestComponent } from './spootseeker/admin/destinations-owners-request/destinations-owners-request.component';
import { AdherantAccountsComponent } from './spootseeker/admin/adherant-accounts/adherant-accounts.component';
import { AdherantRegisterComponent } from './spootseeker/admin/adherant-register/adherant-register.component';
import { FormulaireProprietaireComponent } from './spootseeker/formulaire-proprietaire/formulaire-proprietaire.component';
import { FooterComponent } from './spootseeker/footer/footer.component';
import { HomeComponent } from './spootseeker/home/home.component';
import { AdminLoginComponent } from './spootseeker/admin/admin-login/admin-login.component';
import { AllEventsComponent } from './spootseeker/all-events/all-events.component';
import { AllRestaurantsComponent } from './spootseeker/all-restaurants/all-restaurants.component';
import { EventsSearchResultComponent } from './spootseeker/search/events-search-result/events-search-result.component';
import { RestaurantSearchResultComponent } from './spootseeker/search/restaurant-search-result/restaurant-search-result.component';
import { AllCoffeshopsComponent } from './spootseeker/all-coffeshops/all-coffeshops.component';
import { AllPicnicspotsComponent } from './spootseeker/all-picnicspots/all-picnicspots.component';
import { FormulaireComponent } from './spootseeker/formulaire/formulaire.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { OrganiserEventComponent } from './spootseeker/organiser-event/organiser-event.component';
import { EventComponent } from './spootseeker/event/event.component'; // Import AngularFireStorageModule
import { HighchartsChartModule } from 'highcharts-angular'; // Correct import
import { ChartModule } from 'angular-highcharts';
import { SearchPipe } from './spootseeker/pipe/search.pipe';
import { EventOrganiserRequestComponent } from './spootseeker/admin/event-organiser-request/event-organiser-request.component';
import { SafeResourceUrlPipe } from './spootseeker/pipe/safe-resource-url.pipe';
@NgModule({
  declarations: [
    AppComponent,
    PlaceComponent,
    NavbarComponent,
    FormulaireReviewsComponent,
    ErrorComponent,
    LoginAdherantComponent,
    AdminDashboardComponent,
    DestinationsManagementComponent,
    ReviewsManagementComponent,
    EventsManagementComponent,
    MenuComponent,
    DestinationsOwnersRequestComponent,
    AdherantAccountsComponent,
    AdherantRegisterComponent,
    FormulaireProprietaireComponent,
    FooterComponent,
    HomeComponent,
    AdminLoginComponent,
    AllEventsComponent,
    AllRestaurantsComponent,
    EventsSearchResultComponent,
    RestaurantSearchResultComponent,
    AllCoffeshopsComponent,
    AllPicnicspotsComponent,
    FormulaireComponent,
    OrganiserEventComponent,
    EventComponent,
    SearchPipe,
    EventOrganiserRequestComponent,
    SafeResourceUrlPipe

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    
    ReactiveFormsModule,
    ChartModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireStorageModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormulaireReviewsComponent } from './spootseeker/formulaire-reviews/formulaire-reviews.component';
import { ErrorComponent } from './spootseeker/error/error.component';
import { PlaceComponent } from './spootseeker/place/place.component';
import { LoginAdherantComponent } from './spootseeker/login-adherant/login-adherant.component';
import { AdminDashboardComponent } from './spootseeker/admin/admin-dashboard/admin-dashboard.component';
import { DestinationsManagementComponent } from './spootseeker/admin/destinations-management/destinations-management.component';
import { EventsManagementComponent } from './spootseeker/admin/events-management/events-management.component';
import { ReviewsManagementComponent } from './spootseeker/admin/reviews-management/reviews-management.component';
import { MenuComponent } from './spootseeker/admin/menu/menu.component';
import { DestinationsOwnersRequestComponent } from './spootseeker/admin/destinations-owners-request/destinations-owners-request.component';
import { AdherantAccountsComponent } from './spootseeker/admin/adherant-accounts/adherant-accounts.component';
import { AdherantRegisterComponent } from './spootseeker/admin/adherant-register/adherant-register.component';
import { FormulaireProprietaireComponent } from './spootseeker/formulaire-proprietaire/formulaire-proprietaire.component';
import { HomeComponent } from './spootseeker/home/home.component';
import { AdminLoginComponent } from './spootseeker/admin/admin-login/admin-login.component';
import { AllEventsComponent } from './spootseeker/all-events/all-events.component';
import { AllRestaurantsComponent } from './spootseeker/all-restaurants/all-restaurants.component';
import { EventsSearchResultComponent } from './spootseeker/search/events-search-result/events-search-result.component';
import { RestaurantSearchResultComponent } from './spootseeker/search/restaurant-search-result/restaurant-search-result.component';
import { AllPicnicspotsComponent } from './spootseeker/all-picnicspots/all-picnicspots.component';
import { AllCoffeshopsComponent } from './spootseeker/all-coffeshops/all-coffeshops.component';
import { FormulaireComponent } from './spootseeker/formulaire/formulaire.component';
import { OrganiserEventComponent } from './spootseeker/organiser-event/organiser-event.component';
import { EventComponent } from './spootseeker/event/event.component';
import { EventOrganiserRequestComponent } from './spootseeker/admin/event-organiser-request/event-organiser-request.component';

const routes: Routes = [
  { path: 'place/:identif',title:'place',component:PlaceComponent},
  { path: 'event/:iden',title:'event',component:EventComponent},

  { path: 'login_adherant',title:'login',component:LoginAdherantComponent},
  { path: 'reviews',title:'reviews',component:FormulaireReviewsComponent},
  { path: 'register_adherant',title:'register_adherant',component:AdherantRegisterComponent},
  { path: 'formulaire_proprietaire',title:'formulaire_proprietaire',component:FormulaireProprietaireComponent},
  { path: 'home',title:'home',component:HomeComponent},
  { path: 'login_admin',title:'login_admin',component:AdminLoginComponent},
  { path: 'all_events',title:'all_events',component:AllEventsComponent},
  { path: 'all_restaurants',title:'all_restaurants',component:AllRestaurantsComponent},
  { path: 'events_search_result',title:'events_search_result',component:EventsSearchResultComponent},
  { path: 'restaurant_search_result',title:'restaurant_search_result',component:RestaurantSearchResultComponent},
  { path: 'all_picnics',title:'all_picnics',component:AllPicnicspotsComponent},
  { path: 'all_coffeshops',title:'all_coffeshops',component:AllCoffeshopsComponent},
  {path:'formulaire',title:'formulaire',component:FormulaireComponent},

  {path:'organiser_request',title:'organiser_request',component:OrganiserEventComponent},

  { path: 'admin',title:'menu',component:MenuComponent,
  children:[
    {path:'dashboard',title:'dashboard',component:AdminDashboardComponent},
    {path:'destinations_management',title:'destinations_management',component:DestinationsManagementComponent},
    {path:'events_management',title:'events_management',component:EventsManagementComponent},
    {path:'reviews_management',title:'reviews_management',component:ReviewsManagementComponent},
    {path:'owners_requests',title:'owners_requests',component:DestinationsOwnersRequestComponent},
    {path:'adherant_accounts',title:'adherant_accounts',component:AdherantAccountsComponent},
    {path:'event_organiser_request',title:'event_organiser_request',component:EventOrganiserRequestComponent},


    {path:'',redirectTo:'dashboard',pathMatch:'full'}
  ]
  
  },
  { path: '', redirectTo:'home',pathMatch:'full'},
  { path: '**', title:'error' ,component:ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

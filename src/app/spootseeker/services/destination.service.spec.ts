import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Destination } from "../classes/destination";
import { DestinationService } from "./destination.service";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from "../../app.component";

describe('DestinationService', () => {
    let service: DestinationService;
    let afs: AngularFirestore;
    let firestoreSpy: any;

    beforeEach(() => {
        firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc', 'createId']);
        TestBed.configureTestingModule({
            providers: [
                { provide: AngularFirestore, useValue: firestoreSpy }
            ]
        });
        service = TestBed.inject(DestinationService);
        afs = TestBed.inject(AngularFirestore);
    });

    it('should add destination to Firestore', async () => {
        const destination: Destination = {
            id_destination: "",
            name_destination: "",
            adresse: "",
            description: "",
            city: "",
            state: "",
            category: "",
            type_destination: "",
            menu: [],
            smoking_area: false,
            wifi_availibily: false,
            pet_friendly: false,
            kids_corner: false,
            parking: false,
            credit_card: false,
            reservation: false,
            opening_hour: {
                hours: 0,
                minutes: 0
            },
            closing_hour: {
                hours: 0,
                minutes: 0
            },
            price_range: 0,
            email_destination: "",
            destinaition_phone_number: 0,
            facebook: "",
            instagram: "",
            website: "",
            rate: "",
            images: [],
            ownerdata: []
        };
        firestoreSpy.createId.and.returnValue('generatedId');
        const addSpy = firestoreSpy.collection.and.returnValue({ add: () => Promise.resolve() });
        await service.adddestination(destination);
        expect(addSpy).toHaveBeenCalledWith('/destination', { ...destination, id_destination: 'generatedId' });
    });

    it('should retrieve destinations from Firestore', () => {
        const snapshotChangesSpy = firestoreSpy.collection.and.returnValue({ snapshotChanges: () => of([]) });
        service.getdestination();
        expect(snapshotChangesSpy).toHaveBeenCalledWith('/destination');
    });

    it('should delete destination from Firestore', () => {
        const destination: Destination = {
            id_destination: "destination_id",
            name_destination: "",
            adresse: "",
            description: "",
            city: "",
            state: "",
            category: "",
            type_destination: "",
            menu: [],
            smoking_area: false,
            wifi_availibily: false,
            pet_friendly: false,
            kids_corner: false,
            parking: false,
            credit_card: false,
            reservation: false,
            opening_hour: {
                hours: 0,
                minutes: 0
            },
            closing_hour: {
                hours: 0,
                minutes: 0
            },
            price_range: 0,
            email_destination: "",
            destinaition_phone_number: 0,
            facebook: "",
            instagram: "",
            website: "",
            rate: "",
            images: [],
            ownerdata: []
        };
        const deleteSpy = firestoreSpy.doc.and.returnValue({ delete: () => Promise.resolve() });
        service.deletedestination(destination);
        expect(deleteSpy).toHaveBeenCalledWith('/destination/destination_id');
    });

    it('should update destination in Firestore', async () => {
        const destination: Destination = {
            id_destination: "destination_id",
            name_destination: "",
            adresse: "",
            description: "",
            city: "",
            state: "",
            category: "",
            type_destination: "",
            menu: [],
            smoking_area: false,
            wifi_availibily: false,
            pet_friendly: false,
            kids_corner: false,
            parking: false,
            credit_card: false,
            reservation: false,
            opening_hour: {
                hours: 0,
                minutes: 0
            },
            closing_hour: {
                hours: 0,
                minutes: 0
            },
            price_range: 0,
            email_destination: "",
            destinaition_phone_number: 0,
            facebook: "",
            instagram: "",
            website: "",
            rate: "",
            images: [],
            ownerdata: []
        };
        const deleteSpy = firestoreSpy.doc.and.returnValue({ delete: () => Promise.resolve() });
        const addSpy = firestoreSpy.collection.and.returnValue({ add: () => Promise.resolve() });
        await service.updatedestination(destination);
        expect(deleteSpy).toHaveBeenCalledWith('/destination/destination_id');
        expect(addSpy).toHaveBeenCalledWith('/destination', destination);
    });
});

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Hello, app');
    });
});

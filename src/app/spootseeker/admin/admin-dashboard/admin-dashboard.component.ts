import { AfterViewInit, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { DestinationService } from '../../services/destination.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent  {
  destinationCount$!: Observable<number>;
  EventCount$!: Observable<number>;
  OwnerCount$!: Observable<number>;
  OrganiserCount$!: Observable<number>;
  CommentCount$!: Observable<number>;

  categoriesCount: { [category: string]: number } = {};
  chart!: Chart;  // Line destination chart
  chart2!: Chart;  // Line event chart

  pchart!: Chart; // Pie destination chart
  pchart2!: Chart;// Pie event chart
  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.destinationCount$ = this.firestore.collection('destination').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    this.EventCount$ = this.firestore.collection('event').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    this.OwnerCount$ = this.firestore.collection('owner_request').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    this.OrganiserCount$ = this.firestore.collection('organiser_request').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    this.CommentCount$ = this.firestore.collection('comments').snapshotChanges().pipe(
      map(actions => actions.length)
    );
    
    this.getDestinationsCountByCategory();  
    this.geteventCountByCategory();
    this.initializeLineChartdestination();  
    this.initializeLineChartevent();  
    this.getDestinationsCountByStatedestination();
    this.getDestinationsCountByStateevent();

  }



// for the destination
  getDestinationsCountByCategory() {
    this.firestore.collection('destination').snapshotChanges().pipe(
      map(actions => {
        const categoryCountMap: { [category: string]: number } = {};
        actions.forEach(action => {
          const data = action.payload.doc.data() as any;
          const category = data.category;

          if (categoryCountMap[category]) {
            categoryCountMap[category]++;
          } else {
            categoryCountMap[category] = 1;
          }
        });
        return categoryCountMap;
      })
    ).subscribe(categoryCountMap => {
      this.categoriesCount = categoryCountMap;
      this.updatePieChart();
    });
  }
  updatePieChart() {
    const data = Object.entries(this.categoriesCount).map(([name, y]) => ({ name, y }));

    this.pchart = new Chart({
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 10,
          dataLabels: {
            connectorWidth: 0,
          },
          colors: ['#1abc9c', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c', '#34495e'] 
        }
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'Destinations ',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Nombre',
          data: data,
        },
      ]
    });
  }

  initializeLineChartdestination() {
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Destination'
      },
      xAxis: {
        categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "number of destination",
          data: [
            { y: 0 },
            { y: 0 },
            { y: 0 },
            { y: 0 },
            { y: 10 }
          ],
          color: '#3D7F8F',
        } as any
      ]
    });
  }




  // for the event
  geteventCountByCategory() {
    this.firestore.collection('event').snapshotChanges().pipe(
      map(actions => {
        const categoryCountMap: { [category: string]: number } = {};
        actions.forEach(action => {
          const data = action.payload.doc.data() as any;
          const category = data.category;

          if (categoryCountMap[category]) {
            categoryCountMap[category]++;
          } else {
            categoryCountMap[category] = 1;
          }
        });
        return categoryCountMap;
      })
    ).subscribe(categoryCountMap => {
      this.categoriesCount = categoryCountMap;
      this.updatePieChareventt();
    });
  }
  updatePieChareventt() {
    const data = Object.entries(this.categoriesCount).map(([name, y]) => ({ name, y }));

    this.pchart2 = new Chart({
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 10,
          dataLabels: {
            connectorWidth: 0,
          },
          colors: ['#1abc9c', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c', '#34495e'] 
        }
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'events',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Nombre',
          data: data,
        },
      ]
    });
  }
  



 

  initializeLineChartevent() {
    this.firestore.collection('event').snapshotChanges().pipe(
      map(actions => {
        const monthCountMap: { [month: string]: number } = {
          'Janvier': 0,
          'Février': 0,
          'Mars': 0,
          'Avril': 0,
          'Mai': 0,
          'Juin': 0,
          'Juillet': 0,
          'Aout': 0,
          'Septembre': 0,
          'Octobre': 0,
          'Novembre': 0,
          'Décembre': 0
        };

        actions.forEach(action => {
          const data = action.payload.doc.data() as any;
          const createdAt = data.createdAt?.toDate(); // Assumes `createdAt` is a Firestore Timestamp
          if (createdAt) {
            const month = createdAt.toLocaleString('fr-FR', { month: 'long' });
            monthCountMap[month]++;
          }
        });

        return monthCountMap;
      })
    ).subscribe(monthCountMap => {
      const data = Object.values(monthCountMap);
      this.updateLineChartevent(data);
    });
  }

  updateLineChartevent(data: number[]) {
    this.chart2 = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Nombre d\'événements ajoutés chaque mois cette année'
      },
      xAxis: {
        categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Nombre d'événements",
          data: data,
          color: '#3D7F8F',
        } as any
      ]
    });
  }

  ngAfterViewInit() {
    this.initializeLineChartevent();
  }

  // for the state  in destination
  getDestinationsCountByStatedestination() {
    this.firestore.collection('destination').snapshotChanges().pipe(
      map(actions => {
        const stateCountMap: { [state: string]: number } = {};
        actions.forEach(action => {
          const data = action.payload.doc.data() as any;
          const state = data.state; 

          if (stateCountMap[state]) {
            stateCountMap[state]++;
          } else {
            stateCountMap[state] = 1;
          }
        });
        return stateCountMap;
      })
    ).subscribe(stateCountMap => {
      this.initializeStatePieChartstatedestination(stateCountMap);
    });
  }
  states = ['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'];
  statePieChart!: Chart;

  initializeStatePieChartstatedestination(stateCountMap: { [state: string]: number }) {
    const data = this.states.map(state => ({
      name: state,
      y: stateCountMap[state] || 0
    }));

    this.statePieChart = new Chart({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Number of Destinations by State'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          borderWidth: 2,
          borderColor: '',
          slicedOffset: 10,
          dataLabels: {
            connectorWidth: 1,
            format: '{point.name}: {point.y}'
          },
          colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#FF8333', '#33FF83', '#5733FF', '#FF3357', '#33FF33', '#FFCC33', '#33FFCC', '#FF33CC', '#3333FF', '#FF3333', '#33FF99', '#9933FF', '#FF9933', '#33CCFF', '#FF33FF', '#FF6699', '#6699FF', '#33FF66', '#FF9966']
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Destinations',
          data: data,
        },
      ]
    });
}


  // for the state  in event
  getDestinationsCountByStateevent() {
    this.firestore.collection('event').snapshotChanges().pipe(
      map(actions => {
        const stateCountMap: { [state: string]: number } = {};
        actions.forEach(action => {
          const data = action.payload.doc.data() as any;
          const state = data.state; 

          if (stateCountMap[state]) {
            stateCountMap[state]++;
          } else {
            stateCountMap[state] = 1;
          }
        });
        return stateCountMap;
      })
    ).subscribe(stateCountMap => {
      this.initializeStatePieChartstateevent(stateCountMap);
    });
  }
  statePieChart2!: Chart;

  initializeStatePieChartstateevent(stateCountMap: { [state: string]: number }) {
    const data = this.states.map(state => ({
      name: state,
      y: stateCountMap[state] || 0
    }));

    this.statePieChart2 = new Chart({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Number of events by State'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          borderWidth: 2,
          borderColor: '',
          slicedOffset: 10,
          dataLabels: {
            connectorWidth: 1,
            format: '{point.name}: {point.y}'
          },
          colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#FF8333', '#33FF83', '#5733FF', '#FF3357', '#33FF33', '#FFCC33', '#33FFCC', '#FF33CC', '#3333FF', '#FF3333', '#33FF99', '#9933FF', '#FF9933', '#33CCFF', '#FF33FF', '#FF6699', '#6699FF', '#33FF66', '#FF9966']
        }
      },
      series: [
        {
          type: 'pie',
          name: 'events',
          data: data,
        },
      ]
    });
}


// map


mapChart: Chart | undefined;

}

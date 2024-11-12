import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { environment } from './environments/environment'; // Adjust the path if needed

const firebaseConfig = environment.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
export const perf = getPerformance(app);

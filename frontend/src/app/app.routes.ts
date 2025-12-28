import { Routes } from '@angular/router';
import ProfessorDashboard from './components/professor-dashboard/professor-dashboard.component';
import StudentDashboard from './components/student-dashboard/student-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'student', component: StudentDashboard },
  { path: 'professor', component: ProfessorDashboard }
];

import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { HomeComponent } from './home/index';
import { DataComponent } from './data/index';
import { GeneratorComponent } from './generator/index';
import { KeyComponent } from './key/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'data', component: DataComponent, canActivate: [AuthGuard] },
    { path: 'generator', component: GeneratorComponent, canActivate: [AuthGuard] },
    { path: 'key', component: KeyComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
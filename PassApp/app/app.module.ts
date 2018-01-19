import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule} from '@angular/http';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService,RegistrationService,DataService,KeyService, GeneratorService} from './_services/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { HomeComponent } from './home/index';
import { DataComponent } from './data/index';
import { GeneratorComponent } from './generator/index';
import { KeyComponent } from './key/index';
import { ModalModule } from 'ng2-bootstrap/modal';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        ModalModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        DataComponent,
        GeneratorComponent,
        KeyComponent
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        GeneratorService,
        RegistrationService,
        DataService,
        KeyService

    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
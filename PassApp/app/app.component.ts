import { Component } from '@angular/core';
import {AuthenticationService} from './_services/index'

@Component({
    moduleId: 'app',
    selector: 'app',
    template: require('./app.component.html')
})

export class AppComponent {

    constructor(
        private authenticationService: AuthenticationService) { }

    checkSignIn(){
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }else
        {
            return false;
        }
    }

    logout(){
        this.authenticationService.logout();
    }

}
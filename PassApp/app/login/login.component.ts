import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/index';

@Component({
    moduleId: 'login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    secondStep = false;
    error = '';
    message = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { this.ngOnInit()}

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    resetAction(){
        this.model={};
        this.loading=false;
        this.secondStep=false;
        this.error='';
        this.message='';
    }

    loginAction() {

        if(this.model.hash == null) {
            this.loading = true;
            this.authenticationService.login(this.model.username, this.model.password)
                .subscribe(result => {
                    if (result === true) {
                        this.secondStep = true;
                        this.loading = false;
                        this.error = null;
                        this.message = 'Enter the code';
                    } else {
                        this.error = 'Username or password is incorrect';
                        this.message = null;
                        this.loading = false;
                    }
                });
        }else{
            this.loading = true;
            this.authenticationService.login2(this.model.username, this.model.hash)
                .subscribe(result => {
                    if (result === true) {
                        this.router.navigate(['/']);
                    } else {
                        this.error = 'Code incorrect';
                        this.model.hash = null;
                        this.loading = false;
                        this.secondStep = true;
                        this.message = null;
                    }
                });
        }
    }
}

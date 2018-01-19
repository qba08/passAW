import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {RegistrationService} from '../_services/index';

@Component({
    moduleId: 'register',
    template: require('./register.component.html')
})

export class RegisterComponent {
    model: any = {};
    error='';
    loading = false;

    constructor(
        private router: Router,
        private registerService: RegistrationService,
    ) { }

    register() {
        this.loading = true;
        this.registerService.signUp(this.model)
            .subscribe(result => {
                    if(result){
                        this.router.navigate(['/login']);
                    }else{
                        this.loading = false;
                        this.error = 'User not added.'
                    }
                });
    }
}
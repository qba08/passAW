import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {DataService} from '../_services/index';
import {KeyService} from "../_services/key.service";

@Component({
    moduleId: 'data',
    template: require('./data.component.html')
})

export class DataComponent {
    model: any = {};
    keyModel: any = {};
    error='';
    loading = false;

    constructor(
        private router: Router,
        private dataService: DataService,
        private keyService: KeyService
    ) { }

    saveData() {
        this.loading = true;
        this.keyService.checkHash(this.keyModel.key)
            .subscribe(result=>{
                if(result){
                    this.dataService.addData(this.model, this.keyModel.key)
                        .subscribe(result => {
                            if(result){
                                this.router.navigate(['/']);
                            }else{
                                this.error = 'Data not added.';
                                this.loading = false;
                            }
                        });
                }else{
                    this.error = 'Key not working';
                    this.loading = false;
                }
            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });

    }
}
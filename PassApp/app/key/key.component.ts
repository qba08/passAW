import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';

import {KeyService} from '../_services/index';

@Component({
    moduleId: 'key',
    template: require('./key.component.html')
})

export class KeyComponent implements OnInit {
    model: any = {};
    error='';
    loading = false;

    @ViewChild('showModal') public showModal:ModalDirective;

    constructor(
        private router: Router,
        private keyService: KeyService,
    ) { }

    getAction(){
        this.keyService.getKey(this.model.code, this.model.civilID)
            .subscribe(result => {
                if(result == null){
                    this.error = "Data error";
                } else {
                    this.model.key = result;
                    this.openModal();
                    this.error = null;
                }
            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });
    }

    openModal(){
        this.showModal.show();
    }

    closeModal(){
        this.showModal.hide();
        this.model = {};
        this.router.navigateByUrl('/');
    }

    ngOnInit() {
        this.keyService.getCode()
            .subscribe(result => {
                if(!result){
                    this.error = "Server error. Reload page.";
                }
            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });
    }
}
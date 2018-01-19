import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../_models/index';
import { DataService } from '../_services/index';
import { ModalDirective } from 'ng2-bootstrap';
import {KeyService} from "../_services/key.service";

@Component({
    moduleId: 'home',
    template: require('./home.component.html')
})

export class HomeComponent{

    data        :Data[] = [];
    dataEdited  :Data;
    isEdit      :boolean = false;
    error       :string;
    message     :string;

    model        :any = {};
    dataSelected :Data;
    modalError   :string;

    constructor(private router: Router,
                private dataService: DataService) {
        this.refreshData();
    }

    @ViewChild('showModal') public showModal:ModalDirective;

    deleteData(data: Data){
        this.dataService.deleteData(data)
            .subscribe(result => {
                if (result === true) {
                    this.error = null;
                    this.message = 'Password '+ data.name +' deleted.';
                } else {
                    this.error = 'Password not deleted';
                    this.message = null;
                }
                this.refreshData();
            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });
    }

    editData(data: Data){
        this.dataEdited = data;
        this.isEdit = true;
        this.error = null;
        this.message = null;
    }

    updateAction(){
        this.dataService.editData(this.dataEdited)
            .subscribe(result => {
                if (result === true) {
                    this.message = 'Data edited';
                    this.close();
                    this.refreshData();
                } else {
                    this.error = 'Can not edit data';
                }

            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });
    }

    close(){
        this.dataEdited = null;
        this.isEdit = false;
    }

    showData(data: Data){
        this.dataSelected = data;
        this.model= {};
        this.modalError = null;
        this.showModal.show();
    }

    showKey(){
        this.dataService.getKey(this.dataSelected,this.model.key)
            .subscribe(result => {
                if (result == null) {
                    this.modalError = 'Data not found';
                } else {
                    this.modalError = null;
                    this.model.url = result.url;
                    this.model.login = result.login;
                    this.model.password = result.password;
                }
            },(err) => {
                if (err === 'Unauthorized') {
                    this.router.navigateByUrl('/login');
                }
            });
    }

    closeModal(){
        this.showModal.hide();
        this.dataSelected = null;
        this.model = {};
        this.modalError = null;
    }

    refreshData(){
        this.dataService.getAll()
            .subscribe(data => {
                this.data = data;
            },(err) => {
                if (err === 'Unauthorized') { this.router.navigateByUrl('/login');
                }
            });
    }

}
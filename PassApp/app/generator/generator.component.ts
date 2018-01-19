import { Component } from '@angular/core';
import { Router } from '@angular/router';


import {GeneratorService} from '../_services/index';

@Component({
    moduleId: 'generator',
    template: require('./generator.component.html')
})

export class GeneratorComponent {
    model: any = {};
    error='';

    constructor(
        private router: Router,
        private generatorService: GeneratorService,
    ) {
        this.model.source = "Browser";
        this.model.alph = "1";
    }
    generatePass(){
        let len  :number = Number(this.model.len);
        let alph :number = Number(this.model.alph);

        if(len>64 || len<4) {
            this.error = "Wrong value";
        } else {
            this.error = null;
            if(this.model.source == "Serwer"){
                this.generatorService.generate(len,alph)
                    .subscribe(result => {
                        if(result){
                            this.model.pass= result;
                        }else{
                            this.error = "Server error";
                        }
                    });
            }else{
                this.model.pass=this.generatorService.create(len,alph);
            }


        }
    }

}
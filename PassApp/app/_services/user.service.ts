
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {Config} from '../_helpers/config'

import { AuthenticationService } from './index';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    private apiUrl = Config.API_URL+'user';
    private headers = new Headers({'Authorization': this.authenticationService.token });
    private options = new RequestOptions({ headers: this.headers });

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }


}
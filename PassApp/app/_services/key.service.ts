import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../_helpers/index'
import { AuthenticationService } from '../_services/index';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class KeyService {
    private apiUrl = Config.API_URL+'user/key';
    private headers = new Headers({'Authorization': this.authenticationService.token });
    private options = new RequestOptions({ headers: this.headers });
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    checkHash(key: string):Observable<boolean>{
        let hash =  CryptoJS.SHA256(key).toString();
        return this.http.post(this.apiUrl, {hash:hash}, this.options)
            .map((response: Response)=> {
                let success = response.json() && response.json().success;
                if (success) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    getCode():Observable<boolean>{
        return this.http.post(this.apiUrl,{} , this.options)
            .map((response: Response)=> {
                let success = response.json() && response.json().success;
                if (success)
                    return true;
                else
                    return false;

            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    getKey(code :string, civilID: string):Observable<string>{
        return this.http.post(this.apiUrl, {code:code}, this.options)
            .map((response: Response)=> {
                let success = response.json() && response.json().success;
                if (success) {
                    let key = CryptoJS.AES.decrypt(response.json().data, civilID).toString(CryptoJS.enc.Utf8);
                    return key;
                } else {
                    return null;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

}
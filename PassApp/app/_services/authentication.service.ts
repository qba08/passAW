import { Injectable} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../_helpers/index'
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;
    private loginUrl = Config.API_URL+'login';
    private headers = new Headers();
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(this.loginUrl, { login: username, password: password}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if (success) {
                    // return true to indicate successful response
                    return true;
                } else {
                    // return false to indicate failed response
                    return false;
                }
            });
    }

    login2(username: string, hash: string): Observable<boolean> {
        return this.http.post(this.loginUrl, { login: username, hash: hash }, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if(success){
                    // login successful if there's a jwt token in the response
                    let token = response.json() && response.json().data.token;
                    if (token) {
                        // set token property
                        this.token = token;

                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                        // return true to indicate successful login
                        return true;
                    } else {
                        // return false to indicate failed login
                        return false;
                    }
                }else{
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
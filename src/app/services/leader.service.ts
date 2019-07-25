import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import { of, Observable } from 'rxjs';
import {delay, catchError, map} from 'rxjs/operators';
import {ProcessHTTPMsgService} from '../services/process-httpmsg.service';
import {HttpClient} from '@angular/common/http' ; 
import { baseURL } from '../shared/baseurl'
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private processHTTPMsgService:ProcessHTTPMsgService,
  private http : HttpClient) { }
  getLeaders() : Observable< Leader [] >  {
    return this.http.get<Leader[]>(baseURL + 'leadership').pipe(
      catchError(this.processHTTPMsgService.handleError)
    )
  }
  getFeaturedLeader(): Observable<Leader>  {
    return this.http.get<Leader>(baseURL+'leadership?featured=true').pipe(map(leaders => leaders[0])).pipe(
      catchError(this.processHTTPMsgService.handleError)
    )
  }
}

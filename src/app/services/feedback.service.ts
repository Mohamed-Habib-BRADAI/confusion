import { Injectable } from '@angular/core';
import { baseURL} from '../shared/baseurl';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {ProcessHTTPMsgService } from '../services/process-httpmsg.service'
import {FeedBack} from '../shared/feedback'
import { catchError } from 'rxjs/operators';
import {Observable} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private processHTTPMsgService : ProcessHTTPMsgService,
  private http: HttpClient) { }
  submitFeedback(feedBack : FeedBack): Observable<FeedBack>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<FeedBack>(baseURL+"feedback", feedBack,httpOptions).pipe(
      catchError(this.processHTTPMsgService.handleError)
    )
  }
}

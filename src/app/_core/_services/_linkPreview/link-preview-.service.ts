import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {
  private urlWithKey = 'http://api.linkpreview.net/?key=5b8fb07ac47224a893a88d15d3770375c5410eca302f3&q=';
  constructor(
    private http: HttpClient
  ) { }

  getLinkPreview(link: string): Observable<any> {
    return this.http.get<any> ( this.urlWithKey + link);
  }
}

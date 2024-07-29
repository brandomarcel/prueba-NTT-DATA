import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  protected static bp = '/bp/';
  protected static get base_url(): string {
    return environment.backEnd;
  }

  public static get product(): string { return this.base_url + this.bp + 'products/' }
  constructor() { }
}

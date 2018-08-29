import { Injectable } from '@angular/core';

@Injectable()
export class IonicStorageService {

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem('UserToken', token);
  }

  getToken(): string {
    let token: string;
    token = localStorage.getItem('UserToken');
    return token;
  }

  removeToken(): void {
    localStorage.removeItem('UserToken');
  }

  setUserID(UserID: string): void {
    localStorage.setItem('UserID', UserID);
  }

  getUserID(): string {
    let UserID: string;
    UserID = localStorage.getItem('UserID');
    return UserID;
  }

  removeUserID(): void {
    localStorage.removeItem('UserID');
  }

  setOnlocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getFromLocalStorage(key: string): string {
    return localStorage.getItem(key);
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

}

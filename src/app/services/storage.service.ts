import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getData(key: string): any[]{
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : [];
  }
}

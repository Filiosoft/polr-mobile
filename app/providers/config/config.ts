import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage, ViewController, NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';

export class Config {
  url: string;
  apikey: string;
  constructor(url: string, apikey: string) {
      this.url = url,
      this.apikey = apikey
  }
}

@Injectable()
export class ConfigService {
  storage: Storage = null;

  constructor(private nav: NavController, private view: ViewController) {
    this.storage = new Storage(LocalStorage);
  }

  public saveConfig(config: Config) {
    return this.storage.set(config.url, config.apikey);
  }


}


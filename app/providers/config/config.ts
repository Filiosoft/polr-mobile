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

  saveConfig(config: Config) {
    this.storage.set('url', config.url);
    this.storage.set('apikey', config.apikey);

    return
  }

  public getConfig() {
    return {
      url: "https://polr.me",
      apikey: "afsdafsdafdsa"
    }
  }


}


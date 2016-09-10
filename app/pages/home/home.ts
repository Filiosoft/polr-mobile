import { Component } from '@angular/core';
import { Storage, LocalStorage, NavController } from 'ionic-angular';
//import { Config, ConfigService} from '../../providers/config/config';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  local: Storage = null;
  config: string;

  constructor(public navCtrl: NavController) {
    this.local = new Storage(LocalStorage);
    this.config = this.getConfig();

  }

  saveConfig(config) {
    this.local.set('config', JSON.stringify(config));
    return;
  }

  getConfig() {
    var config;
    this.local.get('config').then(function (configLocal) {
      config = JSON.parse(configLocal);
      console.log("Hi" + configLocal)
      return configLocal
    });
  }
}

export class ConfigClass {
  url: string;
  apikey: string;
  constructor(url: string, apikey: string) {
    this.url = url,
      this.apikey = apikey
  }
}
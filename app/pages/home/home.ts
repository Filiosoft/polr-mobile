import { Component } from '@angular/core';
import { Storage, LocalStorage, NavController } from 'ionic-angular';
//import { Config, ConfigService} from '../../providers/config/config';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  local: Storage = null;
  config: Object;

  constructor(public navCtrl: NavController) {
    this.local = new Storage(LocalStorage);
    this.config = this.getConfig();
  }

  saveConfig(config) {
    this.local.set('config', JSON.stringify(config));

    console.log("It happened");
    return;
  }
  getConfig():ConfigClass {
    var config;
    this.local.get('config').then(function(configLocal){
      config = JSON.parse(configLocal);
    });

    return new ConfigClass(config.url, config.api);
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
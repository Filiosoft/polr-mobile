import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config, ConfigService} from '../../providers/config/config';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private config: Config;
  configService = ConfigService;

  constructor(public navCtrl: NavController) {
    console.info("yo");
    console.log(this.configService);
    this.config = this.configService.getConfig();
  }

  public saveConfig() {
    this.configService.saveConfig(this.config);
  }

}

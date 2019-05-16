import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


  public appPages = [
    {
      title: 'בית',
      url: '/home'
    
    },
    {
      title: 'הגדרות כלליות',
      url: '/general-settings'
     
    },
    {
      title: 'הגדרות זמנים',
      url: '/zmanim-settings'
    
    },
    {
      title: 'הגדרות מידע והלכות',
      url: '/shiurim-settings'
     
    },
    {
      title: 'הנצחות',
      url: '/hanzaha-settings'
     
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.page.html',
  styleUrls: ['./general-settings.page.scss'],
})
export class GeneralSettingsPage implements OnInit {

  constructor(public dataP:DataService, public storage:Storage, public menuCtrl:MenuController) {
  }


  ngOnInit() {
    //console.log('ionViewDidLoad GeneralSettingsPage');
  }
  



allInputsShows:any;

editInput(name:string,bool:boolean)
{
  //console.log("EDIT INPUT");
  //console.log(name);
  let obj={};
  obj[name]=bool;
  this.allInputsShows=obj;
  }

  async saveInput(name:string)
  {
    this.saveToStorage();
   this.editInput(name,false);
   //console.log(this.dataP.theGeneralSettings);
}

async cancelInput(name:string)
{
  this.dataP.resetFromStorage("theGeneralSettings");
  this.editInput(name,false);
}




saveToStorage()
{
  this.storage.set("theGeneralSettings",this.dataP.theGeneralSettings);
}


openMenu()
{
  //console.log("OPEN MENU");
  this.menuCtrl.open();
}

}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-shiurim-settings',
  templateUrl: './shiurim-settings.page.html',
  styleUrls: ['./shiurim-settings.page.scss'],
})
export class ShiurimSettingsPage implements OnInit {

   
  ngOnInit() {
  }

constructor(public dataP:DataService, public storage:Storage, public menuCtrl:MenuController) {
  }

  

allInputsShows:any=new Array(100);

editInput(name:string,id:number,bool:boolean)
{
  let obj={};
  obj[name]=bool;
  this.allInputsShows[id]=obj;
  }

  async saveInput(name:string,id:number)
  {
    this.saveToStorage();
   this.editInput(name,id,false);
   //console.log(this.dataP.theZmanimList);
}

async cancelInput(name:string,id:number)
{
  this.dataP.resetFromStorage("theShiurimList");
   this.editInput(name,id,false);
}



saveToStorage()
{
  this.storage.set("theShiurimList",this.dataP.theShiurimList);
}


openMenu()
{
  //console.log("OPEN MENU");
  this.menuCtrl.open();
}

}

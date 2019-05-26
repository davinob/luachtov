import { Component, OnInit } from '@angular/core';
import { DataService, Hanzaha } from '../data.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-hanzaha-settings',
  templateUrl: './hanzaha-settings.page.html',
  styleUrls: ['./hanzaha-settings.page.scss'],
})
export class HanzahaSettingsPage implements OnInit {

 constructor(public dataP:DataService, public storage:Storage, public menuCtrl:MenuController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HanzahaSettingsPage');
  }

  ngOnInit() {
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

  async saveInput(name:string,keyFromDataP:string)
  {
    this.saveToStorage();
   this.editInput(name,false);
}

async cancelInput(name:string,keyFromDataP:string)
{
  this.dataP.resetFromStorage(keyFromDataP);
  this.editInput(name,false);
}



saveToStorage()
{
  this.storage.set("theHanzahotList",this.dataP["theHanzahotList"]);
}


tmpType;
tmpText;

addValueToListOfHanzahot()
{
  this.dataP.theHanzahotList.push(
    {
      type:this.tmpType,
      text:this.tmpText,
      id:this.dataP.theHanzahotList.length}
    );

    this.tmpType=null;
    this.tmpText="";
  this.saveToStorage();
}
 

removeHanza(hanza:Hanzaha) 
{
  this.dataP.theHanzahotList=this.dataP.theHanzahotList.filter(elem=>
    {
      //console.log(elem);
      return elem.id!=hanza.id;
    });
  this.saveToStorage();
}

onRenderItems(event, list:Array<any>) {
  //console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
   let draggedItem = list.splice(event.detail.from,1)[0];
   list.splice(event.detail.to,0,draggedItem)
   event.detail.complete();
  //console.log(list);
  this.saveToStorage();
}

openMenu()
{
  //console.log("OPEN MENU");
  this.menuCtrl.open();
}

}

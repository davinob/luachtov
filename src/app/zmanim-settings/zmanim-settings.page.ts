import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService,Zmanim } from '../data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-zmanim-settings',
  templateUrl: './zmanim-settings.page.html',
  styleUrls: ['./zmanim-settings.page.scss'],
})
export class ZmanimSettingsPage implements OnInit {

  
  ngOnInit() {
  }

constructor(public dataP:DataService, public storage:Storage, public menuCtrl:MenuController) {
  }

  

allInputsShows:any=new Array(100);

editInput(name:string,id:number,bool:boolean)
{
  //console.log("EDIT INPUT");
  //console.log(name+id);
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
  this.dataP.resetFromStorage("theZmanimList");
   this.editInput(name,id,false);
}


addValueToListOfZmanim(zmanPerso:Zmanim)
{
  zmanPerso.list.push(
    {description:zmanPerso.tmpName, value:zmanPerso.tmpValue,
      type:zmanPerso.tmpType,
      relation:zmanPerso.tmpRelation,
      id:zmanPerso.list.length});
    zmanPerso.tmpName=" ";
    zmanPerso.tmpValue=" ";
    zmanPerso.tmpType=null;
    zmanPerso.tmpRelation=null;
  this.saveToStorage();
  //console.log(zmanPerso);
}

removeZman(zmanPerso:Zmanim, zman:any)
{
  //console.log(zmanPerso);
  zmanPerso.list=zmanPerso.list.filter(elem=>
    {
      //console.log(elem);
      //console.log(zman);
      return elem.id!=zman.id;
    });
  this.saveToStorage();
  //console.log(zmanPerso);
}

saveToStorage()
{
  this.storage.set("theZmanimList",this.dataP.theZmanimList);
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

import { Component, ViewChild } from '@angular/core';



import Hebcal from "hebcal";
import KosherZmanim from "kosher-zmanim";
import { Storage } from '@ionic/storage';
import { DataService } from '../data.service';
import { Observable, Subscription, timer } from 'rxjs';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  
  @ViewChild("panelRightContent") panelRightContent;
  @ViewChild("panelHanzahotContent") panelHanzaotContent;

  constructor(public storage: Storage, public dataP: DataService, public menuCtrl:MenuController) {

  }

  hDays = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
  currentHDateStr: string;
  currentTimeStr: string;
  currentParasha: string;
  kzman: any;

  timer: Observable<any>;
  timerSub: Subscription;
  stopAll = false;



  ionViewDidEnter() {
    //console.log("ENTERING");
    this.stopAll = false;
   this.timer = timer(0, 200);

    

    this.dataP.stillInInit.subscribe(isInInit => {
      if (isInInit) {
        //console.log("WAITING FOR DATAP INIT");
      }
      else {
        this.initMe();
      }
    });




  }

  openMenu()
  {
    this.menuCtrl.open();
  }

  initMe() {
    //console.log("INIT ME");

let firstTime=true;
    this.timerSub = this.timer.subscribe((val) => {
      this.initElems();
      if (firstTime)
      {
        this.handlePanelsZmanim();
        this.handlePanelsHanzahot();
      }
      firstTime=false;
    });

  
  }


  ionViewDidLeave() {
    //console.log("LEAVINNG");
    this.stopAll = true;
    if (this.timerSub && !this.timerSub.closed)
      this.timerSub.unsubscribe();
    //console.log("LEFT");
  }


  async goodSleep(ms: number) {
    await this.sleep(ms);
  }


  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
  } 

  zmanimTitle;
  listOfTimes;

  async handlePanelsZmanim() {
    let i = 0;

    //console.log("handlePanelsZmanim");

    let zmanimList = this.dataP.theZmanimList;

    while (!this.stopAll) {
      i = (i + 1) % zmanimList.length;
      let theZman = zmanimList[i];
      if (theZman.enabled) {
        //console.log("Printing panel num" + i);
        this.zmanimTitle = theZman.name;
        //console.log("ZMANIM TITLE");
        //console.log(this.zmanimTitle);

        if (theZman.id == 0) {
          this.setListOfTimesForZmanimG(theZman.list);
        }
        else
          this.setListOfTimesForZmanimP(theZman.list);

        //console.log("Waiting for scroll panel and duration of " + theZman.duration);
        await this.goodSleep(0.2);
        this.stopScrolls=false;
        await this.scrollPanel(this.panelRightContent,theZman.duration);
        await this.goodSleep(2);
        this.stopScrolls=true; 
      
      }
    }
  }


  stopScrolls:boolean;
  subscription:Subscription;

async scrollPanel(panel, duration) {

return new Promise( (resolve)=>{

  var fps = 1000;
var minDelta = 0.5;

let totalDistance=panel.nativeElement.scrollHeight - panel.nativeElement.scrollTop - panel.nativeElement.offsetHeight;
let autoScrollSpeed=totalDistance/duration;
console.log("SCROLL PANELL");
console.log(totalDistance);
console.log(duration);
console.log(autoScrollSpeed);
console.log(panel.nativeElement.scrollTop);
console.log(panel.nativeElement.scrollHeight);
console.log(panel.nativeElement.offsetHeight);

let  currentDelta = 0;
var currentTime, prevTime, timeDiff;
let timerScroll = timer(0, 1000/fps);

if (this.subscription && !this.subscription.closed)
{
  this.subscription.unsubscribe();
}

this.subscription=timerScroll.subscribe(()=>
{
  if (this.stopAll || this.stopScrolls || panel.nativeElement.scrollTop >= (panel.nativeElement.scrollHeight - panel.nativeElement.offsetHeight))
    {
      this.subscription.unsubscribe();
      console.log("UNSUBSCRIBED");
      resolve();
    }
    
    currentTime = Date.now();
    if (prevTime) {
            timeDiff = (currentTime - prevTime)/1000;
            currentDelta += autoScrollSpeed * timeDiff;
            if (currentDelta  >= minDelta) {
              let val=Math.round(panel.nativeElement.scrollTop+currentDelta);
              currentDelta = (panel.nativeElement.scrollTop+currentDelta)-val; //saves the decimal we didn't add (or added more)
              panel.nativeElement.scrollTop=val;
               prevTime = currentTime;
            }
    } else {
        prevTime = currentTime;
    }
    
    
  });


});
 
}




  async handlePanelsHanzahot() {
    let i = 0;

    //console.log("handlePanelsHanzahot");
     this.scrollHanzahot();
  }


  hideHanzahot:boolean=false;
  async scrollHanzahot() {
    let panel=this.panelHanzaotContent;
   
    let scrollInit=panel.nativeElement.scrollLeft;

    while (!this.stopAll)
    {
      await this.goodSleep(this.dataP.theHanzahaSettings.duration);
      //console.log(panel);
     this.hideHanzahot=true;
      await this.goodSleep(0.01);
      panel.nativeElement.scrollLeft=scrollInit;
      await this.goodSleep(0.01);
      //console.log(panel);
      this.hideHanzahot=false;
      await this.goodSleep(0.01);
      //console.log(panel);
      while (!this.stopAll && panel.nativeElement.scrollLeft > 0) {
      await this.goodSleep(0.00001);
      panel.nativeElement.scrollLeft -= 3;
   }
}

  }


  setListOfTimesForZmanimP(list: Array<any>) {
    if (!list)
      return;

    let newArr = [];

    list.forEach(zmanEntry => {
      if (zmanEntry.type == "fixed") {
        newArr.push({ description: zmanEntry.description, value: zmanEntry.value });
      }
      else {
        if (this.kzman) {
          let kdate: Date = new Date(this.kzman[zmanEntry.relation.name]);
          //console.log(kdate);

          if (zmanEntry.type == "לפני") {
            let mins:number=Number(kdate.getMinutes()) - Number(zmanEntry.value);
            kdate.setMinutes(mins);
          }
          else {
            let mins:number=Number(kdate.getMinutes()) + Number(zmanEntry.value);
            kdate.setMinutes(mins);
          }
          newArr.push({ description: zmanEntry.description, value: this.stringOfDateNoSec(kdate) });
        }
      }

    });


    list.filter(zmanEntry => zmanEntry.isChecked).forEach(zmanEntry => {
      
      if (this.kzman) {
        let kdate: Date = new Date(this.kzman[zmanEntry.name]);
        newArr.push({ description: zmanEntry.description, value: this.stringOfDateNoSec(kdate) });
      }

    });
    this.listOfTimes = newArr;
  }


  setListOfTimesForZmanimG(list: Array<any>) {
    if (!list)
      return;

    let newArr = [];


    list.filter(zmanEntry => zmanEntry.isChecked).forEach(zmanEntry => {
      if (this.kzman) {
        let kdate: Date = new Date(this.kzman[zmanEntry.name]);
        newArr.push({ description: zmanEntry.description, value: this.stringOfDateNoSec(kdate) });
      }

    });
    this.listOfTimes = newArr;
  }


  initElems() {
    let hdate = new Hebcal.HDate();
    let gDate = new Date();

    hdate.setLocation(Number.parseFloat(this.dataP.theGeneralSettings.lat), Number.parseFloat(this.dataP.theGeneralSettings.lng));


    let zOptions = {
      date: gDate,
      timeZoneId: this.dataP.theGeneralSettings.zoneId,
      locationName: "Netanya",
      latitude: Number.parseFloat(this.dataP.theGeneralSettings.lat),
      longitude: Number.parseFloat(this.dataP.theGeneralSettings.lng),
      complexZmanim: true
    }

    let kzmanim = new KosherZmanim(zOptions);
    this.kzman = kzmanim.getZmanimJson().Zmanim;




    //    //console.log(kzman.getZmanimJson().Zmanim.SofZmanShmaGRA);


    this.currentParasha = "פרשת " + hdate.getSedra('h')[0];
    /*
        //console.log(this.currentParasha);
        //console.log(hdate.dafyomi('h'));
        //console.log(hdate.toString('h'));
        //console.log(hdate.tachanun_uf());
    */

    this.currentHDateStr = this.hDays[gDate.getDay()] + "                   " + hdate.toString('h');




    this.currentTimeStr = this.stringOfDate(gDate);

    ////console.log(this.currentTimeStr);
  }

  stringOfDate(theDate: Date): string {
    ////console.log(theDate);
    if (theDate)
      return this.add0Pref(theDate.getHours()) + ":" + this.add0Pref(theDate.getMinutes()) + ":" + this.add0Pref(theDate.getSeconds());
  }

  stringOfDateNoSec(theDate: Date): string {
    ////console.log(theDate);
    if (theDate)
      return this.add0Pref(theDate.getHours()) + ":" + this.add0Pref(theDate.getMinutes());
  }

  add0Pref(num): string {
    if (num < 10)
      return "0" + num;
    return num;
  }
}

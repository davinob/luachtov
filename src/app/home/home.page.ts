import { Component, ViewChild } from '@angular/core';



import Hebcal from "hebcal";
import KosherZmanim from "kosher-zmanim";
import { Storage } from '@ionic/storage';
import { DataService } from '../data.service';
import { Observable, Subscription, timer } from 'rxjs';
import { MenuController } from '@ionic/angular';



import * as halahayomit from '../contents/halahayomit'; 


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  @ViewChild("panelLeftContent") panelLeftContent;
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
      if (!isInInit) {
        this.initMe();
      }
    });




  }

  openMenu()
  {
    this.menuCtrl.open();
  }

  initMe() {
    console.log("INIT ME");

let firstTime=true;
    this.timerSub = this.timer.subscribe((val) => {

      this.setHDateAndKzmanInfos();

      if (firstTime)
      { this.handlePanelsZmanim();
        this.handlePanelsShiurim();
        this.handlePanelsHanzahot();
        this.updateDailyInfoAfterDateChange();
      }
      firstTime=false;

    


    });

   
  }


  currentHalaha;
  hDates=[" ","א","ב","ג","ד","ה","ו","ז","ח","ט","י",
          "י\"א","י\"ב","י\"ג","י\"ד","ט\"ו","ט\"ז","י\"ז","י\"ח","י\ט","כ",
          "כ\"א","כ\"ב","כ\"ג","כ\"ד","כ\"ה","כ\"ו","כ\"ז","כ\"ח","כ\"ט","ל"
          ];


  updateDailyInfoAfterDateChange()
  {
    console.log("HILHOTYOMIOT TODAY");
    let todayHMonth=this.hDate.getMonthName('h');
    console.log("TODAY H MONTH:"+todayHMonth);
    let todayHDate=this.hDate.getDate();
    console.log("TODAY H DATE:"+todayHDate);
    let todayHDateH=this.hDates[this.hDate.getDate()];
    console.log("TODAY HH DATE:"+todayHDateH);  


    this.currentHalaha=halahayomit.hilhotyomiot.
                            filter((halaha)=>halaha.month==todayHMonth && halaha.date==todayHDateH)
                            .pop();
    if (this.currentHalaha)
    {
        console.log(this.currentHalaha.date);
        console.log(this.currentHalaha.year);
        console.log(this.currentHalaha.title);
        console.log(this.currentHalaha.content);
    }
      console.log("AFTER HILHOTYOMIOT");
    
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




  currentShiur;
  async handlePanelsShiurim() {
    let i = 0;

    //console.log("handlePanelsZmanim");

    let shiurimList = this.dataP.theShiurimList;
    let subscriptionScroll:Subscription;

    while (!this.stopAll) {
      i = (i + 1) % shiurimList.length;
      let theShiur = shiurimList[i];
      if (theShiur.enabled) {
        this.currentShiur=theShiur;
        await this.goodSleep(0.2);
      

        if (subscriptionScroll && !subscriptionScroll.closed)
        {
        subscriptionScroll.unsubscribe();
        }

        await this.scrollPanel(this.panelLeftContent,theShiur.duration,subscriptionScroll);
        await this.goodSleep(theShiur.durationAfter);
   
      
      }
    }
  }



  zmanimTitle;
  listOfTimes;

  async handlePanelsZmanim() {
    let i = 0;

    //console.log("handlePanelsZmanim");

    let zmanimList = this.dataP.theZmanimList;
    let subscriptionScroll:Subscription;
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
        
        if (subscriptionScroll && !subscriptionScroll.closed)
        {
        subscriptionScroll.unsubscribe();
        }
        await this.scrollPanel(this.panelRightContent,theZman.duration,subscriptionScroll);
        await this.goodSleep(theZman.durationAfter);
       
      
      }
    }
  }


  
 
  subscriptionScrollHanza:Subscription;

async scrollPanel(panel, duration,subscriptionScroll) {

return new Promise( (resolve)=>{

  var fps = 1000;
var minDelta = 0.5;

let totalDistance=panel.nativeElement.scrollHeight - panel.nativeElement.scrollTop - panel.nativeElement.offsetHeight;
let autoScrollSpeed=totalDistance/duration;

let  currentDelta = 0;
var currentTime, prevTime, timeDiff;
let timerScroll = timer(0, 1000/fps);



subscriptionScroll=timerScroll.subscribe(()=>
{
  if (this.stopAll || panel.nativeElement.scrollTop >= (panel.nativeElement.scrollHeight - panel.nativeElement.offsetHeight))
    {
      subscriptionScroll.unsubscribe();
     // console.log("UNSUBSCRIBED");
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
   // console.log(panel);
//    console.log("SCROLL INIT:"+scrollInit);

    while (!this.stopAll)
    {
        await this.scrollHorizontal(panel, scrollInit,this.dataP.theHanzahaSettings.duration);
        await this.goodSleep(this.dataP.theHanzahaSettings.durationAfter);
          //console.log(panel);
          this.hideHanzahot=true;
          await this.goodSleep(0.01);
          panel.nativeElement.scrollLeft=scrollInit;
          await this.goodSleep(0.1);

         this.hideHanzahot=false;
     
        }

  }

  scrollHorizontal(panel, scrollInit,duration)
  {
 //   console.log("STARTING THE SCROLL");
  //  console.log(scrollInit);
    
   
    var fps = 1000;
    var minDelta = 0.5;
    let totalDistance=scrollInit;
    let autoScrollSpeed=totalDistance/duration;

    return new Promise( (resolve)=>
    {
    //  console.log("STARTING THE SCROLL in PROMISE");
      let  currentDelta = 0;
      var currentTime, prevTime, timeDiff;
      let timerScroll = timer(0, 1000/fps);
      
      if (this.subscriptionScrollHanza && !this.subscriptionScrollHanza.closed)
      {
        this.subscriptionScrollHanza.unsubscribe();
      }

    this.subscriptionScrollHanza=timerScroll.subscribe(()=>
    {
      if (this.stopAll || panel.nativeElement.scrollLeft <= 0)
        {
          this.subscriptionScrollHanza.unsubscribe();
          resolve();
        }
        
        currentTime = Date.now();
        if (prevTime) {
                timeDiff = (currentTime - prevTime)/1000;
                currentDelta += autoScrollSpeed * timeDiff;
                if (currentDelta  >= minDelta) {
                  let val=Math.round(currentDelta);
                  currentDelta = (currentDelta)-val; //saves the decimal we didn't add (or added more)
                  panel.nativeElement.scrollLeft-=val;
                   prevTime = currentTime;
                }
        } else {
            prevTime = currentTime;
        }
        
        
      });

    });
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

  isNewHDateAndInfoUpdated=false;
  hDate;

  setHDateAndKzmanInfos() {
    let gDate = new Date();
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
  
   
    let dateForH=new Date();
   let zetHakohavim: Date = new Date(this.kzman["Tzais72Zmanis"]);
   if (dateForH.getTime()>zetHakohavim.getTime())
   {
    dateForH.setDate(dateForH.getDate()+1);
    this.hDate=new Hebcal.HDate(dateForH);

     if (!this.isNewHDateAndInfoUpdated)
     {
       this.updateDailyInfoAfterDateChange();
       this.isNewHDateAndInfoUpdated=true;
     }
   }
   else
   {
    this.hDate = new Hebcal.HDate(dateForH);
     this.isNewHDateAndInfoUpdated=false;
   }

   
  
   this.hDate.setLocation(Number.parseFloat(this.dataP.theGeneralSettings.lat), Number.parseFloat(this.dataP.theGeneralSettings.lng));
   this.currentParasha = "פרשת " + this.hDate.getSedra('h')[0];
 
   /*
          //console.log(this.currentParasha);
          //console.log(hdate.dafyomi('h'));
          //console.log(hdate.toString('h'));
          //console.log(hdate.tachanun_uf());
      */
      this.currentHDateStr = this.hDays[gDate.getDay()] + " " + this.hDate.toString('h');
      this.currentTimeStr = this.stringOfDate(new Date());
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

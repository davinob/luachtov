import { Component, ViewChild } from '@angular/core';



import Hebcal from "hebcal";
import KosherZmanim from "kosher-zmanim";
import { Storage } from '@ionic/storage';
import { DataService } from '../data.service';
import { Observable, Subscription, timer } from 'rxjs';
import { MenuController } from '@ionic/angular';



import * as halahayomit from '../contents/halahayomit'; 
import * as hilulayomit from '../contents/hilulayomit'; 
import * as omer from '../contents/omer'; 


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
//this.gDate = new Date(); //FOR TESTS!!!!!
    this.timerSub = this.timer.subscribe((val) => {

     
      this.setHDateAndKzmanInfos();

      if (firstTime)
      { 
        this.updateDailyInfoAfterDateChange();
        this.handlePanelsZmanim();
        this.handlePanelsShiurim();
        this.handlePanelsHanzahot();
       
      }
      firstTime=false;

    


    });

   
  }


  currentHalaha;
  hDates=[" ","א\'","ב\'","ג\'","ד\'","ה\'","ו\'","ז\'","ח\'","ט\'","י\'",
          "י\"א","י\"ב","י\"ג","י\"ד","ט\"ו","ט\"ז","י\"ז","י\"ח","י\"ט","כ\'",
          "כ\"א","כ\"ב","כ\"ג","כ\"ד","כ\"ה","כ\"ו","כ\"ז","כ\"ח","כ\"ט","ל\'"
          ];

  currentHilula;
  hDatesNoGersh=[" ","א","ב","ג","ד","ה","ו","ז","ח","ט","י",
          "יא","יב","יג","יד","טו","טז","יז","יח","יט","כ",
          "כא","כב","כג","כד","כה","כו","כז","כח","כט","ל"
          ];


          todayHMonthForHalahaAndHilula;
          todayHDate;
          todayHDateH;
          todayHDateNoGersh;
  
 currentMeda={
  omer:"",
  tahanun:"",
  dafYomi:"",
  moridHatal:"",
  barhenu:""
 };


 avanceDate()
 {
  this.gDate.setDate(this.gDate.getDate()+1);
  this.setHDateAndKzmanInfos();
  this.updateDailyInfoAfterDateChange();
 }

 reculeDate()
 {
  this.gDate.setDate(this.gDate.getDate()-1);
  this.setHDateAndKzmanInfos();
  this.updateDailyInfoAfterDateChange();
 }



 isDateAfterOrEqual(date1, date2):boolean
 {
   return date1.month>date2.month || (date1.month==date2.month && date1.day>=date2.day);
 }

 isDateBefore(date1, date2):boolean
 {
   return date1.month<date2.month || (date1.month==date2.month && date1.day<date2.day);
 }

 isEqual(date1, date2):boolean
 {
   return date1.month==date2.month && date1.day==date2.day;
 }

  updateDailyInfoAfterDateChange()
  {
    console.log("HILHOTYOMIOT TODAY");
    this.todayHMonthForHalahaAndHilula=this.hDate.getMonthName('h');

    
    if (this.todayHMonthForHalahaAndHilula.startsWith("אדר"))
    {
      this.todayHMonthForHalahaAndHilula="אדר"
    }
   // console.log("TODAY H MONTH:"+this.todayHMonthForHalahaAndHilula);
    this.todayHDate=this.hDate.getDate();
   // console.log("TODAY H DATE:"+this.todayHDate);
    this.todayHDateH=this.hDates[this.hDate.getDate()];
   // console.log("TODAY HH DATE:"+this.todayHDateH);  

    this.todayHDateNoGersh=this.hDatesNoGersh[this.hDate.getDate()];
   // console.log("TODAY HH DATE:"+this.todayHDateH);  


    this.currentHalaha=halahayomit.hilhotyomiot.
                            filter((halaha)=>halaha.month==this.todayHMonthForHalahaAndHilula && halaha.date==this.todayHDateH)
                            .pop();
    if (this.currentHalaha)
    {
     //   console.log(this.currentHalaha.date);
     //   console.log(this.currentHalaha.year);
     //   console.log(this.currentHalaha.title);
       // console.log(this.currentHalaha.content);
    }
   //   console.log("AFTER HILHOTYOMIOT");


   



      if (this.dataP.theGeneralSettings.eda=="sef")
      {
        if (this.hDate.omer()>0)
          this.currentMeda.omer=omer.omerSef[this.hDate.omer()-1] ;
      }
      else
      {

        if (this.hDate.omer()>0)
          this.currentMeda.omer=omer.omerAshk[this.hDate.omer()-1] ;
      }

      console.log(this.currentMeda.omer);
      console.log(this.hDate.omer());


      let dateOfBarehenu={day:15,month:1};
      console.log(dateOfBarehenu);
      let dateOfMashiv={day:22,month:7};
      console.log(dateOfMashiv);
      let dateOfBarehAlenu={day:7,month: 8};
      console.log(dateOfBarehAlenu);
      
      let calcHDate={day:this.hDate.getDate(), month:this.hDate.getMonth()};
      console.log(calcHDate);
     
      if (this.isDateAfterOrEqual(calcHDate,dateOfBarehAlenu)||this.isDateBefore(calcHDate,dateOfBarehenu))
      {
        this.currentMeda.moridHatal="משיב הרוח";
       
        if (this.dataP.theGeneralSettings.eda=="sef")
       {
        this.currentMeda.barhenu="ברך עלינו";
       }
       else
       {
        this.currentMeda.barhenu="ותן טל ומטר לברכה";
       }

       }
       else
       {
        let zetHakohavim: Date = new Date(this.kzman["Tzais72Zmanis"]); 
        let realGDate=this.todayDate();

        if (this.isEqual(calcHDate,dateOfBarehenu))
        {

          if (realGDate.getTime()>zetHakohavim.getTime())//we're only in the night, we don't want to set Morid Hatal yet
          {
            this.currentMeda.moridHatal="משיב הרוח";
            if (this.dataP.theGeneralSettings.eda=="sef")
            {
             this.currentMeda.barhenu="ברך עלינו";
            }
            else
            {
             this.currentMeda.barhenu="ותן טל ומטר לברכה";
            }

          }
          else
          {
            this.currentMeda.moridHatal="מוריד הטל";

            if (this.dataP.theGeneralSettings.eda=="sef")
              {
              this.currentMeda.barhenu="ברכינו";
              }
              else
              {
              this.currentMeda.barhenu="ותן ברכה";
              }
          }

        }
        else
        if (this.isEqual(calcHDate,dateOfMashiv))
        {
          console.log("ON MASHIV DAY");
          console.log(realGDate);
          console.log(zetHakohavim);
          if (realGDate.getTime()>zetHakohavim.getTime()) //we're only in the night, we don't want to set Mashiv yet 
          {
            this.currentMeda.moridHatal="מוריד הטל";

            if (this.dataP.theGeneralSettings.eda=="sef")
              {
              this.currentMeda.barhenu="ברכינו";
              }
              else
              {
              this.currentMeda.barhenu="ותן ברכה";
              }

          }
          else
          {
            this.currentMeda.moridHatal="משיב הרוח";
            if (this.dataP.theGeneralSettings.eda=="sef")
            {
             this.currentMeda.barhenu="ברכינו";
            }
            else
            {
             this.currentMeda.barhenu="ותן ברכה";
            }
          }
      
        }
        else
        {

        if (this.dataP.theGeneralSettings.eda=="sef")
        {
         this.currentMeda.barhenu="ברכינו";
        }
        else
        {
         this.currentMeda.barhenu="ותן ברכה";
        }


          if (this.isDateBefore(calcHDate,dateOfMashiv))
        {
          this.currentMeda.moridHatal="מוריד הטל";
        }
        else
        {
          this.currentMeda.moridHatal="משיב הרוח";
        }
      }
    } 
   //   currentMeda.moridHatal=
    //  currentMeda.barhenu
     
    let taha=true;
    console.log(this.hDate.tachanun_uf());
     if (this.isAfterMinha)
     {
       //check tomorrow:
       let tmpDate=this.todayDate();
       tmpDate.setDate(tmpDate.getDate()+1);
       let tmpHDate=new Hebcal.HDate(tmpDate);
     
      if (this.hDate.tachanun_uf().all_congs && tmpHDate.tachanun_uf().all_congs)
        taha=this.hDate.tachanun_uf().mincha;
      else
       taha=this.hDate.tachanun_uf().all_congs && tmpHDate.tachanun_uf().all_congs;

      }
     else
     {
       if (this.hDate.tachanun_uf().all_congs)
        taha=this.hDate.tachanun_uf().shacharit;
      else
       taha=this.hDate.tachanun_uf().all_congs;
   
      }

     if (taha)
     {
      this.currentMeda.tahanun="אומרים תחנון";
     }
    else
    {
      this.currentMeda.tahanun="אין אומרים תחנון";
    }

     this.currentMeda.dafYomi=this.hDate.dafyomi('h');
    

    //console.log(this.currentParasha);
      //console.log(hdate.dafyomi('h'));
      //console.log(hdate.toString('h'));
      //console.log(hdate.tachanun_uf());

    
    
  }

  setCurrentHilula()
  {
    let todayPossibleHilulot:Array<any>=hilulayomit.hilulotyomiot.
    filter((hilula)=>hilula.month==this.todayHMonthForHalahaAndHilula && hilula.date==this.todayHDateNoGersh);
    
    let randomIndex=Math.round(Math.random()*(todayPossibleHilulot.length-1));
    
    console.log("num of hiloulot for today:"+todayPossibleHilulot.length);
    console.log(randomIndex);
    this.currentHilula= todayPossibleHilulot.filter((val,index)=> index==randomIndex)
    .pop();

if (this.currentHilula)
{
console.log(this.currentHilula.rav);
console.log(this.currentHilula.description);

}
console.log("AFTER HILULOTYOMIOT");
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

        if (this.currentShiur.type=="הילולות")
        {
          this.setCurrentHilula(); 
        }

        if (this.currentShiur.type=="הלכה" && !this.currentHalaha)
        {
          continue;
        }

        await this.goodSleep(0.2);
      

        if (subscriptionScroll && !subscriptionScroll.closed)
        {
        subscriptionScroll.unsubscribe();
        }

        await this.scrollPanel(this.panelLeftContent,theShiur.scrollSpeed,subscriptionScroll);
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
        await this.scrollPanel(this.panelRightContent,theZman.scrollSpeed,subscriptionScroll);
        await this.goodSleep(theZman.durationAfter);
       
      
      }
    }
  }


  
 
  subscriptionScrollHanza:Subscription;

async scrollPanel(panel, autoScrollSpeed,subscriptionScroll) {

return new Promise( (resolve)=>{

  var fps = 1000;
var minDelta = 0.5;

//console.log("SPEED for PANEL "+ panel+ ":"+autoScrollSpeed);

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
        await this.scrollHorizontal(panel, this.dataP.theHanzahaSettings.scrollSpeed);
        await this.goodSleep(this.dataP.theHanzahaSettings.durationAfter);
          //console.log(panel);
          this.hideHanzahot=true;
          await this.goodSleep(0.01);
          panel.nativeElement.scrollLeft=scrollInit;
          await this.goodSleep(0.1);

         this.hideHanzahot=false;
     
        }

  }

  scrollHorizontal(panel, autoScrollSpeed)
  {
 //   console.log("STARTING THE SCROLL");
  //  console.log(scrollInit);
    
   
    var fps = 1000;
    var minDelta = 0.5;
    
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
  isAfterMinhaAndInfoUpdated=false;
  isAfterMinha=false;
  
  hDate;
  gDate;

  todayDate():Date
  {
    return new Date();
  }

  setHDateAndKzmanInfos() {
    this.gDate = this.todayDate() ;

    let zOptions = {
        date: this.gDate,
        timeZoneId: this.dataP.theGeneralSettings.zoneId,
        locationName: "Netanya",
        latitude: Number.parseFloat(this.dataP.theGeneralSettings.lat),
        longitude: Number.parseFloat(this.dataP.theGeneralSettings.lng),
        complexZmanim: true
      }
   let kzmanim = new KosherZmanim(zOptions);
   this.kzman = kzmanim.getZmanimJson().Zmanim;
  //zmanim of gDate (previous date even if after tzeit hakohavim)
   
   
   let zetHakohavim: Date = new Date(this.kzman["Tzais72Zmanis"]); 
 
   if (this.gDate.getTime()>zetHakohavim.getTime())
   {
    this.gDate.setDate(this.gDate.getDate()+1);
    this.hDate=new Hebcal.HDate(this.gDate);

     if (!this.isNewHDateAndInfoUpdated)
     {
       this.updateDailyInfoAfterDateChange();
       this.isNewHDateAndInfoUpdated=true;
     }
   }
   else
   {
    this.hDate = new Hebcal.HDate(this.gDate);
     this.isNewHDateAndInfoUpdated=false;
   }

   let minhaGedola: Date = new Date(this.kzman["MinchaGedola"]); 
 
   this.isAfterMinha=(this.gDate.getTime()>minhaGedola.getTime());

   if (this.isAfterMinha)
   {
     if (!this.isAfterMinhaAndInfoUpdated)
     {
       this.updateDailyInfoAfterDateChange();
       this.isAfterMinhaAndInfoUpdated=true;
     }
   }
   else
   {
     this.isAfterMinhaAndInfoUpdated=false;
   }

   
  
   this.hDate.setLocation(Number.parseFloat(this.dataP.theGeneralSettings.lat), Number.parseFloat(this.dataP.theGeneralSettings.lng));
   this.currentParasha = "פרשת " + this.hDate.getSedra('h')[0];
 
   /*
          //console.log(this.currentParasha);
          //console.log(hdate.dafyomi('h'));
          //console.log(hdate.toString('h'));
          //console.log(hdate.tachanun_uf());
      */
      this.currentHDateStr = this.hDays[this.gDate.getDay()] + " " + this.hDate.toString('h');
      this.currentTimeStr = this.stringOfDate(this.todayDate());
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

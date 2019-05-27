import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';



export interface Zmanim
{
id:number,
enabled:boolean,
name:string,
duration:number,
list:Array<any>,
tmpName?:string,
tmpValue?:any,
tmpType?:any,
tmpRelation?:any
}

export interface Hanzaha
{
id:number,
type:string,
text:string,
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

 
stillInInit:BehaviorSubject <boolean>=new BehaviorSubject (true);
  
  autoZmanim=[
  {name:"Alos72Zmanis",description:"עלות השחר",description0:"עלות השחר הרב עובדיה",isChecked:false},
  {name:"Alos16Point1Degrees",description:"עלות השחר",description0:"עלות השחר הרב פוזן",isChecked:true},
  {name:"Misheyakir10Point2Degrees",description:"משיכיר",description0:"משיכיר אוצרות ירושלים",isChecked:false},
  {name:"Misheyakir11Degrees",description:"משיכיר",description0:"משיכיר הרב פוזן",isChecked:true},
  {name:"Sunrise",description:"הנץ החמה",description0:"הנץ החמה",isChecked:true},
  {name:"SofZmanShmaMGA",description:"סוף זמן שמע מ\"א",description0:"סוף זמן שמע מ\"א",isChecked:true},
  {name:"SofZmanShmaGRA",description:"סוף זמן שמע גר\"א",description0:"סוף זמן שמע גר\"א",isChecked:true},
  {name:"SofZmanTfilaMGA",description:"סוף זמן תפילה מ\"א",description0:"סוף זמן תפילה מ\"א",isChecked:true},
  {name:"SofZmanTfilaGRA",description:"סוף זמן תפילה גר\"א",description0:"סוף זמן תפילה גר\"א",isChecked:true},
  {name:"Chatzos",description:"חצות היום",description0:"חצות היום",isChecked:true},
  {name:"MinchaGedola",description:"מנחה גדולה",description0:"מנחה גדולה",isChecked:true},
  {name:"MinchaKetana",description:"מנחה קטנה",description0:"מנחה קטנה",isChecked:true},
  {name:"PlagHamincha",description:"פלג המנחה",description0:"פלג המנחה",isChecked:true},
  {name:"Sunset",description:"שקיעת החמה",description0:"שקיעת החמה",isChecked:true},
  {name:"Tzais72Zmanis",description:"צאת הכוכבים",description0:"צאת הכוכבים",isChecked:true},
  {name:"TzaisGeonim7Point083Degrees",description:"צאת הכוכבים ר\"ת",description0:"צאת הכוכבים ר\"ת",isChecked:true}];

theZmanimList=[
{id:0,enabled:true,name:"זמני היום",duration:50,durationAfter:5,list:this.autoZmanim},
{id:1,enabled:false,name:"זמני תפילות חול",duration:10,durationAfter:5,list:[]},
{id:2,enabled:false,name:"זמני תפילות שבת",duration:10,durationAfter:5,list:[]},
{id:3,enabled:false,name:"זמני שיעורים חול",duration:10,durationAfter:5,list:[]},
{id:4,enabled:false,name:"זמני שיעורים שבת",duration:25,durationAfter:5,list:[]},
{id:5,enabled:false,name:"זמני היום ....",duration:10,durationAfter:5,list:[]},
{id:6,enabled:false,name:"..... זמני היום",duration:10,durationAfter:5,list:[]}
];


theShiurimList=[
{id:0,enabled:false,name:"מידע של היום", type:"meyda", duration:20,durationAfter:5},
{id:1,enabled:false,name:"הילולות היום", type:"hiloulot",duration:10,durationAfter:5},
{id:2,enabled:true,name:"הלכה יומית", type:"halaha",duration:30,durationAfter:5},
{id:3,enabled:false,name:"זמני שיעורים חול", type:"dummy1",duration:10,durationAfter:5},
{id:4,enabled:false,name:"זמני שיעורים שבת", type:"dummy2",duration:25,durationAfter:5},
{id:5,enabled:false,name:"זמני היום ....", type:"dummy3",duration:10,durationAfter:5},
{id:6,enabled:false,name:"..... זמני היום", type:"dummy4",duration:10,durationAfter:5}
];


theGeneralSettings={lat:"31.777960", lng:"35.235980", zoneId:"Asia/Jerusalem"};

theHanzahotList:Array<Hanzaha>=[];
theHanzahaSettings={duration:10, durationAfter:5};

  constructor(public storage:Storage) {
    //console.log("DATA SERVICE");
    this.init();
  }



  async init()
  {
    await this.storage.ready();
    console.log("STORAGE READY");
    await this.initFromStorage('theZmanimList');
    await this.initFromStorage('theGeneralSettings');
    await this.initFromStorage('theHanzahaSettings');
    await this.initFromStorage('theHanzahotList');
    console.log(this.theHanzahaSettings);
    this.stillInInit.next(false);
   
  }

  
async initFromStorage(key){
  console.log("INIT FROM STORAGE"+ key);
  let tempZ0=await this.storage.get(key);
  console.log(key);
  if (tempZ0)
  {
   this[key]=tempZ0;
  }
  else
  {
    this.storage.set(key,this[key]);
  }
}

async resetFromStorage(key)
{
  this[key]=await this.storage.get(key);
}

setInStorage(key,value)
{
  this.storage.set(key,value);
}

}

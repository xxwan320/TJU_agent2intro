import { MapBudget, MAP_DAILY_LIMITS } from '../transport/map-budget';
// Keep M's in-memory rate/concurrency guards across A view/campus changes.
let current:{day:string;budget:MapBudget}|null=null;
export function productionMapBudget():MapBudget {
 const day=new Date().toLocaleDateString('en-CA');
 if(!current||current.day!==day)current={day,budget:new MapBudget({limits:MAP_DAILY_LIMITS,scope:'daily-'+day})};
 return current.budget;
}

//

function isNumber(value:any):boolean{
  return ((value ^ 0) == value);
}

function hasFlag(e:number, value:number):boolean{
  return ((e & value) == value);
}

function isNullOrEmpty(text:string){
  return (text == null || text == "");
}

function format(format:string, ...args) {
  return format.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

function contains<T>(arr: T[], elem: T):boolean {
  return (arr.indexOf(elem) != -1);
}

function select<T,S>(arr: T[], func: (elem:T)=>S):S[] {
  var result:S[] = [];
  arr.forEach(x => { result.push(func(x)); });
  return result;
}

function where<T>(arr: T[], pred: (elem:T)=>boolean):T[] {
  var result:T[] = [];
  arr.forEach(x => { if(pred(x)) result.push(x); });
  return result;
}

function first<T>(arr: T[], pred?: (elem:T)=>boolean):T{
  if(pred == null){
    return (arr.length == 0) ? null : arr[0];
  }
  for(var i=0;i< arr.length;i++){
    if(pred(arr[i]))
      return arr[i];
  }
  return null;
}

function centerAbsolute(obj: JQuery){
  obj.css({ position: "absolute", left: "50%", top: "50%" });
}

function padLeft(data: any, ch: string, length: number):string{
  var text = data.toString();
  while(text.length < length){
    text = ch + text;
  }
  return text;
}

function filterElements(obj: JQuery){
  return obj.filter(function(index, elem) { return elem.nodeType == Node.ELEMENT_NODE; });
}

function toInt(obj: any){
  return parseInt(obj);
}

function jsonQuery(url: string, getData, postData = null):JQueryPromise<any>{
  var res = $.Deferred();
  var completeUrl = url;
  if(!$.isEmptyObject(getData)){
    completeUrl += "?" + $.param(getData);
  }
  var settings: JQueryAjaxSettings = {
    url: completeUrl,
    cache: false
  };
  if(postData != null){
    settings.type = 'POST';
    settings.contentType = "application/json";
    settings.data = JSON.stringify(postData);
  }                            
  $.ajax(settings).then(
   (data) => res.resolve(data),
   (req: XMLHttpRequest) => {
     console.log("ajax error:", req);
     var errorText;
     if (req.readyState == 4) {
       errorText = req.statusText;
     } else if (req.readyState == 0) {
       errorText = "Connection refused";
     } else {
       errorText = "Unknown error";
     }
     res.reject(req.readyState, errorText); 
   });
  return res;
}

function asyncResult<T>(value?:T):JQueryPromise<T>{
  return $.Deferred().resolve(value);
}

function parallel(funcs:JQueryPromise<any>[]):JQueryPromise<any>{
  return $.when.apply($, funcs);
}

function execute(...funcs):JQueryPromise<any>{
  var def:JQueryPromise<any> = $.Deferred().resolve();
  funcs.forEach(x => { def = def.then(x); });
  return def;
}

function executeIf(cond: boolean, ...funcs):JQueryPromise<any>{
  if(cond){
    var def:JQueryPromise<any> = $.Deferred().resolve();
    funcs.forEach(x => { def = def.then(x); });
    return def;
  }
  return asyncResult();
}

function parEach<T>(arr: T[], func: (elem:T)=>JQueryPromise<any>):JQueryPromise<any>{
  var defs:JQueryPromise<any>[] = [];
  arr.forEach(x => defs.push(func(x)));
  return parallel(defs);
}

function wait(time: number):JQueryPromise<any>{
  if(time == 0)
    return asyncResult();
  var def:JQueryDeferred<any> = $.Deferred();
  setTimeout(() => { def.resolve() }, time);
  return def.promise();
}
 
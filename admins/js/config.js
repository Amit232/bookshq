function getBaseURL () {
   var url=location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
   var pathArray = window.location.pathname.split( '/' );
   url=url+pathArray[1];
   return url;
}
function getSITEURL(){
   var url=location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
   return url;
}
var BASE_URL=getBaseURL()+'/api/';
var COMMON_URL=BASE_URL;
var SITE_URL=getBaseURL()+'/api/';;
var BASE_URL_NEW=getBaseURL();
var DUE_DAYS=20;
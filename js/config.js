function getBaseURL () {
   var url=location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
   var pathArray = window.location.pathname.split( '/' );
   url=url+pathArray[1];
   return url;
}
var version = "v="+1.0;
var BASE_URL=getBaseURL()+'/api/';
var COMMON_URL=BASE_URL;
var SITE_URL=BASE_URL;
var BASE_URL_NEW=getBaseURL()+'/';
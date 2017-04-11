var bookApp = angular.module('bookApp', ['ui.router','ui.bootstrap','ngCookies','ngSanitize','timer','ngAnimate']);
var interval =null;

var validateOptions= {
  errorElement: 'em',
  errorClass: 'invalid',
  highlight: function(element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass);
      $(element).parent().addClass('state-error').removeClass('state-success');

  },
  unhighlight: function(element, errorClass, validClass) {
      $(element).removeClass(errorClass).addClass(validClass);
      $(element).parent().removeClass('state-error').addClass('state-success');
  },
  errorPlacement : function(error, element) {
      error.insertAfter(element);
  }
}
bookApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
function makeid(m)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < m; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
// configure our routes
bookApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
                // route for the login page
                .state('home',{
                        url: '/',
                        templateUrl : 'pages/home.html',
                        controller  : 'homeCtrl',
                        title: 'Rent and Lend books Online in Bangalore. Earn money by lending books'
                })
                .state('products',{
                        url: '/products',
                        templateUrl : 'pages/products.html',
                        controller  : 'productCtrl',
                        title: 'Rent or Lend books at the cheapest price in India | chainreaders.in'
                })
                .state('productsdetail',{
                        url: '/products/:id_category',
                        templateUrl : 'pages/products.html',
                        controller  : 'productCtrl',
                        title: 'Rent or Lend books at the cheapest price in India | chainreaders.in'
                })
                .state('singleproductsdetail',{
                        url: '/product/:id_product',
                        templateUrl : 'pages/product_details.html',
                        controller  : 'singleProductCtrl',
                        title: 'Rent or Lend books at the cheapest price in India | chainreaders.in'
                })
                .state('basket',{
                        url: '/basket',
                        templateUrl : 'pages/basket.html',
                        controller  : 'basketCtrl',
                        title: 'Basket'
                })
                .state('orders',{
                        url: '/orders',
                        templateUrl : 'pages/orders.html',
                        controller  : 'ordersCtrl',
                        title: 'Your Orders'
                })
                .state('register',{
                        url: '/register',
                        templateUrl : 'pages/register.html',
                        controller  : 'registerCtrl',
                        title: 'Register'
                })
                .state('faq',{
                        url: '/faq',
                        templateUrl : 'pages/faq.html',
                        controller  : 'faqCtrl',
                        title: 'FAQ'
                }) 
                .state('aboutus',{
                        url: '/aboutus',
                        templateUrl : 'pages/about_us.html',
                        controller  : 'aboutUsCtrl',
                        title: 'About us'
                })
                .state('termsconditions',{
                        url: '/terms-and-conditions',
                        templateUrl : 'pages/terms.html',
                        controller  : 'termsCtrl',
                        title: 'Terms & Conditions'
                })
              /*  // route for the instruction page
                .state('instruction',{
                        url: '/instruction',
                        templateUrl : 'pages/instruction.html',
                        controller  : 'instructionCtrl',
                        title: 'Exam Instruction'
                })

                // route for the exam page
                .state('exam',{
                        url: '/exam',
                        templateUrl : 'pages/exam.html',
                        controller  : 'examCtrl',
                        title: 'Exam'
                })*/
});
bookApp.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location, $rootScope){
        return {
            request: function (config) {
                config = config || {};
                if (config.timeout === undefined && !config.noCancelOnRouteChange) {
                  config.timeout = 5000;
                }
                return config;
              },
            response: function(response){
                $rootScope.offline = false;
                if (response.status === 401) {
                    $location.path('/');
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/');
                }
                if (rejection.status === 0) {
                }
                else
                    $rootScope.offline = false;
                return $q.reject(rejection);
            }
        }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}
bookApp.directive('responsiveVideo', responsiveVideo);
bookApp.run(function ($location, $rootScope, $state, $stateParams,$http,$cookies,$templateCache,$interval,$window,$sce,$timeout) {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // //console.log('$rootScope.user_role',$rootScope.user_role);
            
        })
        $rootScope.amoutPerRent = 29;
        $rootScope.enableSignIn=true;
        console.log($cookies.email,$cookies.id_user)
        $rootScope.getNotifications=function(id_user){
            $http({
                method: "get",
                timeout:60000,                                    
                url: SITE_URL+'getNotifications',
                params:{'id_user':id_user},
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (data,status) {
                    $rootScope.notifications=[];
                    if(angular.isDefined(data.notifications)){
                        angular.forEach(data.notifications,function(m){
                            if(m.message!=''){
                                var obj={};
                                obj.message= m.message;
                                obj.name=m.name;
                                obj.id_product = m.id_project;
                                $rootScope.notifications.push(obj);
                            }
                        })
                    }
                    $cookies.notifications=JSON.stringify($rootScope.notifications);
                });
        }
        if(angular.isDefined($cookies.email)&&$cookies.email&&$cookies.id_user)
        {
            var randomSting= makeid(40);
            $cookies.csrf_token=randomSting;
            $http.defaults.headers.common['Csrf-Token']   = $cookies.csrf_token;
            $http.defaults.headers.common['id_user']   = $cookies.id_user;
            $rootScope.enableSignIn=false;
            $rootScope.loggedUserDetails = $cookies;
            $rootScope.notifications=[];
            $rootScope.getNotifications($cookies.id_user);

        }
        var a =[];
        $rootScope.cartProducts=angular.copy(a);
              
      /* $http.defaults.headers.common['X-Csrf-Token']   = $cookies.csrf_token;
        $http.defaults.headers.common['X-Id-Exam']   = $cookies.id_exam;
        $http.defaults.headers.common['X-Id-Exam-Has-Student']   = $cookies.id_exam_has_student;
      
        var loc=$location.path();*/
        var carts = localStorage.getItem('carts');
        if(angular.isDefined(carts)&&carts!=''){
            carts = JSON.parse(carts);
            $rootScope.cartProducts = carts;
        }
        $rootScope.getUserCart=function(){
            $http({
            method: "get",
            timeout:60000,                                    
            url: SITE_URL+'getUserProducts',
            params : {'id_user':$cookies.id_user},
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                    $rootScope.cartProducts = data;
                    var carts = $rootScope.cartProducts;
                    localStorage.removeItem('carts');
                    localStorage.setItem('carts',JSON.stringify(carts));   
            }); 
        }
        if($cookies.id_user != undefined)
        {
          $rootScope.getUserCart();
        }
        else
        {
        }
        $rootScope.logout = function(){
             $rootScope.enableSignIn=true;
            angular.forEach($cookies, function (cookie, key) {
                delete $cookies[key];                
            });
            $http.defaults.headers.common['Csrf-Token']='';
            $http.defaults.headers.common['Google_Id']='';
            $http.defaults.headers.common['id_user']='';
            $rootScope.cartProducts = [];
            localStorage.removeItem('carts');
            //$location.path('/');
            $timeout(function() {
                $window.location.reload();
            }, 10);
            var auth2 = gapi.auth2.getAuthInstance();
            if(angular.isDefined(auth2)){
              auth2.signOut().then(function () {
                localStorage.removeItem('carts');
                var a =[];
                $rootScope.cartProducts=angular.copy(a);
                

              });   
            }
            else{
                localStorage.removeItem('carts');
                 var a =[];
                $rootScope.cartProducts=angular.copy(a);
                

            }
        } 
        $rootScope.tableDatas=[];
        $rootScope.abc=[];
        $rootScope.addTableData=function(data)
        {
            $rootScope.tableDatas.push(data);
        }
        $rootScope.removeTableData=function(index){
            $timeout(function() {
                $rootScope.tableDatas.splice(index,1);
                $rootScope.abc.splice(index,1);
            }, 1);
        }
        $rootScope.to_trusted = function (html_code) {
            return $sce.trustAsHtml(html_code);
        }
        $rootScope.redirectToProducts=function(c){
            //console.log(c);
            $location.path('products/'+c.id_category)
        }
        $rootScope.getCategories =function () {
            $http({
                    method: "get",
                    timeout:60000,                                    
                    url: SITE_URL+'getCategories',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                    }).success(function (data,status) {
                        $rootScope.categories = data.categories;
                    });
        }
        $rootScope.getCategories(); 
        var screenWidth = $window.innerWidth;
        if (screenWidth < 700){
            $rootScope.includeMobileTemplate = true;
        }else{
            $rootScope.includeDesktopTemplate = true;
            $rootScope.includeMobileTemplate = false;

        }
        $rootScope.includeMobileTemplate1=""

        $rootScope.submitLenderProduct = function(data){
          $('#lender_books1').validate(angular.extend({
            // Rules for form validation
            rules: {
                lender_book: {
                  required: true,
                  maxlength:256,
                }
            },
            // Messages for form validation
            messages: {
                lender_book : {
                        required : '<center><i style="color:red">Please enter book name</i></center>'
                }
            }

            },validateOptions));  

            if($('#lender_books1').valid()&&data!=undefined){
                $http({
                        method: "post",
                        timeout:60000,                                    
                        url: SITE_URL+'uploadLenderBook',
                        data:$.param({'books':data,'id_user':$cookies.id_user}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                        }).success(function (data,status) {
                        if(status==200)
                        {
                            $('body').removeClass('modal-open');
                            //alert(data.message);
                            if(data.message=='closepoup'){
                                $('body').removeClass('modal-open');
                                $(".close").trigger('click');
                                $rootScope.tableDatas=[];
                                $rootScope.abc=[];
                            }else{
                                /*swal({
                                  title: '',
                                  text: 'We will contact you via mail, once we receive an order for your book',
                                  timer: 5000
                                })*/
                                $.toast({
                                    text: "We will contact you via mail, once we receive an order for your book", // Text that is to be shown in the toast
                                    showHideTransition: 'slide', // fade, slide or plain
                                    allowToastClose: true, // Boolean value true or false
                                    hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                                    position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                                    bgColor: '#000000',  // Background color of the toast
                                    textColor: '#ffffff',  // Text color of the toast
                                    textAlign: 'center',  // Text alignment i.e. left, right or center
                                    loader: false,  // Whether to show loader or not. True by default
                                    loaderBg: '#ffffff',  // Background color of the toast loader
                                });
                                $(".close").trigger('click');
                                $rootScope.tableDatas=[];
                                $rootScope.abc=[];
                            }
                        }
                }).error(function(data,status){
                    $('body').removeClass('modal-open');
                    $(".close").trigger('click'); 
                });   
            }

        }
        $rootScope.searchString='';
        $rootScope.seachProducts=function(){
            var loc= $location.path();
            if(loc.search('/products')>-1)
            {
                var a=[];
                $rootScope.categoriesIds = angular.copy(a);
 
                $rootScope.getAllProducts();
            }
            else{
                var a=[];
                $rootScope.categoriesIds = angular.copy(a);

                if($rootScope.searchString!='')
                $location.path('/products');
            }
        }
        var nav = $('.navbar');
        $rootScope.myInterval = 3000;
        $rootScope.slides = [
            {
              image: './img/home/6.jpg'
            },
            {
              image: './img/home/6.jpg'
            },
            {
              image: './img/home/6.jpg'
            },
            {
              image: './img/home/6.jpg'
            }
        ];
        $rootScope.subscribeUser= function(user){
           $rootScope.subscribedmessageshow = false;

            $('#subscribe').validate(angular.extend({
            // Rules for form validation
            rules: {
                subscriber: {
                    required: true,
                    email:true
                }
            },
            // Messages for form validation
            messages: {
                subscriber : {
                        required : '<center><i style="color:red">Subscriber email cannot be blank</i></center>',
                }
            }

            },validateOptions));
            if($('#subscribe').valid()){
                $http({
                    method: "POST",
                    timeout:60000,                                    
                    url: SITE_URL+'addSubScriber',
                    data : $.param({'user':user}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (data,status) {
                    if(status==200){
                        $rootScope.message =data.message;
                        $rootScope.subscribedmessageshow = true;
                        $timeout(function() {
                            $("#subscriber").val('');
                            $rootScope.message="";
                            $rootScope.subscribe_user ="";
                            $rootScope.subscribedmessageshow =false;
                        }, 5000);
                    }
                }).error(function(data,status){
                        $rootScope.subscribedmessageshow = false;

                });
            }
        }
        // $(window).scroll(function () {
        //     /*var scroll = $(this).scrollTop();
        //     var topDist = $("#navbar").position();
        //     if (scroll > topDist.top) {
        //         $('#navbar').css({"position":"fixed","top":"0","z-index": "9999","width":"100%"});
                
        //     } else {
        //         $('#navbar').css({"position":"static","top":"auto"});
        //     }*/

        //     var scroll = $(this).scrollTop();
        //     var topDist = $("#container1").position();
        //     if (scroll > topDist.top) {
        //         $('#container1').css({"position":"fixed","top":"0","z-index": "9999","width":"100%","background-color":"#222"});
                
        //     } else {
        //         $('#container1').css({"position":"static","top":"auto"});
        //     }
        // });

bookApp.filter('myDateFormatNew', function myDateFormat($filter){
  return function(text){
    if(text!='')
    {
    var  tempdate= new Date(text.replace(/-/g,"/"));
    return $filter('date')(tempdate, "dd-MM-yyyy");
    }
    else
    return '';    
  }
});
$rootScope.applyActiveColor=function(id,index){
    $('ul li a').click(function(){
        $('li a').removeClass("activecolor");
        $('li a').removeClass("active");
        $("#home").removeClass('activecolor');
        $("#sneakin").removeClass('activecolor');
        $("#home").removeClass('active');
        $("#sneakin").removeClass('active');
    });
    if(id!=''&&(index!=''||index==0)){
        $("#"+id+"_"+index).addClass('activecolor');
        $("#home").removeClass('activecolor');
        $("#sneakin").removeClass('activecolor');
    }
    if(id!=''&&(id=='home'||id=='sneakin')){
        if(id=='home'){
            $("#return-to-top").trigger('click');
        }
        $("#"+id).addClass('activecolor');
    }
    if(id==''&&index==''){
        $("#home").addClass('activecolor');
    }

}
//$rootScope.applyActiveColor('','')
$rootScope.registerorloginClick=function(type){
    $rootScope.registerLinkType=type;
    $rootScope.signupisClicked=false;
                    $rootScope.signupbtn=false;
                    $rootScope.signupisClicked1=false;
}
$rootScope.newUSer={};
$rootScope.registerD=function(newUser)
{
     $('#register1').validate(angular.extend({
            // Rules for form validation
            rules: {
                name1: {
                    required: true,
                    maxlength:64,
                },
                email1: {
                  required: true,
                  email:true,
                  maxlength:64,
                },
                 password1 : {
                        required : true,
                        maxlength:64,
                }
            },
            // Messages for form validation
            messages: {
                name1 : {
                        required : '<center><i style="color:red">Name cannot be blank</i></center>',
                },
                email1 : {
                        required : '<center><i style="color:red">Email cannot be blank</i></center>',
                        email: '<center><i style="color:red">Enter valid email id</i></center>'
                },
                password1 : {
                        required : '<center><i style="color:red">Password cannot be blank</i></center>'
                }
            }

        },validateOptions));

    if($('#register1').valid()&&angular.isDefined(newUser)&&newUser!='')
    {

        $http({
            method: "POST",
            timeout:60000,                                    
            url: SITE_URL+'registerNewUser',
            data : $.param({'user':newUser}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    //alert(data.message);
                    $('body').removeClass('modal-open');
                    $("#modalsignup").modal('hide');
                    $rootScope.signupisClicked=false;
                    $rootScope.signupbtn=false;
                    $rootScope.signupisClicked1=false;
                    /*$.toast({
                      heading: '',
                      text: data.message,
                      icon: 'success',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
                    });*/
                   /* swal({
                              title: '',
                              text: data.message,
                              timer: 5000
                            })*/
                    $.toast({
                          text:data.message, // Text that is to be shown in the toast
                          showHideTransition: 'slide', // fade, slide or plain
                          allowToastClose: true, // Boolean value true or false
                          hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                          stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                          position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                          bgColor: '#000000',  // Background color of the toast
                          textColor: '#ffffff',  // Text color of the toast
                          textAlign: 'center',  // Text alignment i.e. left, right or center
                          loader: false,  // Whether to show loader or not. True by default
                          loaderBg: '#ffffff',  // Background color of the toast loader
                    });
                    $rootScope.newUSer={};
                    $rootScope.cartProducts=angular.copy(data.user_cart_details);
                    var carts = $rootScope.cartProducts;
                    localStorage.removeItem('carts');
                    localStorage.setItem('carts',JSON.stringify(carts));   
                }
        }).error(function(data,status){
            if(status==403)
                {
                    //alert(data.message);
                   
                   /* swal({
                      title: '',
                      text: data.message,
                      timer: 5000
                    })*/
                    $.toast({
                          text:data.message, // Text that is to be shown in the toast
                          icon: 'error',
                          showHideTransition: 'slide', // fade, slide or plain
                          allowToastClose: true, // Boolean value true or false
                          hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                          stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                          position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                          bgColor: '#000000',  // Background color of the toast
                          textColor: '#ffffff',  // Text color of the toast
                          textAlign: 'center',  // Text alignment i.e. left, right or center
                          loader: false,  // Whether to show loader or not. True by default
                          loaderBg: '#ffffff',  // Background color of the toast loader
                    });

                   
                }
        });
    }
}

$rootScope.normalLoginD = function(email,password)
{  //alert('ff');
     $('#normalLogin').validate(angular.extend({
            // Rules for form validation
        rules: {
            email2: {
              required: true,
              email:true,
              maxlength:64,
            },
             password2 : {
                    required : true,
                    maxlength:64,
            }
        },
        // Messages for form validation
        messages: {
            email2 : {
                    required : '<center><i style="color:red">Email cannot be blank</i></center>',
                    email: '<center><i style="color:red">Enter valid email id</i></center>'
            },
            password2 : {
                    required : '<center><i style="color:red">Password cannot be blank</i></center>'
            }
        }

    },validateOptions)); 
       
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!='')
    {
        //alert('You are alredy logged in to application');
       /* $.toast({
          heading: '',
          text: 'You are alredy logged in to application',
          icon: 'success',
          showHideTransition: 'slide',
          hideAfter: 5000,
          loader: true,
          allowToastClose: true,
          position: 'top-right',
        });*/
        /*swal({
          title: '',
          text: 'You are alredy logged in to application',
          timer: 5000
        })*/
        $.toast({
              text:'You are alredy logged in to application', // Text that is to be shown in the toast
              icon: 'info',
              showHideTransition: 'slide', // fade, slide or plain
              allowToastClose: true, // Boolean value true or false
              hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
              stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              bgColor: '#000000',  // Background color of the toast
              textColor: '#ffffff',  // Text color of the toast
              textAlign: 'center',  // Text alignment i.e. left, right or center
              loader: false,  // Whether to show loader or not. True by default
              loaderBg: '#ffffff',  // Background color of the toast loader
        });
        return false;
    }
    else
    {
        if($('#normalLogin').valid()&&email!=''&&password!='')
        {
            $http({
            method: "POST",
            timeout:60000,                                    
            url: SITE_URL+'loginAsUser',
            data : $.param({'email':email,'password':password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    //alert(data.message);
                    $('body').removeClass('modal-open');
                    $("#modalsignup").modal('hide');
                    $rootScope.signupisClicked=false;
                    $rootScope.signupbtn=false;
                    $rootScope.signupisClicked1=false;
                    /*$.toast({
                      heading: '',
                      text: data.message,
                      icon: 'success',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
                    });*/
                    /*swal({
                      title: '',
                      text: data.message,
                      timer: 5000
                    })*/
                    $rootScope.enableSignIn=false;
                    angular.forEach($cookies, function (cookie, key) {
                        delete $cookies[key];                
                    });
                    $http.defaults.headers.common['Csrf-Token']='';
                    $http.defaults.headers.common['Google_Id']='';
                    $http.defaults.headers.common['id_user']='';
                    //$location.path('/');
                    /*$scope.newUSer={};
                    $rootScope.cartProducts=data.user_cart_details;*/
                    $cookies.csrf_token=data.csrf_token;
                    $cookies.id_user=data.id_user;
                    $cookies.name = data.name;
                    $cookies.email = data.email;
                    $cookies.img_url = data.pic;
                    $http.defaults.headers.common['Csrf-Token']   = $cookies.csrf_token;
                    $http.defaults.headers.common['id_user']=$cookies.id_user;
                    $rootScope.loggedUserDetails =$cookies;
                    if(angular.isDefined(data.notifications)){
                        angular.forEach(data.notifications,function(m){
                            if(m.message!=''){
                                var obj={};
                                obj.message= m.message;
                                obj.name=m.name;
                                obj.id_product = m.prod_id;
                                $rootScope.notifications.push(obj);
                            }
                        })
                    }
                    $cookies.notifications=JSON.stringify($rootScope.notifications);
                    if(interval!=null||interval==null)
                    {
                        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
                            $interval.cancel(interval);
                            interval=null;
                        }
                    }
                    if($rootScope.cartProducts==undefined||$rootScope.cartProducts==null){
                       var a =[];
$rootScope.cartProducts=angular.copy(a);
                    }
                    if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts.length>0)
                    {
                        $http({
                                method: "post",
                                timeout:60000,                                    
                                url: SITE_URL+'addBulkProductToCart',
                                data : $.param({'product':$rootScope.cartProducts,'id_user':$cookies.id_user}),
                                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                                }).success(function (data,status) {
                                   // //console.log(data.user_cart_details);
                                   $rootScope.cartProducts = angular.copy(data.user_cart_details);
                                   var carts = $rootScope.cartProducts;
                                        localStorage.removeItem('carts');
                                        localStorage.setItem('carts',JSON.stringify(carts));   
                                     //$rootScope.cartProducts.push(data.user_cart_details);
                                  
                                    /*swal({
                                                  title: '',
                                                  text: 'Product is added to cart',
                                                  timer: 5000
                                                })*/

                                });
                    }
                    else
                    {
                        var a =[];
$rootScope.cartProducts=angular.copy(a);
                    }
                   // $timeout(function() {$window.location.reload();}, 100);
                    //$window.location.href=BASE_URL_NEW+'#/';

 
                }
            }).error(function(data,status){
                if(status==403)
                    {
                       // alert(data.message);
                        /*swal({
                          title: '',
                          text: data.message,
                          timer: 5000
                        })*/
                        $.toast({
                              text:data.message, // Text that is to be shown in the toast
                              icon: 'error',
                              showHideTransition: 'slide', // fade, slide or plain
                              allowToastClose: true, // Boolean value true or false
                              hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                              stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                              position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                              bgColor: '#000000',  // Background color of the toast
                              textColor: '#ffffff',  // Text color of the toast
                              textAlign: 'center',  // Text alignment i.e. left, right or center
                              loader: false,  // Whether to show loader or not. True by default
                              loaderBg: '#ffffff',  // Background color of the toast loader
                        });
                    }
            });
        }
    }
}

$rootScope.login = function(param)
    {
        $http({
            method: "post",
            timeout:60000,                                    
            url: SITE_URL+'login',
            data:$.param($cookies),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    $('body').removeClass('modal-open');
                     $("#modalsignup").modal('hide');
                    $cookies.id_user = data.id_user;
                    $cookies.name = data.user_detail.name;
                    $cookies.mobile = data.user_detail.mobile;
                    $rootScope.loggedUserDetails={};
                    $rootScope.loggedUserDetails.name = data.user_detail.name;
                    $rootScope.user_cart_details = data.user_cart_details;
                    $rootScope.enableSignIn=false;
                    ////console.log(data.notifications);
                    $rootScope.notifications=[];
                    if(angular.isDefined(data.notifications)){
                        angular.forEach(data.notifications,function(m){
                            if(m.message!=''){
                                var obj={};
                                obj.message= m.message;
                                obj.name=m.name;
                                obj.id_product = m.id_project;
                                $rootScope.notifications.push(obj);
                            }
                        })
                    }
                    $cookies.notifications=JSON.stringify($rootScope.notifications);
                    
                    if(interval!=null||interval==null)
                    {
                       if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
                            $interval.cancel(interval);
                            interval=null;
                        }
                    }
                    if($rootScope.cartProducts==undefined||$rootScope.cartProducts==null){
                        var a=[];
                        $rootScope.cartProducts=angular.copy(a);
                    }
                    if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts!=null&&$rootScope.cartProducts.length>0)
                        {
                            $http({
                                    method: "post",
                                    timeout:60000,                                    
                                    url: SITE_URL+'addBulkProductToCart',
                                    data : $.param({'product':$rootScope.cartProducts,'id_user':$cookies.id_user}),
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                                    }).success(function (data,status) {
                                         $rootScope.cartProducts=[];
                                         $rootScope.cartProducts=angular.copy(data.user_cart_details);
                                         var carts = $rootScope.cartProducts;
                                            localStorage.removeItem('carts');
                                            localStorage.setItem('carts',JSON.stringify(carts));   
                                        /*swal({
                                                      title: '',
                                                      text: 'Product is added to cart',
                                                      timer: 5000
                                                    })*/

                                    });
                        }
                        else
                        {
                            console.log($rootScope.user_cart_details);
                            if(angular.isDefined($rootScope.user_cart_details)&&$rootScope.user_cart_details!=null&&$rootScope.user_cart_details.length>0){
                                $rootScope.cartProducts=angular.copy($rootScope.user_cart_details);
                                var carts = $rootScope.cartProducts;
                                localStorage.removeItem('carts');
                                localStorage.setItem('carts',JSON.stringify(carts)); 
                            }else{
                             var a=[];   
                            $rootScope.cartProducts=angular.copy(a);;
                            }
                        }
                        //if(angular.isDefined(param)&&param=='getcookiefunctin')
                        //$timeout(function() {$window.location.reload();}, 100);

                        
                    ////console.log($rootScope.cartProducts);
                    /*if(angular.isDefined(data.user_cart_details))
                    {
                        $cookies.products = data.user_cart_details;
                    }
                    else
                    {
                        $cookies.products=[];
                    }*/
                }
        }); 
    } 
     $rootScope.getCookiesValues=function() {
        if($cookies)
        {
            console.log($cookies.email);
            if(angular.isDefined($cookies.email)&&$cookies.email)
            {
                var randomSting= makeid(40);
                $cookies.csrf_token=randomSting;
                $http.defaults.headers.common['Csrf-Token']   = $cookies.csrf_token;
                $http.defaults.headers.common['Google_Id']=$cookies.id_user;
                //$http.defaults.headers.common['Google_Id']   = $cookies.id_google;
                
                $rootScope.enableSignIn=false;
                if(interval!=null||interval==null)
                {
                    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
                        $interval.cancel(interval);
                        interval=null
                    }
                    else{
                        $rootScope.login('getcookiefunctin');
                    }
                }
               
            }
            else
            {
                $rootScope.enableSignIn=true;
            }
        }
        //pass information to server to insert or update the user record
        //update_user_data(profile);
      }

    $rootScope.enableCookies=function(){
        interval=$interval($rootScope.getCookiesValues, 2000);
    } 
    //rootScope.enableCookies();
        
});
bookApp.controller('homeCtrl', function ($scope,$rootScope,$interval,$timeout, $http,$cookies,$location,$stateParams,$window){
 $.toast().reset('all');
    //console.log('gggg');
    if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
            $interval.cancel(interval);
            interval=null;
        }
    }
    interval=null;
    $scope.credentials={email:'',password:'',proc_id:''};
    $rootScope.searchString="";
    $scope.redirectToProduct=function(id_product){
        $location.path('/product/'+id_product);
    }
    function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
        console.log(gapi.auth2);
      });
    }
    onLoad();

    $rootScope.logout = function(){

        $rootScope.enableSignIn=true;
        angular.forEach($cookies, function (cookie, key) {
            delete $cookies[key];                
        });
        $http.defaults.headers.common['Csrf-Token']='';
        $http.defaults.headers.common['Google_Id']='';
        $http.defaults.headers.common['id_user']='';
        $rootScope.cartProducts = [];
        localStorage.removeItem('carts');
        //$location.path('/');
        $timeout(function() {
            $window.location.reload();
        }, 10);
        var auth2 = gapi.auth2.getAuthInstance();
        if(angular.isDefined(auth2)){
          auth2.signOut().then(function () {
            localStorage.removeItem('carts');
            var a =[];
            $rootScope.cartProducts=angular.copy(a);
            

          });   
        }
        else{
            localStorage.removeItem('carts');
             var a =[];
            $rootScope.cartProducts=angular.copy(a);
            

        }
    }   

    $scope.getTrendingBooks = function() {
        $http({
            method: "post",
            timeout:60000,                                    
            url: SITE_URL+'getTrendingBooks',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                   $scope.trending_books = data.trending_books;
                }
        });
    }
    $scope.getTrendingBooks();



});
bookApp.controller('productCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window,$timeout){
$.toast().reset('all');
if(interval!=null||interval==null)
{
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
    $interval.cancel(interval);
    interval=null
        
    }
}
    $rootScope.searchString="";

if(angular.isDefined($stateParams.id_category)&&$stateParams.id_category!=''){
    $scope.id_category = $stateParams.id_category;
}else{
    $scope.id_category ='';
}
$scope.backtoProductPage=false;
$scope.productDetail=false;
$scope.getCategories =function () {
    $http({
            method: "get",
            timeout:60000,                                    
            url: SITE_URL+'getCategories',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                $scope.categories = data.categories;
                $rootScope.categoriesIds=[];
                if(angular.isDefined($stateParams.id_category)&&$stateParams.id_category!=''){
                    $scope.id_category = $stateParams.id_category;
                    var keyos ='';
                    angular.forEach($scope.categories,function(val,key){
                        if($stateParams.id_category==val.id_category){
                            $rootScope.categoriesIds[key.toString()]="1";
                            keyos = key.toString()
                            
                        }
                    });
                    $timeout(function() {$scope.getAllProducts(keyos);}, 10);

                }else{
                    $scope.id_category ='';
                    $timeout(function() {$scope.getAllProducts();}, 10);

                }
            });
}
$scope.getCategories();

$scope.startIndex=0;
$scope.limitIndex=15;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;


$scope.getAllProducts = function(categoryAddedIndex)
{
    $scope.loadingBarShow=true;
    $scope.productDetail=false;    
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;
    var categories = [];
    console.log($rootScope.categoriesIds);
    /*if(angular.isDefined($scope.id_category)&&$scope.id_category!=''){
                categories.push($scope.id_category);
            }*/

            
    if(angular.isDefined($rootScope.categoriesIds)&&$rootScope.categoriesIds.length>0)
    {
        angular.forEach($rootScope.categoriesIds,function(a,key){
            if(angular.isDefined(a)&&a!=''&&a!=null&&a==1){
                angular.forEach($scope.categories,function(val1,key1){
                    if(key==key1){
                        //console.log(key,"==",categoryAddedIndex)
                        if(key==categoryAddedIndex)
                        categories.push(val1.id_category);
                    }
                })
            }
            
        });

        angular.forEach($rootScope.categoriesIds,function(a,key){
            if(angular.isDefined(a)&&a!=''&&a!=null&&a==1){
                angular.forEach($scope.categories,function(val3,key4){
                    if(key==key4&&categories.indexOf(val3.id_category)==-1){
                        categories.push(val3.id_category);
                    }
                })
            }
            
        });
                
    }
    
   //console.log(categories)
    var searchString='';
    searchString = $rootScope.searchString;
    var id_user='';
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        id_user=$cookies.id_user;
    }
    var params={searchString:searchString,startIndex:startIndex,limitIndex:limitIndex,categories:categories,id_user:id_user};
    $http({
    method: "post",
    timeout:60000,                                    
    url: SITE_URL+'getAllProducts',
    data : $.param(params),
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $scope.products = data.products.products;
        $scope.loadingBarShow=false;
        $scope.totalItems = parseInt(data.products.total_count);
        $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);

    }).error(function(data,status){
        $scope.products =[];
    });
}
$rootScope.getAllProductsMain=function(index){
    $rootScope.searchString ="";
    $rootScope.getAllProducts(index);
}
$rootScope.getAllProducts=function(){
    $scope.getAllProducts();
}

$scope.itemsPaginated = function () {
    if($scope.noOfPages!=''&&$scope.noOfPages>0)
    {
        if($scope.noOfPages>10)
        {
        var currentPageIndex = $scope.startIndex+1;
        if(currentPageIndex>=5)
            currentPageIndex=currentPageIndex-5;
        else
            currentPageIndex=0;
        var noOfPages = new Array($scope.noOfPages).join().split(',')
                            .map(function(item, index){ return ++index;});
        return noOfPages.slice(
            currentPageIndex, 
            currentPageIndex + 10);
        }
        else
        {
            var noOfPages = new Array($scope.noOfPages).join().split(',')
                            .map(function(item, index){ return ++index;});
            return noOfPages;
        }
    }
};
$scope.setPage = function(pageNo,page) {
        $scope.startIndex=pageNo;
        if(page=='products')
            $scope.getAllProducts();
        $("#return-to-top").trigger('click');
       
};
$scope.changeLimitIndex=function(limitIndex,from)
{
    $scope.startIndex=0;
    if(from=='products')
        $scope.getAllProducts();

}

$scope.backToProductList = function(){
    $scope.productDetail=false;
    $scope.startIndex=0;
    $scope.limitIndex=6;
    $scope.noOfPages=0;
    $scope.totalItems=0;
    $scope.backtoProductPage=false;
    $scope.getAllProducts();

}
$scope.getProductDetail = function(id_pro)
{
           $location.path('/product/'+id_pro);
     
   //  $scope.single_product={};
   // /* angular.forEach($scope.products,function(a){
   //      if(id_pro==a.id_product)
   //      {
   //          $scope.single_product = a;
   //          $scope.productDetail=true;    
   //          $scope.backtoProductPage=true;
   //      }
   //  });*/
   //  var params={'id_product':id_pro}
   //  $http({
   //  method: "post",
   //  timeout:60000,                                    
   //  url: SITE_URL+'getProductDetail',
   //  data : $.param(params),
   //  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
   //  }).success(function (data,status) {
   //      $scope.single_product = data.res.product;
   //      $scope.reviews=data.res.reviews;
   //      $scope.productDetail=true;    
   //      $scope.backtoProductPage=true;
   //      $scope.rating=Math.ceil($scope.single_product.rating);
   //      $scope.totalReviews= data.res.total_reviews;
   //      $scope.totalRatings= data.res.total_ratings;
   //  }).error(function(data,stat){

   //  });
}

$scope.addProductToCart = function(product)
{
    if($rootScope.cartProducts==undefined||$rootScope.cartProducts==null){
        var a =[];
        $rootScope.cartProducts=angular.copy(a);
    }
    if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts.length>0)
    {
        for (var i = 0; i < $rootScope.cartProducts.length; i++) {
            if($rootScope.cartProducts[i].id_product==product.id_product)
            {
                //alert('Product is already added to cart');
               
                /*swal({
                      title: '',
                      text: 'Product is already added to cart',
                      timer: 5000
                    })
*/
                 $.toast({
                      text:'Product is already added to cart', // Text that is to be shown in the toast
                      showHideTransition: 'slide', // fade, slide or plain
                      icon:'error',
                      allowToastClose: true, // Boolean value true or false
                      hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                      stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                      position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                      bgColor: '#000000',  // Background color of the toast
                      textColor: '#ffffff',  // Text color of the toast
                      textAlign: 'center',  // Text alignment i.e. left, right or center
                      loader: false,  // Whether to show loader or not. True by default
                      loaderBg: '#ffffff',  // Background color of the toast loader
                });
                return false;
            }
        }
    }
    else
    {
        //$rootScope.cartProducts=[];
    }
    $http({
    method: "post",
    timeout:60000,                                    
    url: SITE_URL+'addProductToCart',
    data : $.param({'product':product,'id_user':$cookies.id_user}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $rootScope.cartProducts.push(product);
        localStorage.removeItem('carts');
        var carts = $rootScope.cartProducts;
        localStorage.setItem('carts',JSON.stringify(carts));
        /*swal({
                      title: '',
                      text: 'Product is added to cart',
                      timer: 5000
                    })*/
        $.toast({
              text:'Product is added to cart', // Text that is to be shown in the toast
              showHideTransition: 'slide', // fade, slide or plain
              allowToastClose: true, // Boolean value true or false
              hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
              stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              bgColor: '#000000',  // Background color of the toast
              textColor: '#ffffff',  // Text color of the toast
              textAlign: 'center',  // Text alignment i.e. left, right or center
              loader: false,  // Whether to show loader or not. True by default
              loaderBg: '#ffffff',  // Background color of the toast loader
        });

    });

}

$scope.clearAllElemts=function(){
    $('.ckbox').prop('checked', false);
    $scope.startIndex=0;
    $scope.limitIndex=6;
    $rootScope.categoriesIds=[];
    $scope.searchString="";
    $rootScope.searchString="";
    $scope.getAllProducts();
}

});


bookApp.controller('singleProductCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$("#return-to-top").trigger('click');
$scope.loadingBarShow=true;
    $rootScope.searchString="";
$.toast().reset('all');
if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        $interval.cancel(interval);
        interval=null
            
        }
    }
    $scope.getOrganizations= function(){
    $http({
    method: "get",
    timeout:60000,                                    
    url: SITE_URL+'getOrganizations',
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $rootScope.oraganizations=data.oraganizations;
    });
    }
    $scope.getOrganizations();


$scope.techpark='';
$scope.techparkaddress='';
$scope.sendOrganizationReq =function()
{
    var form1=$('#sendReq').validate(angular.extend({
            // Rules for form validation
            rules: {
                techpark1: {
                    required: true,
                    maxlength:64,
                },
                techparkaddress: {
                  required: true,
                  maxlength:1024,
                }
            },
            // Messages for form validation
            messages: {
                techpark1 : {
                        required : '<center><i style="color:red">Techpark name cannot be blank</i></center>',
                },
                techparkaddress : {
                        required : '<center><i style="color:red">Please enter tech park address</i></center>'
                }
            }

        },validateOptions));
    if(form1.valid()&&$scope.techpark!='')
    {
        //alert('gg');
        $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'addOrganization',
        data : $.param({'id_user':$cookies.id_user,'techpark':$scope.techpark,'techparkaddress':$scope.techparkaddress}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
            {
                //alert('Organization addedd successfully.You will be nofified once it is verified.');
               
                /*swal({
                  title: '',
                  text: 'Organization addedd successfully.You will be notified once it is verified.',
                  timer: 5000
                })*/
                $.toast({
                    text: "Organization addedd successfully.You will be notified once it is verified.", // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                });
                $('body').removeClass('modal-open');
                $("#login-modal1").modal('hide');
            }
        });    
    }
}
    
    $scope.id_product = $stateParams.id_product;
    var params={'id_product':$scope.id_product}
    $http({
    method: "post",
    timeout:60000,                                    
    url: SITE_URL+'getProductDetail',
    data : $.param(params),
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {

        $scope.single_product = data.res.product;
        $scope.reviews=data.res.reviews;
        $scope.productDetail=true;    
        $scope.backtoProductPage=true;
        //$scope.rating=Math.ceil($scope.single_product.ratings);
        $scope.rating=$scope.single_product.ratings;
        $scope.totalReviews= data.res.total_reviews;
        $scope.totalRatings= data.res.total_ratings;
        $scope.showGoToCart=false;
        $scope.loadingBarShow=false;
        if($rootScope.cartProducts==null){
               var a=[] 
            $rootScope.cartProducts=a;
        }  
        if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts!=''){
            angular.forEach($rootScope.cartProducts,function(c){
                if(c.id_product==$scope.single_product.id_product){
                    $scope.showGoToCart=true;
                }
            })
            
        }

    }).error(function(data,stat){

    });

    $scope.addProductToCart = function(product)
    {
    if($rootScope.cartProducts==null){
        var a=[];
        $rootScope.cartProducts=angular.copy(a);
    }  
    if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts.length>0)
    {
        for (var i = 0; i < $rootScope.cartProducts.length; i++) {
            if($rootScope.cartProducts[i].id_product==product.id_product)
            {
                //alert('Product is already added to cart');
               
                /*swal({
                      title: '',
                      text: 'Product is already added to cart',
                      timer: 5000
                    })*/
                $.toast({
                    text: "Product is already added to cart", // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    icon:'error',
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                });

                return false;
            }
        }
    }
    if(angular.isDefined($scope.selecttechpark)&&$scope.selecttechpark!=''){
        if($scope.selecttechpark=='not_avaiable'){
            /*swal({
                      title: '',
                      text: 'Please select the valid techpark availability',
                      timer: 5000
            })*/
            $.toast({
                text: "Please select the valid techpark availability", // Text that is to be shown in the toast
                icon: 'error',
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                bgColor: '#000000',  // Background color of the toast
                textColor: '#ffffff',  // Text color of the toast
                textAlign: 'center',  // Text alignment i.e. left, right or center
                loader: false,  // Whether to show loader or not. True by default
                loaderBg: '#ffffff',  // Background color of the toast loader
            });

            return false;
        }
    }else{
        /*swal({
                      title: '',
                      text: 'Please select your techpark',
                      timer: 5000
            })*/
        $.toast({
                text: "Please select your techpark", // Text that is to be shown in the toast
                icon: 'error',
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                bgColor: '#000000',  // Background color of the toast
                textColor: '#ffffff',  // Text color of the toast
                textAlign: 'center',  // Text alignment i.e. left, right or center
                loader: false,  // Whether to show loader or not. True by default
                loaderBg: '#ffffff',  // Background color of the toast loader
        });

        return false;
    }
    /*else
    {
        $rootScope.cartProducts=[];
    }*/
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!='')
    {
        //alert('Please login and add product to cart');
       
         /*swal({
                      title: '',
                      text: 'Please login and add product to cart',
                      timer: 5000
                    })
        return false;*/
        product.organization_id_organization =$scope.selecttechpark; 
         $http({
            method: "post",
            timeout:60000,                                    
            url: SITE_URL+'addProductToCart',
            data : $.param({'product':product,'id_user':$cookies.id_user}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                $rootScope.cartProducts.push(product);
                localStorage.removeItem('carts');
                var carts = $rootScope.cartProducts;
                localStorage.setItem('carts',JSON.stringify(carts));
                /*swal({
                              title: '',
                              text: 'Product is added to cart',
                              timer: 5000
                            })*/
                $.toast({
                    text: "Product is added to cart", // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                });
                $scope.showGoToCart=false;
                if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts!=''){
                    angular.forEach($rootScope.cartProducts,function(c){
                        if(c.id_product==$scope.single_product.id_product){
                            $scope.showGoToCart=true;
                        }
                    })
                    
                }

            });
    }else{
        $.toast({
                    text: "Product is added to cart", // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                });
        $rootScope.cartProducts.push(product);
        console.log($rootScope.cartProducts);
        localStorage.removeItem('carts');
        var carts = $rootScope.cartProducts;
        localStorage.setItem('carts',JSON.stringify(carts));
    }
   

}

});

bookApp.controller('basketCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
console.log($rootScope.cartProducts);
if(interval!=null||interval==null)
{
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
    $interval.cancel(interval);
    interval=null
        
    }
}
$scope.showBasket=true;

$scope.beforelogincheckout= function(){
    if(angular.isUndefined($cookies.id_user))
    {
        $.toast({
            text: "Please login and add product to cart", // Text that is to be shown in the toast
            showHideTransition: 'slide', // fade, slide or plain
            icon:'error',
            allowToastClose: true, // Boolean value true or false
            hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            bgColor: '#000000',  // Background color of the toast
            textColor: '#ffffff',  // Text color of the toast
            textAlign: 'center',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#ffffff',  // Background color of the toast loader
            afterHidden: function (){
                $(".bs-example-modal-lg").modal("show");
                $rootScope.registerorloginClick('login');
                $.toast().reset('all');
            }
        });
       /* swal({ 
              title: '',
              text: 'Please login and add product to cart',
              timer: 5000
          },
          function(){
                    $(".bs-example-modal-lg").modal("show");
                    $rootScope.registerorloginClick('login');
        });*/
        return false;
    }else{
        //data-toggle="modal" data-target="#login-modal1"
        $("#login-modal1").modal("toggle");
    }
}
$scope.getOrganizations= function(){
    $http({
    method: "get",
    timeout:60000,                                    
    url: SITE_URL+'getOrganizations',
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $rootScope.oraganizations=data.oraganizations;
    });
}
$scope.getOrganizations();
$scope.deleteProductFromCart = function (product) {

   if(angular.isDefined($cookies.id_user)&&$cookies.id_user!='') {
        $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'deleteProductFromCart',
        data : $.param({'product':product,'id_user':$cookies.id_user}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            $rootScope.cartProducts=angular.copy(data.user_cart_details);
            var carts = $rootScope.cartProducts;
                    localStorage.removeItem('carts');
                    localStorage.setItem('carts',JSON.stringify(carts));
        });
   }else{
        //console.log($rootScope.cartProducts);
        var pId= '';
            if(angular.isDefined(product.id_product)){
                    pId = product.id_product;
            }
            else{
                if(angular.isDefined(product.product_id_product)){
                pId = product.product_id_product;
            }
        }

        //console.log(product,$rootScope.cartProducts);
        if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts.length>0){
            for (var i = 0; i < $rootScope.cartProducts.length; i++) {
                var id_pro = '';
                if(angular.isDefined($rootScope.cartProducts[i].id_product)){
                    id_pro = $rootScope.cartProducts[i].id_product;
                }else{
                    if(angular.isDefined($rootScope.cartProducts[i].product_id_product)){
                    id_pro = $rootScope.cartProducts[i].product_id_product;
                    }
                }
                //console.log(pId,"f",id_pro,i,$rootScope.cartProducts);

                var cartProducts = $rootScope.cartProducts;
                //console.log(pId,"f",id_pro,i,cartProducts);
                if(id_pro&&id_pro!=''){
                    if(id_pro==pId){
                        cartProducts.splice(i,1);
                        //console.log(pId,"f",id_pro,i,cartProducts);
                        $rootScope.cartProducts = angular.copy(cartProducts);
                        var carts = cartProducts;

                        localStorage.removeItem('carts');
                        localStorage.setItem('carts',JSON.stringify(carts));
                    }
                }
            }
        }
       }
   
    
}
$scope.selecttechpark='' ; 
$scope.mobile='';   
if(angular.isDefined($cookies.mobile)&&$cookies.mobile!=''){
    $scope.mobile = $cookies.mobile;
}   
$scope.buyProducts= function(){
    if(angular.isUndefined($cookies.id_user))
    {
       
        $("#closeBtnOrder").trigger('click');
        $.toast({
            text: "Please login and add product to cart", // Text that is to be shown in the toast
            showHideTransition: 'slide', // fade, slide or plain
            icon:'error',
            allowToastClose: true, // Boolean value true or false
            hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            bgColor: '#000000',  // Background color of the toast
            textColor: '#ffffff',  // Text color of the toast
            textAlign: 'center',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#ffffff',  // Background color of the toast loader
            afterHidden: function (){
                $(".bs-example-modal-lg").modal("show");
                $rootScope.registerorloginClick('login');
                $.toast().reset('all');
            }
        });
        /*swal({ 
              title: '',
              text: 'Please login and add product to cart',
              timer: 5000
          },
          function(){
                    $(".bs-example-modal-lg").modal("show");
                    $rootScope.registerorloginClick('login');
        });*/
        
        return false;
    }
   $('#buy_products').validate(angular.extend({
            // Rules for form validation
            rules: {
                selectedtechpark: {
                    required: true,
                },
                mobile: {
                  required: true,
                  minlength:10,
                  maxlength:10,
                  number:true
                }
            },
            // Messages for form validation
            messages: {
                selectedtechpark : {
                        required : '<center><i style="color:red">Please select techpark</i></center>',
                },
                mobile : {
                        required : '<center><i style="color:red">Please enter mobile number</i></center>'
                }
            }

        },validateOptions));

    if($('#buy_products').valid()&&$scope.mobile!='')
    {

       $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'buyProducts',
        data : $.param({'products':$rootScope.cartProducts,'id_user':$cookies.id_user,'id_organization':$scope.selecttechpark,'mobile':$scope.mobile}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
               /* swal({
                      title: '',
                      text: 'Thank you for placing an order with us. You will receive a notification once your book is ready to be dispatched.',
                      timer: 5000
                })*/
                $.toast({
                    text: "Thank you for placing an order with us. You will receive a notification once your book is ready to be dispatched.", // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 6000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                    
                });

            $cookies.mobile = $scope.mobile;

            //alert(data.meessage);

            $scope.showBasket=false;
            $scope.message=data.meessage;
            $rootScope.recentOrders=$rootScope.cartProducts;

            $rootScope.cartProducts=[];
            $rootScope.cartProducts=data.user_cart_details;
            var carts = $rootScope.cartProducts;
            localStorage.removeItem('carts');
            localStorage.setItem('carts',JSON.stringify(carts));
            $('body').removeClass('modal-open');
            $("#login-modal1").modal('hide');
            
        }).error(function(data,status){
            if(status==403)
            {
                //alert(data.meessage);
                $.toast({
                    text: data.meessage, // Text that is to be shown in the toast
                    icon:'error',
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'mid-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                    
                });
                /*swal({
                      title: '',
                      text: data.meessage,
                      timer: 5000
                    })*/

                $scope.message=data.meessage;
                $('body').removeClass('modal-open');
                $("#login-modal1").modal('hide');
                $rootScope.cartProducts=data.user_cart_details;
                var carts = $rootScope.cartProducts;
                    localStorage.removeItem('carts');
                    localStorage.setItem('carts',JSON.stringify(carts));

            }
        }); 
    }
}
$scope.techpark='';
$scope.techparkaddress='';
$scope.sendOrganizationReq =function()
{
    var form1=$('#sendReq').validate(angular.extend({
            // Rules for form validation
            rules: {
                techpark1: {
                    required: true,
                    maxlength:64,
                },
                techparkaddress: {
                  required: true,
                  maxlength:1024,
                }
            },
            // Messages for form validation
            messages: {
                techpark1 : {
                        required : '<center><i style="color:red">Techpark name cannot be blank</i></center>',
                },
                techparkaddress : {
                        required : '<center><i style="color:red">Please enter tech park address</i></center>'
                }
            }

        },validateOptions));
    if(form1.valid()&&$scope.techpark!=''&&$scope.techparkaddress!='')
    {
        //alert('gg');
        $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'addOrganization',
        data : $.param({'id_user':$cookies.id_user,'techpark':$scope.techpark,'techparkaddress':$scope.techparkaddress}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
            {
                //alert('Organization addedd successfully.You will be nofified once it is verified.');
               
                /*swal({
                      title: '',
                      text: 'Organization addedd successfully.You will be nofified once it is verified.',
                      timer: 5000
                    })*/
                $.toast({
                    text: 'Organization addedd successfully.You will be nofified once it is verified.', // Text that is to be shown in the toast
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    bgColor: '#000000',  // Background color of the toast
                    textColor: '#ffffff',  // Text color of the toast
                    textAlign: 'center',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#ffffff',  // Background color of the toast loader
                    
                });
                $('body').removeClass('modal-open');
                $("#login-modal1").modal('hide');
            }
        });    
    }
}

});



bookApp.controller('ordersCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
if(interval!=null||interval==null)
{
    if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
    $interval.cancel(interval);
    interval=null
        
    }
}
$scope.rating;
$scope.description="";
$scope.getOrders= function(){
        $http({
            method: "POST",
            timeout:60000,                                    
            url: SITE_URL+'getOrders',
            data : $.param({'id_user':$cookies.id_user}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    $scope.orders = data.orders;
                    $scope.lenderedProducts =data.lenderedProducts;
                }
        });    
}
if(angular.isDefined($cookies.id_user)&&$cookies.id_user!='')
    $scope.getOrders();

$scope.changeTransaction=function(id_subtransaction,status,id_product){
    $scope.id_subtransaction=id_subtransaction;
    $scope.status=status;
    $scope.id_product=id_product;
}
$scope.changeTransactionStatus = function(id_subtransaction,order_status){
    //console.log(id_subtransaction,order_status,$scope.id_product,'fff');
    if(angular.isDefined(id_subtransaction)&&angular.isDefined(order_status)){
        if(angular.isDefined($scope.rating)){

        }
        else
        {
            $scope.rating="";
        }
        if(angular.isDefined($scope.description)){

        }
        else
        {
            $scope.description="";
        }


    $http({
            method: "POST",
            timeout:60000,                                    
            url: SITE_URL+'setTransactionStatus',
            data : $.param({'id_user':$cookies.id_user,'id_subtransaction':id_subtransaction,'status':order_status,rating:$scope.rating,'description':$scope.description,'id_product':$scope.id_product}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    //alert(data.message);
                    $('body').removeClass('modal-open');
                    $("#returnreview").modal('hide');
                     /*swal({
                      title: '',
                      text: data.message,
                      timer: 5000
                    })*/
                     $.toast({
                        text: data.message, // Text that is to be shown in the toast
                        showHideTransition: 'slide', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 4000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        bgColor: '#000000',  // Background color of the toast
                        textColor: '#ffffff',  // Text color of the toast
                        textAlign: 'center',  // Text alignment i.e. left, right or center
                        loader: false,  // Whether to show loader or not. True by default
                        loaderBg: '#ffffff',  // Background color of the toast loader
                        
                    });
                    if(order_status=='in_progress'){
                        $scope.id_subtransaction="";
                        $scope.status="";
                        $scope.id_product="";
                    }
                    
                    $scope.rating="";
                    $scope.description="";
                    $scope.orders = data.orders;
                    $scope.lenderedProducts =data.lenderedProducts;
                }
        });
    }
}

});


bookApp.controller('registerCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        $interval.cancel(interval);
        interval=null
            
        }
    }
});

bookApp.controller('faqCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        $interval.cancel(interval);
        interval=null
            
        }
    }

    $scope.groups = [
    {
        "title" : "How much will I earn per book?",
        "content" : "You will earn Rs.10/week/book for each book you lend to Chainreaders",
        "open" : false
    },
    {
        "title" : "In which IT parks is the service available in?",
        "content" : "Chainreaders are now available at Embassy Tech Village( ETV ), Embassy Golf Links(EGL).",
        "open" : false
    },
    {
        "title" : "For how many days can I borrow a book?",
        "content" : "You can borrow any book for a maximum of 3 weeks @ Rs. 29/week/book. From the 22nd day onwars you will be charged @ Rs.39/week/book",
        "open" : false
    },
    {
        "title" : "What is the total number of books at Chainreaders?",
        "content" : "Chainreaders has a collection of around 1000+ books. We are striving hard to expand our collection each and every day.",
        "open" : false
    },
    {
        "title" : "What if my book gets lost or damaged?",
        "content" : "We at Chainreaders are first and foremost book lovers. We want to assure our customers that our ",
        "open" : false
    },
    {
        "title" : "What is the charge per book?",
        "content" : "Each book is charged at Rs.29/week. The cost per day is not dependent on the marked price of the book.",
        "open" : false
    },
    {
        "title" : "How much do people at ChainReaders earn?",
        "content" : "Chainreaders is a startup. For every book that is transacted through our website we earn Rs.19/week",
        "open" : false
    },
    {
        "title" : "What is the payment system followed?",
        "content" : "Cash on Delivery is the mode of payment that is followd presntly. The website will soon be equipped with the option to complete transactions by performing online payments",
        "open" : false
    },
    {
        "title" : "How to submit a request for a book if it is not present on the website?",
        "content" : "Please login and click on Add Lender book",
        "open" : false
    },
    {
        "title" : "How to let people at ChainReaders know that you have completed reading the book?",
        "content" : "Please login and click on Orders page in the Home screen.",
        "open" : false
    },
    {
        "title" : "How many books can I order in a single go?",
        "content" : "Youcan rent a maximum of 3 books as part of one order",
        "open" : false
    },
    {
        "title" : "How can you reach us? ",
        "content" : "Feel free to email us at help@chainreaders.in or give us a call at 8867713633",
        "open" : false
    }]

});

bookApp.controller('aboutUsCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        $interval.cancel(interval);
        interval=null
            
        }
    }

});

bookApp.controller('termsCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$.toast().reset('all');
if(interval!=null||interval==null)
    {
        if(angular.isDefined($cookies.id_user)&&$cookies.id_user!=''){
        $interval.cancel(interval);
        interval=null
            
        }
    }

});

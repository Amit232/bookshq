var bookApp = angular.module('bookApp', ['ui.router','ngCookies','ngSanitize','timer','ngAnimate']);
var interval;
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
                        title: 'Home'
                })
                .state('products',{
                        url: '/products',
                        templateUrl : 'pages/products.html',
                        controller  : 'productCtrl',
                        title: 'Products'
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
                        title: 'Orders'
                })
                .state('register',{
                        url: '/register',
                        templateUrl : 'pages/register.html',
                        controller  : 'registerCtrl',
                        title: 'Register'
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
                    if(!$rootScope.offline)
                        networkConnectivity($rootScope,'offline');
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
bookApp.run(function ($location, $rootScope, $state, $stateParams,$http,$cookies,$templateCache,$interval,$window) {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // console.log('$rootScope.user_role',$rootScope.user_role);
            
        })
        $rootScope.enableSignIn=true;
        if(angular.isDefined($cookies.email)&&$cookies.email)
        {
            var randomSting= makeid(40);
            $cookies.csrf_token=randomSting;
            $http.defaults.headers.common['Csrf-Token']   = $cookies.csrf_token;
            $http.defaults.headers.common['id_user']   = $cookies.id_user;
            //$http.defaults.headers.common['Google_Id']   = $cookies.id_google;
            $rootScope.enableSignIn=false;
            $rootScope.loggedUserDetails = $cookies;
            //console.log($rootScope.loggedUserDetails);
           
            
        }
        $rootScope.cartProducts=[];
              
      /* $http.defaults.headers.common['X-Csrf-Token']   = $cookies.csrf_token;
        $http.defaults.headers.common['X-Id-Exam']   = $cookies.id_exam;
        $http.defaults.headers.common['X-Id-Exam-Has-Student']   = $cookies.id_exam_has_student;
      
        var loc=$location.path();*/
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
            //$location.path('/');
            $window.location.href=BASE_URL_NEW+'#/';
        } 
        $rootScope.tableDatas=[];
        $rootScope.abc=[];
        $rootScope.addTableData=function(data)
        {
            $rootScope.tableDatas.push(data);
        }
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
                            //alert(data.message);
                            $.toast({
                              heading: '',
                              text: data.message,
                              icon: 'success',
                              showHideTransition: 'slide',
                              hideAfter: 5000,
                              loader: true,
                              allowToastClose: true,
                              position: 'top-right',
                            });
                            $("#lenderbooks").modal('hide');
                            $rootScope.tableDatas=[];
                            $rootScope.abc=[];
                        }
                });   
            }

        }
        $rootScope.searchString='';
        $rootScope.seachProducts=function(){
            var loc= $location.path();
            if(loc.search('/products')>-1)
            {
                $rootScope.getAllProducts();
            }
            else
            $location.path('/products');
        }
        var nav = $('.navbar');
    
        $(window).scroll(function () {
            var scroll = $(this).scrollTop();
            var topDist = $("#navbar").position();
            if (scroll > topDist.top) {
                $('#navbar').css({"position":"fixed","top":"0","z-index": "9999","width":"100%"});
            } else {
                $('#navbar').css({"position":"static","top":"auto"});
            }
        });


$rootScope.registerorloginClick=function(){
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
                    $("#modalsignup").modal('hide');
                    $rootScope.signupisClicked=false;
                    $rootScope.signupbtn=false;
                    $rootScope.signupisClicked1=false;
                    $.toast({
                      heading: '',
                      text: data.message,
                      icon: 'success',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
                    });
                    $rootScope.newUSer={};
                    $rootScope.cartProducts=data.user_cart_details;
                }
        }).error(function(data,status){
            if(status==403)
                {
                    //alert(data.message);
                    $.toast({
                      heading: '',
                      text: data.message,
                      icon: 'error',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
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
        $.toast({
          heading: '',
          text: 'You are alredy logged in to application',
          icon: 'success',
          showHideTransition: 'slide',
          hideAfter: 5000,
          loader: true,
          allowToastClose: true,
          position: 'top-right',
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
                    $("#modalsignup").modal('hide');
                    $rootScope.signupisClicked=false;
                    $rootScope.signupbtn=false;
                    $rootScope.signupisClicked1=false;
                    $.toast({
                      heading: '',
                      text: data.message,
                      icon: 'success',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
                    });
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
                    $window.location.href=BASE_URL_NEW+'#/';

 
                }
            }).error(function(data,status){
                if(status==403)
                    {
                       // alert(data.message);
                       $.toast({
                          heading: '',
                          text: data.message,
                          icon: 'error',
                          showHideTransition: 'slide',
                          hideAfter: 5000,
                          loader: true,
                          allowToastClose: true,
                          position: 'top-right',
                        });
                    }
            });
        }
    }
}


        
});
bookApp.controller('homeCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
    $scope.credentials={email:'',password:'',proc_id:''};
    interval =null;
    $rootScope.searchString="";
    $scope.login = function()
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
                     $("#modalsignup").modal('hide');
                    $cookies.id_user = data.id_user;
                    $cookies.name = data.user_detail.name;
                    $rootScope.loggedUserDetails={};
                    $rootScope.loggedUserDetails.name = data.user_detail.name;
                    $scope.user_cart_details = data.user_cart_details;
                    $rootScope.enableSignIn=false;
                    if($scope.user_cart_details)
                    {
                        $rootScope.cartProducts=$scope.user_cart_details;
                    }
                    //console.log($rootScope.cartProducts);
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
            if(angular.isDefined($cookies.email)&&$cookies.email)
            {
                var randomSting= makeid(40);
                $cookies.csrf_token=randomSting;
                $http.defaults.headers.common['Csrf-Token']   = $cookies.csrf_token;
                $http.defaults.headers.common['Google_Id']=$cookies.id_user;
                //$http.defaults.headers.common['Google_Id']   = $cookies.id_google;
                $scope.login();
                $rootScope.enableSignIn=false;
                if(interval!=null||interval==null)
                {
                    $interval.cancel(interval);
                    interval=null
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
    interval=$interval($rootScope.getCookiesValues, 2000);

    $rootScope.logout = function(){
        $rootScope.enableSignIn=true;
        angular.forEach($cookies, function (cookie, key) {
            delete $cookies[key];                
        });
        $http.defaults.headers.common['Csrf-Token']='';
        $http.defaults.headers.common['Google_Id']='';
        $http.defaults.headers.common['id_user']='';
        //$location.path('/');
        $window.location.href=BASE_URL_NEW+'#/';
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
bookApp.controller('productCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){

if(interval!=null||interval==null)
{
    $interval.cancel(interval);
    interval=null
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
            });
}
$scope.getCategories();

$scope.startIndex=0;
$scope.limitIndex=6;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;
$scope.categoriesIds=[];


$scope.getAllProducts = function()
{
    $scope.productDetail=false;    
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;
    var categories = [];
    if(angular.isDefined($scope.categoriesIds)&&$scope.categoriesIds.length>0)
    {
        angular.forEach($scope.categoriesIds,function(a){
            if(angular.isDefined(a)&&a!=''&&a!=null&&a)
            categories.push(a);
        });
    }
    
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
        $scope.totalItems = parseInt(data.products.total_count);
        $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);

    }).error(function(data,status){
        $scope.products =[];
    });
}
$scope.getAllProducts();
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
        console.log($scope.startIndex);
        if(page=='products')
            $scope.getAllProducts();
       
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
    $scope.single_product={};
   /* angular.forEach($scope.products,function(a){
        if(id_pro==a.id_product)
        {
            $scope.single_product = a;
            $scope.productDetail=true;    
            $scope.backtoProductPage=true;
        }
    });*/
    var params={'id_product':id_pro}
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
        $scope.rating=Math.ceil($scope.single_product.rating);
        $scope.totalReviews= data.res.total_reviews;
        $scope.totalRatings= data.res.total_ratings;
    }).error(function(data,stat){

    });
}

$scope.addProductToCart = function(product)
{
    if(!angular.isDefined($cookies.id_user)||!angular.isDefined($cookies.email))
    {
        //alert('Please login and add product to cart');
        $.toast({
          heading: '',
          text: 'Please login and add product to cart',
          icon: 'error',
          showHideTransition: 'slide',
          hideAfter: 5000,
          loader: true,
          allowToastClose: true,
          position: 'top-right',
        });
        return false;
    }
    if(angular.isDefined($rootScope.cartProducts)&&$rootScope.cartProducts.length>0)
    {
        for (var i = 0; i < $rootScope.cartProducts.length; i++) {
            if($rootScope.cartProducts[i].id_product==product.id_product)
            {
                //alert('Product is already added to cart');
                $.toast({
                  heading: '',
                  text: 'Product is already added to cart',
                  icon: 'error',
                  showHideTransition: 'slide',
                  hideAfter: 5000,
                  loader: true,
                  allowToastClose: true,
                  position: 'top-right',
                });
                return false;
            }
        }
    }
    else
    {
        $rootScope.cartProducts=[];
    }
    $http({
    method: "post",
    timeout:60000,                                    
    url: SITE_URL+'addProductToCart',
    data : $.param({'product':product,'id_user':$cookies.id_user}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $rootScope.cartProducts.push(product);
        $.toast({
          heading: '',
          text: 'Product is added to cart',
          icon: 'success',
          showHideTransition: 'slide',
          hideAfter: 5000,
          loader: true,
          allowToastClose: true,
          position: 'top-right',
        });
    });

}

$scope.clearAllElemts=function(){
    $('.ckbox').prop('checked', false);
    $scope.startIndex=0;
    $scope.limitIndex=6;
    $scope.categoriesIds=[];
    $scope.searchString="";
    $rootScope.searchString="";
    $scope.getAllProducts();
}

});


bookApp.controller('basketCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){

if(interval!=null||interval==null)
{
    $interval.cancel(interval);
    interval=null
}
$scope.showBasket=true;

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

    $http({
    method: "POST",
    timeout:60000,                                    
    url: SITE_URL+'deleteProductFromCart',
    data : $.param({'product':product,'id_user':$cookies.id_user}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        $rootScope.cartProducts=data.user_cart_details;
    });
}
$scope.selecttechpark='' ; 
$scope.mobile='';      
$scope.buyProducts= function(){
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

    if($('#buy_products').valid()&&$scope.selecttechpark!=''&&$scope.mobile!='')
    {

       $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'buyProducts',
        data : $.param({'products':$rootScope.cartProducts,'id_user':$cookies.id_user,'id_organization':$scope.selecttechpark,'mobile':$scope.mobile}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
                $.toast({
                  heading: '',
                  text: data.meessage,
                  icon: 'success',
                  showHideTransition: 'slide',
                  hideAfter: 5000,
                  loader: true,
                  allowToastClose: true,
                  position: 'top-right',
                });
            //alert(data.meessage);

            $scope.showBasket=false;
            $scope.message=data.meessage;
            $rootScope.recentOrders=$rootScope.cartProducts;

            $rootScope.cartProducts=[];
            $rootScope.cartProducts=data.user_cart_details;
            $("#login-modal1").modal('hide');
        }).error(function(data,status){
            if(status==403)
            {
                //alert(data.meessage);
                $.toast({
                  heading: '',
                  text: data.meessage,
                  icon: 'error',
                  showHideTransition: 'slide',
                  hideAfter: 5000,
                  loader: true,
                  allowToastClose: true,
                  position: 'top-right',
                });
                $scope.message=data.meessage;
                $("#login-modal1").modal('hide');
                $rootScope.cartProducts=data.user_cart_details;

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
                $.toast({
                  heading: '',
                  text: 'Organization addedd successfully.You will be nofified once it is verified.',
                  icon: 'success',
                  showHideTransition: 'slide',
                  hideAfter: 5000,
                  loader: true,
                  allowToastClose: true,
                  position: 'top-right',
                });
                $("#login-modal1").modal('hide');
            }
        });    
    }
}

});



bookApp.controller('ordersCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){

if(interval!=null||interval==null)
{
    $interval.cancel(interval);
    interval=null
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
$scope.changeTransactionStatus = function(id_subtransaction,status){

    if(angular.isDefined($scope.id_subtransaction)&&angular.isDefined($scope.status)){
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
            data : $.param({'id_user':$cookies.id_user,'id_subtransaction':$scope.id_subtransaction,'status':$scope.status,rating:$scope.rating,'description':$scope.description,'id_product':$scope.id_product}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (data,status) {
                if(status==200)
                {
                    //alert(data.message);
                    $("#returnreview").modal('hide');
                    $.toast({
                      heading: '',
                      text: data.message,
                      icon: 'success',
                      showHideTransition: 'slide',
                      hideAfter: 5000,
                      loader: true,
                      allowToastClose: true,
                      position: 'top-right',
                    });
                    $scope.id_subtransaction="";
                        $scope.status="";
                        $scope.id_product="";
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

if(interval!=null||interval==null)
{
    $interval.cancel(interval);
    interval=null
}
});
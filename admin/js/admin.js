var bookAppAdmin = angular.module('bookAppAdmin', ['ui.router','ngCookies','ngSanitize','timer','ngImgCrop','angularFileUpload']);
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
function makeid(m)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < m; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
bookAppAdmin.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
                // route for the login page
                .state('login',{
                        url: '/',
                        templateUrl : 'pages/login.html',
                        controller  : 'loginCtrl',
                        title: 'Login'
                })
                .state('dashboard',{
                        url: '/dashboard',
                        templateUrl : 'pages/dashboard.html',
                        controller  : 'dashboardCtrl',
                        title: 'Dashboard'
                })
                .state('addproduct',{
                        url: '/addproduct',
                        templateUrl : 'pages/add_product.html',
                        controller  : 'productCtrl',
                        title: 'Product'
                })
                .state('viewproduct',{
                        url: '/viewproduct',
                        templateUrl : 'pages/view_product.html',
                        controller  : 'viewProductCtrl',
                        title: 'View Product'
                })
                .state('lenderbooks',{
                        url: '/lenderbooks',
                        templateUrl : 'pages/lender_books.html',
                        controller  : 'lenderCtrl',
                        title: 'Lender books'
                })
                .state('transaction',{
                        url: '/transaction',
                        templateUrl : 'pages/transaction.html',
                        controller  : 'transactionCtrl',
                        title: 'Transaction'
                })
                .state('addproductd',{
                        url: '/addproduct/:productName/:id_user/:id_lender_notification',
                        templateUrl : 'pages/add_product.html',
                        controller  : 'productCtrl',
                        title: 'Product'
                })
                .state('oraganization',{
                    url         : '/oraganization',
                    templateUrl : 'pages/oraganization.html',
                    controller  : 'organizationCtrl'
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
bookAppAdmin.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location, $rootScope){
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

bookAppAdmin.run(function ($location, $rootScope, $state, $stateParams,$http,$cookies,$templateCache,$interval,$window) {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // console.log('$rootScope.user_role',$rootScope.user_role);
            
        })
        if(angular.isDefined($cookies.id_admin)||angular.isDefined($cookies.admin_csrf_token))
        {
          $rootScope.enableAdminSignIn=false;
        }
        else
        {
          $rootScope.enableAdminSignIn=true;
          $location.path('/')
        }
        $http.defaults.headers.common['Admin-Csrf-Token']=$cookies.admin_csrf_token;
        $http.defaults.headers.common['X-Id-Admin']=$cookies.id_admin;
        $rootScope.menu='addp';
        $rootScope.logout=function(){
          $rootScope.enableAdminSignIn=true;
                    angular.forEach($cookies, function (cookie, key) {
                        delete $cookies['admin_csrf_token'];
                        delete $cookies['id_admin'];
                        delete $cookies['name'];
                    });
          $http.defaults.headers.common['Admin-Csrf-Token']='';
          $http.defaults.headers.common['X-Id-Admin']='';
          $location.path('/')
        }
});

bookAppAdmin.controller('loginCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){

      $rootScope.enableAdminSignIn=true;
                    angular.forEach($cookies, function (cookie, key) {
                        delete $cookies['admin_csrf_token'];
                        delete $cookies['id_admin'];
                        delete $cookies['name'];
                    });
          $http.defaults.headers.common['Admin-Csrf-Token']='';
          $http.defaults.headers.common['X-Id-Admin']='';
    $scope.login1 = function(email,password)
    {
      //alert('fff');
      $('#normalLogin').validate(angular.extend({
            // Rules for form validation
        rules: {
            email2: {
              required: true,
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
            },
            password2 : {
                    required : '<center><i style="color:red">Password cannot be blank</i></center>'
            }
        }

    },validateOptions));

    if($('#normalLogin').valid()&&email!=''&&password!='')
    {
      $http({
            method: "POST",
            timeout:60000,                                    
            url: SITE_URL+'adminLogin',
            data : $.param({'email':email,'password':password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function (data,status) {
          if(status==200)
          {
            $cookies.name=data.name;
            $cookies.id_admin = data.id_admin;
            $cookies.admin_csrf_token = data.csrf_token;
            $http.defaults.headers.common['Admin-Csrf-Token']=data.csrf_token;
            $http.defaults.headers.common['X-Id-Admin']=$cookies.id_admin;
                $rootScope.enableAdminSignIn=false;
            $location.path('addproduct');
          }
      }).error(function(data,status){
          if(status==403)
          {
            alert(data.message);
          }
      });  
    }  


    }
});

bookAppAdmin.controller('dashboardCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){

});

bookAppAdmin.controller('viewProductCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$rootScope.menu='viewproduct';
$scope.startIndex=0;
$scope.limitIndex=10;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;
$scope.getAdminProducts=function(){
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;
  $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'getAdminProducts',
        data:$.param({startIndex:startIndex,limitIndex:limitIndex}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
  }).success(function (data,status) {
      if(status==200)
      {
        $scope.products = data.products;
        $scope.totalItems = parseInt(data.total_count);
        $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);

      }
  }).error(function(data,status){
      if(status==403)
      {

      }
  });
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
            $scope.getAdminProducts();
       
};
$scope.changeLimitIndex=function(limitIndex,from)
{
    $scope.startIndex=0;
        $scope.getAdminProducts();

}  

    $scope.getAdminProducts();  

});


bookAppAdmin.controller('productCtrl', function ($scope,$rootScope,$interval, $http,$upload,$cookies,$location,$stateParams,$window,$timeout){
$rootScope.menu='addp';
$scope.id_user = $stateParams.id_user;
$scope.productName = $stateParams.productName;
$scope.id_lender_notification = $stateParams.id_lender_notification;
 $scope.product={};
if(angular.isDefined($scope.productName)&&$scope.productName!='')
{
    $scope.product.name=$scope.productName;
}
if(angular.isDefined($scope.id_user)&&$scope.id_user!='')
{
    $scope.product.user_id_user=$scope.id_user;
}
else{
     $scope.product.user_id_user='';
}
if(angular.isDefined($scope.id_lender_notification)&&$scope.id_lender_notification!='')
{
    $scope.product.id_lender_notification=$scope.id_lender_notification;
}
else
{
    $scope.product.id_lender_notification='';
}
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

$scope.img_text='Change Photo';
//--------------------------for image croping
$scope.enableCrop = true;
$scope.size = 'small';
$scope.type = 'square';
$scope.imageDataURI = '';
$scope.resImageDataURI = '';
$scope.resImgFormat = 'image/png';
$scope.resImgQuality = 1;
$scope.selMinSize = 100;
$scope.resImgSize = 200;
$scope.myAreaCoords = {};
$scope.editProfileDetails=false;
$scope.SuccessMsg=false;
$scope.ErrorMsg=false;
$scope.onChange = function ($dataURI) {
            // console.log('onChange fired');
        };
        $scope.onLoadBegin = function () {
            // console.log('onLoadBegin fired');
        };
        $scope.onLoadDone = function () {
            //console.log('onLoadDone fired');
        };
        $scope.onLoadError = function () {
            // console.log('onLoadError fired');
        };
  $scope.files=null;      
  var handleFileSelect = function (evt) {

            var files = evt.currentTarget.files[0];
            $scope.files=files;
            if(files.type=='image/png')
            {
            }
            else if(files.type=='image/jpeg')
            {
            }
            else
            {
                $scope.files=null;
                $scope.message="Please upload the JPG OR PNG files";
                alert($scope.message);
                /*$scope.ErrorMsg=true;
                $timeout(function() {$scope.ErrorMsg=false;}, 3000);*/
                //alert("Please upload the JPG OR PNG files");
                return false;
            }
            $scope.files=files;
            // var reader = new FileReader();
            // reader.onload = function (evt) {
            //     $scope.$apply(function ($scope) {
            //         $scope.imageDataURI = evt.target.result;
            //     });
            // };
            // reader.readAsDataURL(files);
            /*var dialog = $("#crop-image-profile").dialog({
                autoOpen: false,
                resizable: false,
                height: 470,
                width: 450,
                modal: true,
                close: function () {
                }
            });
            dialog.dialog("open");*/
            //$("#button1").trigger('click');

        }
        $('#profilePic').on('change', handleFileSelect);
         
   $scope.changePostition=function(type)
   {
      $scope.type=type;
   }

   $scope.addnewproduct = function(product){
    $('#normalProduct').validate(angular.extend({
            // Rules for form validation
        rules: {
            name: {
              required: true,
              maxlength:255,
            },
             description : {
                    required : true,
            },
            isbn : {
                    required : true,
            },
            author : {
                    required : true,
            },
            copies:{
                    required : true,
                    number:true
            },
            categories:{
              required:true,
            }
        },
        // Messages for form validation
        messages: {
            name : {
                    required : '<center><i style="color:red">Name cannot be blank</i></center>',
            },
            description : {
                    required : '<center><i style="color:red">description cannot be blank</i></center>'
            },
            isbn : {
                    required : '<center><i style="color:red">Isbn cannot be blank</i></center>'
            },
            author : {
                    required : '<center><i style="color:red">Author cannot be blank</i></center>'
            },
            copies :{
                 required : '<center><i style="color:red">Copies cannot be blank</i></center>'

            },
            categories:{
                 required : '<center><i style="color:red">Select Category</i></center>'
            }

        }

    },validateOptions));

    if($('#normalProduct').valid()&&product!=''){
        // if(!$scope.resImageDataURI||$scope.resImageDataURI=='')
        // {
        //   alert('Please choose image');
        //   return false;
        // }
        // else
        // {
            //console.log($scope.files);
            $upload.upload({
                method: "POST",
                timeout:60000,                                    
                url: SITE_URL+'addProduct',
                //data:$.param({product:product,img:$scope.resImageDataURI,id_admin:$cookies.id_admin}),
                file: $scope.files,
                fields: {'product':product,'id_admin':$cookies.id_admin},
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
            }).success(function (data,status) {
                if(data.error==200)
                {
                    //console.log(data.message);
                    alert(data.message);
                    $scope.product={};
                    $scope.resImageDataURI='';
                   
                    $timeout(function() {$window.location.reload();}, 1000);
                }
            });
        //}
    }
   }

});

bookAppAdmin.controller('lenderCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$rootScope.menu='lenderbooks';
$scope.startIndex=0;
$scope.limitIndex=10;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;
$scope.getAdminLenderbooks=function(){
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;
  $http({
        method: "POST",
        timeout:60000,                                    
        url: SITE_URL+'getAdminLenderbooks',
        data:$.param({startIndex:startIndex,limitIndex:limitIndex}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
  }).success(function (data,status) {
      if(status==200)
      {
        $scope.products = data.products;
        $scope.totalItems = parseInt(data.total_count);
        $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);

      }
  }).error(function(data,status){
      if(status==403)
      {

      }
  });
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
            $scope.getAdminLenderbooks();
       
};
$scope.changeLimitIndex=function(limitIndex,from)
{
    $scope.startIndex=0;
        $scope.getAdminLenderbooks();

}  

    $scope.getAdminLenderbooks();    
});

bookAppAdmin.controller('transactionCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$rootScope.menu='transaction';

$scope.startIndex=0;
$scope.limitIndex=10;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;


$scope.getTransactions=function(){
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;
    $http({
          method: "POST",
          timeout:60000,                                    
          url: SITE_URL+'getTransactions',
          data:$.param({startIndex:startIndex,limitIndex:limitIndex}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        if(status==200)
        {
          $scope.transactions = data.transactions;
          $scope.totalItems = parseInt(data.total_count);
          $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);

        }
    }).error(function(data,status){
        if(status==403)
        {

        }
    });
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
            $scope.getTransactions();
       
};
$scope.changeLimitIndex=function(limitIndex,from)
{
    $scope.startIndex=0;
        $scope.getTransactions();

}

$scope.getTransactions();


$scope.changeTransactionStatus=function(status,date){

  if(angular.isDefined(status)&&angular.isDefined(date))
  {
    var selectedTransaction = new Array();
    $('.caseProgressiveStudents:checked').each(function(){
        selectedTransaction.push($(this).val());
    });
    if(selectedTransaction.length==0)
    {
        alert('Please check transactions to change its status');
        return false;
    }
  $http({
          method: "PUT",
          timeout:60000,                                    
          url: SITE_URL+'changeTransactionStatus',
          data:$.param({status:status,date:date,transactionsIds:selectedTransaction,due_days:DUE_DAYS}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        if(status==200)
        {
          alert(data.message);
          $scope.getTransactions();

        }
    }).error(function(data,status){
        if(status==403)
        {

        }
    });
  }
  else
  {
    alert('Select status and date');
    return false;
  }
}


});

bookAppAdmin.controller('organizationCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
$rootScope.menu='oraganization';
$scope.startIndex=0;
$scope.limitIndex=10;
$scope.noOfPages=0;
$scope.totalItems=0;
$scope.parseInt = parseInt;

$scope.oraganization={};
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
            $scope.getAllOrganization();
       
};
$scope.changeLimitIndex=function(limitIndex,from)
{
    $scope.startIndex=0;
        $scope.getAllOrganization();

}
$scope.getAllOrganization=function(){
    var startIndex = $scope.limitIndex*$scope.startIndex;

    var limitIndex = $scope.limitIndex;

     $http({
          method: "POST",
          timeout:60000,                                    
          url: SITE_URL+'getAllOrganization',
          data:$.param({startIndex:startIndex,limitIndex:limitIndex}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
          if(status==200)
          {
            $scope.oraganizations = data.organizations;
            $scope.totalItems = parseInt(data.total_count);
            $scope.noOfPages=Math.ceil($scope.totalItems/$scope.limitIndex);
          }  
    });
}
$scope.getAllOrganization();
$scope.updateOrganizationDetail=function(id_organization,status){
    $http({
          method: "PUT",
          timeout:60000,                                    
          url: SITE_URL+'updateOrganizationDetail',
          data:$.param({id_organization:id_organization,status:status}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data,status) {
        if(status==200)
        {
            alert(data.message);
            $scope.getAllOrganization(); 
        }
    });
}

$scope.addOrganization=function(organization){

    $('#organization1').validate(angular.extend({
            // Rules for form validation
        rules: {
            name: {
              required: true,
              maxlength:255,
            },
             address : {
                    required : true,
            },
            
        },
        // Messages for form validation
        messages: {
            name : {
                    required : '<center><i style="color:red">Name cannot be blank</i></center>',
            },
            address : {
                    required : '<center><i style="color:red">description cannot be blank</i></center>'
            },
           
        }

    },validateOptions));

    if($('#organization1').valid()&&organization!=''){

        $http({
              method: "POST",
              timeout:60000,                                    
              url: SITE_URL+'addAdminOrganization',
              data:$.param({id_admin:$cookies.id_admin,oraganization:organization}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
            {
                alert(data.message);
                $("#organization").modal('hide');
                $scope.organization2={};
                $scope.getAllOrganization(); 
            }
        });
    }
}

$scope.deleteOrganization=function(id_organization){
     $http({
              method: "POST",
              timeout:60000,                                    
              url: SITE_URL+'deleteOrganization',
              data:$.param({id_admin:$cookies.id_admin,id_organization:id_organization}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
            {
                alert('Organization delete successfully');
                $scope.getAllOrganization(); 
                return false;
            }
        });
}

$scope.addAdmin=function(user){

    $('#user1').validate(angular.extend({
            // Rules for form validation
        rules: {
            name: {
              required: true,
              maxlength:255,
            },
             password : {
                    required : true,
            },
            conf_password : {
                    required : true,    
                    equalTo: "#password",
            },
            
        },
        // Messages for form validation
        messages: {
            name : {
                    required : '<center><i style="color:red">Name cannot be blank</i></center>',
            },
            password : {
                    required : '<center><i style="color:red">Password cannot be blank</i></center>'
            },
            conf_password : {
                    required : '<center><i style="color:red">Conf Password cannot be blank</i></center>'
            },
           
        }

    },validateOptions));

    if($('#user1').valid()&&user!=''){

        $http({
              method: "POST",
              timeout:60000,                                    
              url: SITE_URL+'addNewAdmin',
              data:$.param({id_admin:$cookies.id_admin,user:user}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (data,status) {
            if(status==200)
            {
                alert(data.message);
                $("#adduser").modal('hide');
                $scope.user={};
            }
        });
    }
}
});
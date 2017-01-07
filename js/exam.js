// create the module and name it examApp
var percent1 = 0; 
var preventUnloadPrompt = false;
var speed=300;
var a = new Date();
var b = new Date();
var countdownStopped=false;
function dateDifferenceInSeconds(fromDate,toDate)
{
    return Math.round((toDate - fromDate) / 1000);
}
function disableF5(e) {
    if ((e.which || e.keyCode) == 116)
        e.preventDefault();
  //  if ((e.which || e.keyCode) == 8)
  //      e.preventDefault();
};
function examDisableKeys() {
    $(document).bind('cut copy', function (e) {
        e.preventDefault();
    });
    $(document).bind('keydown', function (event) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    });
    $(document).bind('contextmenu', function (e) {
        e.preventDefault();
    });
    $(document).ready(function () {
        $(document).bind("keydown", disableF5);
    });
}
function effectFadeToggle(classname) {
    if(percent1>100)
        return;
    $("." + classname).fadeOut(speed, function() {
        $(this).fadeIn(speed, effectFadeToggle(classname));
        });
}
var charactersNoSpaces;
var characters;
var words;
var lines;
function wordCount( val ){
    if(val==''||val==null)
    {
        return {
            charactersNoSpaces : '',
            //characters         : '',
            words              : '',
            lines              : ''
        }
    }    
    else
    {
        return {
            charactersNoSpaces : val.replace(/\s+/g, '').length,
            //characters         : val.length,
            words              : val.match(/\S+/g).length,
            lines              : val.split(/\r*\n/).length
        }
    }
}
examDisableKeys();
var interval=null;
var autoSaveInterval=null;
var examApp = angular.module('examApp', ['ui.router','ngCookies','ngSanitize','timer']);
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
function networkConnectivity($rootScope,status)
    {
        if(status=='offline')
        {
            a = new Date();
            preventUnloadPrompt = true;
            $rootScope.offlineDiv = true;
            $rootScope.offline = true;
            if(document.getElementsByTagName('timer'))
            {
                for(var i=0;i<document.getElementsByTagName('timer').length;i++)
                {
                    document.getElementsByTagName('timer')[i].clear();                            
                }
            }  
        countdownStopped=true;      
        }
        else
        {
            $rootScope.offline = false;
            //$('#onlineTimer').countdown('destroy');
            //$('#onlineTimer').countdown({until: 10,onExpiry: hideOfflineDiv,format: 'S',compact: true});
        }
    }
// configure our routes
examApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
                // route for the login page
                .state('login',{
                        url: '/login',
                        templateUrl : 'pages/login.html',
                        controller  : 'loginCtrl',
                        title: 'Exam Login'
                })
                // route for the instruction page
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
                })
});
    examApp.filter('myDateTimeFormatUserReadable', function myDateFormat($filter){
          return function(text){
              if(typeof text!='undefined'&&text!='')
              {
                    text=text.replace(" ","T");
                    //var  tempdate= new Date(text.replace(/-/g,"/"));
                    return $filter('date')(text, "d MMM yyyy h:mm a");
              }
              return '';
          }
        });
    /*To maintain Session value across different controllers*/
    examApp.factory('Session', function($http,$cookies) {
        var Session = {
            data: {},
            saveSession: function() { /* save session data to db */ },
            updateSession: function() { 
              var sess = {"fullname": $cookies.fullname,'email' : $cookies.email,'id' : $cookies.id,'profile_pic' : $cookies.profile_pic,'id_college' : $cookies.id_college};
              Session = sess;//$http.get('session.json').then(function(r) { return r.data;});
            }
        };
        Session.updateSession();
        return Session; 
    });
    examApp.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location, $rootScope){
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
                    $location.path('/login');
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
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
    examApp.run(function ($location, $rootScope, $state, $stateParams,$http,$cookies,Session,$templateCache) {
        $rootScope.$state = $state;
        $rootScope.offline = false;
        $rootScope.offlineDiv = false;
        $rootScope.inExam=false;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // console.log('$rootScope.user_role',$rootScope.user_role);
            if($rootScope.user_role) {
                $rootScope.user_role = $cookies.user_role;
                $rootScope.SITE_URL = SITE_URL;
                $rootScope.BASE_URL = BASE_URL;
                if( angular.isUndefined($rootScope.rolePermissions))
                    $rootScope.roles = JSON.parse($cookies.rolePermissions);
                else if( $rootScope.rolePermissions)
                    $rootScope.roles = $rootScope.rolePermissions;
                // $rootScope.rolePermissions =JSON.parse($cookies.rolePermissions);
                for (var i = 0; i < $rootScope.roles.length; i++) {
                    if($rootScope.roles[i]['name'] === toState.data.module)
                    {
                        var $index = i;
                        if($rootScope.roles[i]['level'] == 'no') {
                            event.preventDefault();
                            if(fromState.url == '/error403')
                                $state.transitionTo('app.misc.403');
                            else
                                $state.transitionTo('app.misc.error403');
                          // return false;
                        }
                        break;
                    };
                }
            }
        })
        $rootScope.Session   = Session;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $http.defaults.headers.common['X-Csrf-Token']   = $cookies.csrf_token;
        $http.defaults.headers.common['X-Id-Exam']   = $cookies.id_exam;
        $http.defaults.headers.common['X-Id-Exam-Has-Student']   = $cookies.id_exam_has_student;
      
        var loc=$location.path();
        if($cookies.csrf_token != undefined)
        {
            
        }
        else
        {
        }
        $rootScope.updateStudentExamStatus=function()
        {
            var data={id_exam:$cookies.id_exam};
            $http({
                    method: "POST",
                    url: SITE_URL+'updateStudentExamStatus',
                    data : $.param(data),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                   
                })
                .error(function(data, status){

                });
        }
    });        
    examApp.controller('loginCtrl', function ($scope,$rootScope,$interval, $http,$cookies,$location,$stateParams,$window){
        $rootScope.offlineDiv = false;
        $rootScope.offline = false;
        $rootScope.inExam=false;
        if(interval!=null)
        {
            $interval.cancel(interval);
            interval=null
        }
        if(autoSaveInterval!=null)
        {
            $interval.cancel(autoSaveInterval);
            autoSaveInterval=null;
        }
        $scope.errorMsg ='';
        $scope.errorsubMsg='';
        $scope.loginMsg = false;
        $window.onblur=null;
        $rootScope.studentName='';
        $scope.actionDisabled=false;
        $scope.credentials={email:'',password:'',proc_id:''};
        var form=$('#loginForm').validate(angular.extend({
            // Rules for form validation
            rules: {
                email: {
                    required: true,
                    email:true
                },
                password: {
                  required: true
                },
                proc_id: {
                  required: true
                }
            },
            // Messages for form validation
            messages: {
                email : {
                        required : '<center><i style="color:red">Please enter your email address</i></center>',
                        email : '<center><i style="color:red">Please enter a VALID email address</i></center>'
                },
                password : {
                        required : '<center><i style="color:red">Please enter password</i></center>'
                },
                proc_id : {
                        required : '<center><i style="color:red">Please enter Exam Proc id</i></center>'
                }
            }

        },validateOptions));
        $scope.login=function()
        {
            if(form.valid()&&$scope.credentials.email!=''&&$scope.credentials.password!=''&&$scope.credentials.proc_id!='')
            {
                $scope.actionDisabled=true;
                $scope.loginMsg = false;
                $http({
                    method: "POST",
                    timeout:60000,                                    
                    url: SITE_URL+'login',
                    data: $.param($scope.credentials),//posting data from login form
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (data,status) {
                  
                    if(status==200)
                    {
                        angular.forEach($cookies, function (cookie, key) {
                            delete $cookies[key];                
                         });
                        $rootScope.student=data;
                        $scope.loginMsg = false;
                        $cookies.csrf_token    = data.access_token;
                        $cookies.name=data.student_name;
                        $cookies.email=$scope.credentials.email;
                        $cookies.id_exam    = data.id_exam;
                        $cookies.exam_name    = data.name;
                        $cookies.exam_type    = data.exam_type;
                        $cookies.exam_time    = data.slot_time;
                        $cookies.exam_cutoff_time    = data.slot_cutoff_time
                        $cookies.id_pattern    = data.pattern_id_pattern;
                        $cookies.id_exam_has_student   = data.id_exam_has_student; 
                        $cookies.show_marks=data.show_marks;
                        $cookies.show_ans="0";
                        if(data.show_ans)
                            $cookies.show_ans=data.show_ans;
                        $cookies.ea_status="0";
                        if(data.ea_status)
                            $cookies.ea_status=data.ea_status;
                        $cookies.show_report=data.show_report;
                        $rootScope.collegeDetails=data.college;
                        $cookies.proc_id=$scope.credentials.proc_id;
                        $http.defaults.headers.common['X-Email']   = $cookies.email;
                        $http.defaults.headers.common['X-Csrf-Token']   = $cookies.csrf_token; //For all $http request it ll apply this header.
                        $http.defaults.headers.common['X-Id-Exam']   = $cookies.id_exam; //For all $http request it ll apply this header.
                        $http.defaults.headers.common['X-Id-Exam-Has-Student'] = $cookies.id_exam_has_student; //For all $http request it ll apply this header.
                        $http.defaults.headers.common['X-Exam-Type']   = data.exam_type;
                        //$window.location.href = BASE_URL+'/#/dashboard';
                        // $location.path('/dashboard');
                        if(data.student_status=='not_started')
                            $location.path('/instruction');
                        else
                            $location.path('/exam');
                        $scope.actionDisabled=false;
                    }

                }).error(function (data, status) {
                  if(status==401)
                  {
                    $scope.loginMsg = true;
                    $scope.errorMsg = data.message;
                    if(data.sub_message)
                        $scope.errorsubMsg = data.sub_message;
                    $scope.actionDisabled=false;
                  }
                 });
            }
        }
	});
    
examApp.controller('instructionCtrl', function ($scope,$rootScope,$filter, $http,$cookies,$timeout, $interval,$location,$stateParams,$window){
    $rootScope.offline = false;
    $rootScope.offlineDiv = false;
    if($rootScope.inExam)
        $location.path('/login');
    var id =$cookies.id_pattern;
    $scope.id_pattern=id;
    $scope.examType=$cookies.exam_type;
    $window.onblur=null;
    $rootScope.studentName=$cookies.name;
    $scope.student=$rootScope.student;
    $scope.timerStarted=false;
    $scope.examPageClicked=false;
    if(interval!=null)
    {
        $interval.cancel(interval);
        interval=null
    }
    if(autoSaveInterval!=null)
    {
        $interval.cancel(autoSaveInterval);
        autoSaveInterval=null;
    }

    $scope.startTimer=function()
    {
        $scope.timerStarted=true;
        $('#timerDiv').removeClass('hidden');
        $('#startExam').removeClass('hidden');
        $timeout(function(){$("#start").prop("disabled", false)}, 5000);
        document.getElementById('timerDiv').getElementsByTagName('timer')[0].start();
        $scope.$on('timer-stopped', function (event, data){
            if($rootScope.offline == false)
            {
                $scope.showExamPage();
                $scope.$apply();  
            }
        });
        $scope.$on('timer-tick', function (event, args) {
            if(args.millis<30000)
            {
                $('timer').addClass('timer-red');
            }
        }); 
    }
    $scope.updateStudentExamStatus=function()
        {
            var data={from:'ins'};
            $http({
                    method: "POST",
                    url: SITE_URL+'updateStudentExamStatus',
                    data : $.param(data),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    if(!$scope.timerStarted&&data.examStatus=='started')
                        $scope.startTimer();
                })
                .error(function(data, status){

                });
        }
    $scope.updateStudentExamStatus();
    interval=$interval($scope.updateStudentExamStatus, 10000);
    $scope.getDetails  = function () {
        $http({
            method: "POST",
            timeout:30000,
            url: SITE_URL+'getExamPatternDetails',
            data: $.param({id_pattern:id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (response) {
            $scope.pattern_has_section    = response.sections;
            $scope.examName               = $cookies.exam_name;
            $scope.procId                =$cookies.proc_id;
            var d = new Date($cookies.exam_time);
            var d1 = new Date($cookies.exam_cutoff_time);
            $scope.examDate               = $cookies.exam_time;
            $scope.examCutoffDate         = $cookies.exam_cutoff_time;
            $scope.total                  = response.sectionTotal;            
        });
    }    
    $scope.showExamPage  = function () {
        $scope.examPageClicked=true;
        $("#start").prop("disabled", false);
        $("#overlay").remove();
        $('#widget-grid').append('<div id="overlay" class="hidden"></div>');
        document.getElementById("overlay").innerHTML='<div style="margin-top: 19%;margin-left:31%;"><span id="eval_loading" style="font-size:20px;margin-left:137px;margin-top:30%;color:rgb(246, 246, 253);"><i style="font-size:7em;" class="fa fa-4x wobble-fix fa-spin fa-cog ml20 wobble-fix"></i><i class="fa fa-3x  fa-spin fa-cog  wobble-fix" style="margin-left:-5px;margin-top:-19px;font-size:5em;"></i><br><span style="margin-left:11%">Loading Exam Please Wait...</span></span></div>';
        $('#overlay').removeClass('hidden');
        $('#eval_loading').removeClass('hidden'); 
        var data={status:'in_progress'};   
        $http({
                method: "POST",
                timeout:10000,
                url: SITE_URL+'updateStudentExamStatus',
                data : $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (response) {
                $location.path('/exam');
            });
    };
    $scope.hideOfflineDiv=function()
    {
        $("#start").prop("disabled", false);
        $("#overlay").remove();
        $rootScope.offlineDiv = false;
        $rootScope.offline = false; 
        if(document.getElementById('timerDiv').getElementsByTagName('timer'))
            document.getElementById('timerDiv').getElementsByTagName('timer')[0].resume(); 
        if($scope.examPageClicked)
            $scope.showExamPage();
    }
    $scope.getDetails(); 
});
examApp.controller('examCtrl', function ($scope,$rootScope, $http,$timeout, $interval,$location,$stateParams,$cookies,$sce,$window){
    $rootScope.offline = false;
    $rootScope.offlineDiv = false;
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }
    $rootScope.inExam=true;
    $scope.id_pattern=$cookies.id_pattern;
    $scope.examType=$cookies.exam_type;
    var idExam=$cookies.id_exam;
    var editor=false;
    $rootScope.studentName=$cookies.name;
    $scope.loading=true;
    $scope.finishTestStatus=false;
    $scope.showWebCam=false;
    $scope.sectionInfo=false;
    $scope.exitTestStatus=false;
    $scope.confirmSectionStatus=false;
    $scope.confirmFinishStatus=false;
    $scope.explanation=false;
    $scope.logoutPressedStatus=false;
    $scope.actionDisabled=false;
    $scope.showMarks=false;
    $scope.progressDiv=true;
    $scope.showReport=false;
    $scope.showExplanationAnswer=false;   
    $scope.examQuestionStatus=false;  
    $scope.extraTime='';
    $scope.finishTestStatus=false;  
    $scope.showhidediv = function (index, sectionid) {
        $scope.questionNo = index + 1;
        $('.bs-example').css({display: "none"});
        $('#div_' + sectionid + '_' + index).css({display: "block"});
    }
    $scope.showhidedivbysection = function (sectionid, index) {
        $scope.sectiondatnew = $scope.sections[index];
        $scope.questionNo = 1;
        $('.bs-example').css({display: "none"});
        $('#div_' + sectionid + '_0').css({display: "block"});
    }


    //-----------------------

    $scope.filteredData = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 5
            , $scope.maxSize = -1;


    $scope.decrimentPage = function () {
        $scope.currentPage = $scope.currentPage - 1;
        var index = ($scope.currentPage - 1) * $scope.numPerPage;
        $scope.sectiondatnew = $scope.sections[index];
        $timeout(function(){$('#sectionAnchor_'+$scope.sectiondatnew.id_section).trigger('click')},100);

    }
    $scope.incrimentPage = function () {
        $scope.currentPage = $scope.currentPage + 1;
        var index = ($scope.currentPage - 1) * $scope.numPerPage;
        $scope.sectiondatnew = $scope.sections[index];
        $timeout(function(){$('#sectionAnchor_'+$scope.sectiondatnew.id_section).trigger('click')},100);
    }
    a = new Date();
    b = new Date();
    if($cookies.show_marks=='1'&&($scope.examType=='pattern'||($scope.examType=='advanced'&&$scope.id_pattern=='3')))
        $scope.showMarks=true;
    if($cookies.show_report=='1'&&($scope.examType=='pattern'||($scope.examType=='advanced'&&$scope.id_pattern=='3')))
        $scope.showReport=true;
    if($cookies.show_ans=='1'&&$cookies.ea_status=='0'&&($scope.examType=='pattern'||($scope.examType=='advanced'&&$scope.id_pattern=='3')))
    {
        $scope.showExplanationAnswer=true;
    }
    if(!$scope.showReport&&!$scope.showExplanationAnswer)
        $scope.progressDiv=false;
    if(interval!=null)
    {
        $interval.cancel(interval);
        interval=null
    }
    if(autoSaveInterval!=null)
    {
        $interval.cancel(autoSaveInterval);
        autoSaveInterval=null;
    }

  $http({
        method: "POST",
        timeout:90000,
        url: SITE_URL+'getExamQuestions',
        data:$.param({'id_exam':idExam}),                    
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function(data) {
        $scope.currentSection=-1;
        $scope.sections = data.sections;
        $scope.exam=data.exam;
        $scope.id_exam=idExam;
        $scope.selectAnswer=false;        
        $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0};
        $scope.sectionTotalFinish={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0};
        $('#answerWriting').keyup(function(){
        var c = wordCount( this.value );
            $("#characters").html(c.charactersNoSpaces);
            $("#words").html(c.words);
        });
        
        $scope.initiateWritingAbility=function()
        {
            $timeout(function(){
                var c = wordCount($('#answerWriting').val());
                $("#characters").html(c.charactersNoSpaces);
                $("#words").html(c.words);
            },50);
        }
        $scope.initiateProgrammingLanguage=function(id_programming_language)
        {
            $('#test_case').hide();
            $('#evaluating').addClass('hidden');
            $('#evaluatingError').addClass('hidden');
            $('#result').addClass('hidden');
            $("#input1").val('');
            $("#input2").val('');
            $("#input3").val('');
            $('#codeArea').html('');
            var answer='';
            if(($scope.question.answer!=''&&$scope.question.answer!=null))
            {
                answer=$scope.question.answer;
            }
            else
            {
                if($scope.question.type=='fix_error')
                    answer=$scope.question.question_body;
                else
                    answer='';
            }
            $('#codeArea').html('<textarea rows="4" columns="20" id="codeProgram" name="codeProgram">'+answer+'</textarea>');
            editor = ace.edit("codeProgram");
            if($scope.question.id_programming_language==1||$scope.question.id_programming_language==2)
                editor.session.setMode("ace/mode/c_cpp");
            if($scope.question.id_programming_language==3)
                editor.session.setMode("ace/mode/java");
            editor.setTheme("ace/theme/chrome");
            editor.setAutoScrollEditorIntoView(true);
            editor.setOption("maxLines", 300);
            editor.setOption("minLines", 15);
            $("#freeze_code_start").val($scope.question.question_head);
            var val=$("#freeze_code_start").val();
            editor.setOption("firstLineNumber", val.split(/\r*\n/).length+1);
        }
        $scope.valid=function(){
            if(editor.getValue()=="")
            {
                $scope.selectAnswer=true;
                $timeout(function(){$scope.selectAnswer=false;},2000);
                return false;
            }
        }
        $scope.resetProgramBody=function()
        {
            editor.setValue($('#program_body').val());
        }
        $scope.evaluateProgram=function()
        {
            var timeout=20000;
            var freeze_code_start = $("#freeze_code_start").val();
            var codeProgram=editor.getValue();
            if(codeProgram==''||codeProgram==null)
            {
                $scope.selectAnswer=true;
                $timeout(function(){$scope.selectAnswer=false;},2000);
                return false;
            }
            var freeze_code_end = $("#freeze_code_end").val();
            var input1='';
            var input2='';
            var input3='';
            var status=true;
            var id_programming_lang=$scope.question.id_programming_language;
            $('#test_case').fadeIn(0);
            if(($scope.question.id_category==2||$scope.question.id_category==3||$scope.question.id_category==5)&&($scope.question.input_label1!=''||$scope.question.input_label1!=null))
            {
                if($("#input1").val()!='')
                {
                    input1=$("#input1").val();
                    status=true;
                }
                else
                    status=false;
            }
            if(($scope.question.id_category==3||$scope.question.id_category==5)&&($scope.question.input_label2!=''||$scope.question.input_label2!=null))
            {
                if($("#input2").val()!='')
                {
                    input2=$("#input2").val();
                    if(status)
                        status=true;
                }
                else
                    status=false;
            }
            if(($scope.question.id_category==4||$scope.question.id_category==5)&&($scope.question.input_label3!=''||$scope.question.input_label3!=null))
            {
                if($("#input3").val()!='')
                {
                    input3=$("#input3").val();
                    if(status)
                        status=true;
                }
                else
                    status=false;
            }
            var test_case = $("#test_case").val();
            if(codeProgram==""||codeProgram==null)
            {
                $("#inner").removeClass('hidden');
                $( "#inner" ).fadeIn(200, "linear");
                $( "#inner" ).fadeOut(3000, "linear");
                return false;
            }
            if(!status)
            {
                $("#innerInput").removeClass('hidden');
                $("#innerInput" ).fadeIn(200, "linear");
                $("#innerInput" ).fadeOut(3000, "linear");
                return false;
            }
            $scope.actionDisabled=true;
            $('#evaluating').removeClass('hidden');
            $('#evaluatingError').addClass('hidden');
            $('#result').addClass('hidden');
            $http({
                method: "POST",
                timeout:timeout,                    
                url: SITE_URL+'evaluateProgram',
                data:$.param({id_programming_lang : id_programming_lang,id_exam_has_student_has_question : $scope.question.id_exam_has_student_has_question,program:freeze_code_start+codeProgram+freeze_code_end,input1:input1,input2:input2,input3:input3}),                    
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    $scope.actionDisabled=false;
                    $('#evaluating').addClass('hidden');                
                    if(response&&response.error)
                    {
                        $('#result').removeClass('hidden');
                        $('#result').html('<span class="txt-color-red font-md"><u>Error</u></span><br/><span class="txt-color-red">'+response.error+'<span>')
                    }
                    else
                    {
                        if(response&&response.result)
                        {
                            $('#result').removeClass('hidden');
                            $('#result').html('<span class="txt-color-green font-md"><u>Result</u></span><br/><span>'+response.result+'<span>')
                        }
                        else
                        {
                            $('#evaluating').addClass('hidden');
                            $('#evaluatingError').removeClass('hidden');
                        }
                    }                
                }).error(function(data, status){
                    $scope.actionDisabled=false;
                    $('#evaluating').addClass('hidden');
                    $('#evaluatingError').removeClass('hidden');
                });
          }
        $scope.autoSave=function()
        {
            var timeout=10000;
            var id_exam_has_student_has_question=$scope.question.id_exam_has_student_has_question;
            if($scope.sectionId&&$scope.question&&$scope.answer!=null&&$scope.answer!='')
            {
                if($scope.question.answer_status!='correct'&&$scope.question.answer_status!='wrong'&&$scope.question.answer_status!='answered'&&$scope.question.answer_status!='attempted_rvw')
                {    
                    $scope.section.attempted++;
                    $scope.section.not_attempted--;
                }
                $scope.question.answer_status='correct';
                $scope.examQuestionStatus=true;
                $http({
                    method: "POST",
                    timeout:timeout,
                    url: SITE_URL+'updateExamQuestionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:$scope.sectionId,id_exam_has_student_has_question:$scope.question.id_exam_has_student_has_question,answer_status:$scope.question.answer_status,answer:$scope.answer}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(data, status) {
                    {
                        if(id_exam_has_student_has_question==$scope.question.id_exam_has_student_has_question)
                        {
                            var currentQuestion=$scope.currentQuestion-1;
                            $scope.section.questions[currentQuestion].answer=$scope.answer;
                            $scope.section.questions[currentQuestion].answer_status=data.answer_status;
                            $scope.examQuestionStatus=false;
                            $("#saveDiv1").removeClass('hidden');
                            $( "#saveDiv1" ).fadeIn(1000, "linear",function(){$( "#saveDiv1" ).fadeOut(2000, "linear")});
                        }
                    }
                }).error(function(data, status){
                    $scope.examQuestionStatus=false;
                });
            }
        }
        $scope.loadQuestion=function(id_exam_has_student_has_question,questionobj){
            if(questionobj&&($scope.actionDisabled||questionobj.answer_status=='not_viewed'))
                return false;
            $scope.markreview=null;
            var currentQuestion=1;
            var status=false;
            angular.forEach($scope.section.questions, function(question) {
                if(question.id_exam_has_student_has_question==id_exam_has_student_has_question)
                {
                    $scope.question=question; 
                    if($scope.question.answer_status=='attempted_rvw'||$scope.question.answer_status=='skipped_rvw')
                        $scope.markreview=true;
                    $scope.answer=$scope.question.answer;
                    $scope.id_exam_has_student_has_question=$scope.question.id_exam_has_student_has_question;
                    if(question.answer_status=='not_viewed')
                    {
                        question.answer_status='not_attempted';
                        $scope.updateExamQuestionStatus($scope.question);                    
                    }
                    status=true;
                }            
                if(!status)
                    currentQuestion++;            
            });
            $scope.currentQuestion=currentQuestion;
            if($scope.question&&$scope.question.id_programming_language&&$scope.question.id_programming_language!=null)
                $scope.initiateProgrammingLanguage($scope.question.id_programming_language);
            if($scope.examType=='advanced'&&$scope.id_pattern!='3')
                $scope.initiateWritingAbility();
            
           
        };
        $scope.skipQuestion=function(){
            var currentQuestion=$scope.currentQuestion-1;
            var status=false;
            var timeout=15000;
            var answer_status=$scope.section.questions[currentQuestion].answer_status;
            if($scope.section.questions[currentQuestion].answer_status=='not_attempted'||$scope.section.questions[currentQuestion].answer_status=='skipped_rvw'||$scope.section.questions[currentQuestion].answer_status=='skipped')
            {
                if($scope.markreview)
                    answer_status='skipped_rvw';
                else
                    answer_status='skipped';
                $scope.section.questions[currentQuestion].answer=null;
            }
            else
            {
                if($scope.section.questions[currentQuestion].answer_status=='attempted_rvw')
                {
                    if($scope.markreview)
                        answer_status='attempted_rvw';
                    else
                        answer_status='answered';
                }
            }
            //$scope.updateExamQuestionStatus($scope.section.questions[currentQuestion]);
            $scope.actionDisabled=true;            
            $scope.examQuestionStatus=true;
            $http({
                    method: "POST",
                    timeout:timeout,
                    url: SITE_URL+'updateExamQuestionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:$scope.sectionId,id_exam_has_student_has_question:$scope.section.questions[currentQuestion].id_exam_has_student_has_question,answer:$scope.section.questions[currentQuestion].answer,answer_status:answer_status}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    $scope.actionDisabled=false;
                    $scope.examQuestionStatus=false;
                    $scope.section.questions[currentQuestion].answer_status=answer_status;
                    if(data.answer_status)
                        $scope.section.questions[currentQuestion].answer_status=data.answer_status;
                    currentQuestion=$scope.getNextQuestionIndex(currentQuestion);
                    $scope.question=$scope.section.questions[currentQuestion];
                    if($scope.question&&$scope.question.id_programming_language&&$scope.question.id_programming_language!=null)
                        $scope.initiateProgrammingLanguage($scope.question.id_programming_language);
                    if($scope.examType=='advanced'&&$scope.id_pattern!='3')
                        $scope.initiateWritingAbility();

                    $scope.answer=$scope.question.answer;
                    if($scope.section.questions[currentQuestion].answer_status=='not_viewed')
                    {
                        $scope.question.answer_status='not_attempted';
                    }
                    $scope.updateExamQuestionStatus($scope.question);
                    $scope.currentQuestion=currentQuestion+1;
                    $scope.markreview=null;
                    if($scope.question.answer_status=='attempted_rvw'||$scope.question.answer_status=='skipped_rvw')
                        $scope.markreview=true;
                })
                .error(function(data, status){
                    $scope.actionDisabled=false;
                    $scope.examQuestionStatus=false;
                });            
        };
        $scope.submitAnswer=function()
        {
            var timeout=15000;
            $scope.selectAnswer=false;                
            var currentQuestion=$scope.currentQuestion-1;
            if($scope.examType=='advanced'&&$scope.id_pattern=='3'&&$scope.question.id_programming_language!=null)
            {
                $scope.answer=editor.getValue();
                timeout=25000;
                if ($scope.answer == '' || $scope.answer == null)
                {
                    $scope.selectAnswer = true;
                    $timeout(function () {
                        $scope.selectAnswer = false;
                    }, 2000);
                    return false;
                }
            }
            if($scope.examType=='pattern'&&($scope.answer==''||$scope.answer==null))
            {
                $scope.selectAnswer=true;
                $timeout(function(){$scope.selectAnswer=false;},2000);
                return false;
            }
            if($scope.examType=='advanced'&&$scope.id_pattern!='3')
            {
                if($scope.answer==''||$scope.answer==null)
                {
                    $scope.selectAnswer=true;
                    $timeout(function(){$scope.selectAnswer=false;},2000);
                    return false;
                }
            }
            $scope.actionDisabled=true;            
            $scope.examQuestionStatus=true;
            var prev_answer_status=$scope.question.answer_status;
            var answer_status="answered";
            if($scope.markreview)
            {
                answer_status='attempted_rvw';
            }
            $http({
                    method: "POST",
                    timeout:timeout,
                    url: SITE_URL+'updateExamQuestionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:$scope.sectionId,id_exam_has_student_has_question:$scope.question.id_exam_has_student_has_question,answer_status:answer_status,answer:$scope.answer}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    $scope.actionDisabled=false;
                    $scope.examQuestionStatus=false;
                    currentQuestion=$scope.getNextQuestionIndex(currentQuestion); 
                    $scope.question.answer=$scope.answer;
                    if(data.answer_status)
                        $scope.question.answer_status=data.answer_status;
                    if(prev_answer_status&&prev_answer_status!='wrong'&&prev_answer_status!='answered'&&prev_answer_status!='attempted_rvw')
                    {    
                        $scope.section.attempted++;
                        $scope.section.not_attempted--;
                    }
                    // $scope.updateExamQuestionStatus($scope.question);
                    $scope.question=$scope.section.questions[currentQuestion];
                    if($scope.question&&$scope.question.id_programming_language&&$scope.question.id_programming_language!=null)
                        $scope.initiateProgrammingLanguage($scope.question.id_programming_language);
                    if($scope.examType=='advanced'&&$scope.id_pattern!='3')
                        $scope.initiateWritingAbility();
                    $scope.answer=$scope.question.answer;
                    if($scope.section.questions[currentQuestion].answer_status=='not_viewed')
                    {
                        $scope.question.answer_status='not_attempted';
                        $scope.updateExamQuestionStatus($scope.question);            
                    }
                    $scope.currentQuestion=currentQuestion+1;
                    $scope.markreview=null;
                    if($scope.question.answer_status=='attempted_rvw'||$scope.question.answer_status=='skipped_rvw')
                        $scope.markreview=true;
                })
                .error(function(data, status){
                    $scope.actionDisabled=false;
                    $scope.answer=$scope.question.answer;
                    $scope.examQuestionStatus=false;
                });
            
        };
        $scope.nextSection=function(nextSectionId)
        {
            $scope.confirmSectionStatus=false;
            $scope.confirmFinishStatus=false;
            $scope.exitTestStatus=false;
            $scope.timerRunning = false;
            if(nextSectionId!=null)
            {
                $scope.nextSectionIndex=nextSectionId;
            }
            else
                nextSectionId=$scope.nextSectionIndex;
            $scope.sectionInfo=false;
            if($scope.sectionId)
            {
                if($scope.examType=='advanced'&&$scope.id_pattern!='3'&&$scope.question)
                    $scope.autoSave();                
            }
            $scope.sectionId=$scope.sections[nextSectionId].id_section;
            $scope.section=$scope.sections[nextSectionId];
            if($scope.section.status=='not_attempted')
                $scope.setStudentExamSectionStatus($scope.sectionId,'viewed')
            if($scope.section.duration<=0)
            {
                if($scope.getNextSectionIndex()==null)
                {
                    $scope.examQuestionStatus=true;        
                    $scope.finishTest();
                    return;
                }
                else
                {
                    $scope.goToNextSection();
                    $scope.nextSectionIndex=$scope.getNextSectionIndex();
                    return;
                }
            }
            $scope.section.status='viewed';
            $scope.currentQuestion=1;
            $scope.markreview=null;
            $scope.question=$scope.section.questions[0];
            if($scope.question.answer_status=='attempted_rvw'||$scope.question.answer_status=='skipped_rvw')
                $scope.markreview=true;
            if($scope.question&&$scope.question.id_programming_language&&$scope.question.id_programming_language!=null)
                $scope.initiateProgrammingLanguage($scope.question.id_programming_language);
            if($scope.examType=='advanced'&&$scope.id_pattern!='3')
                $scope.initiateWritingAbility();
            $scope.answer=$scope.question.answer;
            if($scope.question.answer_status=='not_viewed')
            {
                $scope.question.answer_status='not_attempted';
                $scope.updateExamQuestionStatus($scope.question);            
            }
            $scope.id_exam_has_student_has_question=$scope.question.id_exam_has_student_has_question;
            $scope.currentSection=$scope.currentSection+1;
            $('timer').removeClass('timer-red');
            if($scope.section.duration<60)
                $('timer').addClass('timer-red');
            $scope.$broadcast('timer-set-countdown-seconds', $scope.section.duration);
            document.getElementById('mainScreen').getElementsByTagName('timer')[0].start();
            document.getElementById('sectionInfo').getElementsByTagName('timer')[0].clear();
            $scope.timerRunning = true;
            $scope.updateStudentExamStatus();
            $scope.nextSectionIndex=$scope.getNextSectionIndex();
        };
        $scope.goToNextSection=function()
        {
            $scope.actionDisabled=true;
            $http({
                    method: "POST",
                    timeout:15000,
                    url: SITE_URL+'setStudentExamSectionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:$scope.sectionId}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    $scope.confirmSectionStatus=false;
                    $scope.confirmFinishStatus=false;
                    $scope.exitTestStatus=false;
                    $('timer').addClass('timer-red');
                    $scope.$broadcast('timer-set-countdown-seconds', 10);
                    document.getElementById('sectionInfo').getElementsByTagName('timer')[0].start();
                    document.getElementById('mainScreen').getElementsByTagName('timer')[0].clear();
                    $scope.timerRunning = true;
                    $scope.section.status='attempted';
                    $scope.sectionInfo=true;
                    $scope.updateStudentExamStatus;
                    $scope.actionDisabled=false;
                })
                .error(function(data, status){
                    $scope.actionDisabled=false;
                });
            
        }
        $scope.unsetAnswer=function()
        {
            $scope.question.answer_status='not_attempted';
            $scope.question.answer=null;
            $scope.answer=null;
            $scope.section.attempted--;
            $scope.section.not_attempted++;
            $scope.updateExamQuestionStatus($scope.question);            
        };
        $scope.finishTest=function()
        {
            $scope.actionDisabled=true;
            if($scope.section)
            {
                if($scope.examType=='advanced'&&$scope.id_pattern!='3'&&$scope.question)
                    $scope.autoSave();
                $scope.setStudentExamSectionStatus($scope.sectionId)
                $scope.section.status='attempted';
            }
            $http({
            method: "POST",
            timeout:90000,
            url: SITE_URL+'finishTest',
            data:$.param({'id_exam':$scope.id_exam,'status':'completed'}),                    
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data) {
                $scope.actionDisabled=false;
                $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0,'marks':0};
                $scope.sections=data.sections;  
                $scope.finishTestStatus=true;
                $scope.confirmFinishStatus=false;
                $scope.exitTestStatus=false;
                $scope.confirmFinishStatus=false;
                $scope.examQuestionStatus=true;   
                if(document.getElementsByTagName('timer'))
                {
                    for(var i=0;i<document.getElementsByTagName('timer').length;i++)
                    {
                        document.getElementsByTagName('timer')[i].clear();                            
                    }
                }
                if(interval!=null)
                {
                    $interval.cancel(interval);
                    interval=null
                }
                if(autoSaveInterval!=null)
                {
                    $interval.cancel(autoSaveInterval);
                    autoSaveInterval=null;
                }
                if($scope.progressDiv)
                {
                    percent1 = 0;            
                    effectFadeToggle('msg_div');
                    $scope.loadingProgress(percent1+'%');
                }
                else
                {
                    if($scope.examType=='pattern'||($scope.examType=='advanced'&&$scope.id_pattern=='3')&&!$scope.showExplanationAnswer&&document.getElementById('logoutDiv')&&document.getElementById('logoutDiv').getElementsByTagName('timer'))
                    {
                        $('timer').addClass('timer-red');
                        $scope.$broadcast('timer-set-countdown-seconds', 10);
                        document.getElementById('logoutDiv').getElementsByTagName('timer')[0].start();
                    }
                }
                FreshWidget.init("", {"queryString": "&widgetType=popup", "widgetType": "popup", "buttonType": "text", "buttonText": "Feedback", "buttonColor": "black", "buttonBg": "#B8B8B8", "alignment": "2", "offset": "235px", "formHeight": "500px", "url": "https://formac.freshdesk.com"} );            
            }).error(function(data, status){
                $scope.actionDisabled=false;
                });
            
        }
        $scope.setFinishTestStatus=function(status)
        {

            $http({
            method: "POST",
            timeout:60000,
            url: SITE_URL+'finishTest',
            data:$.param({'id_exam':$scope.id_exam,'status':status}),                    
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data) {
                $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0,'marks':0};
                $scope.sections=data.sections;                
            });
        }
        $scope.getNextSectionIndex=function(status)
        {
            var start=false;
            var nextSectionIndex=null;
            var i=0;
            if(status&&status=='viewed')
            {
                for(i=0;i<$scope.sections.length;i++)
                {
                    if($scope.sections[i].status=='viewed'||$scope.sections[i].status=='not_attempted')
                        return i;
                }
                return null;
            }
            for(i=0;i<$scope.sections.length;i++)
            {
                if(nextSectionIndex==null&&($scope.sections[i].status=='not_attempted'))
                    nextSectionIndex=i;
                if(start)
                {
                    if($scope.sections[i].status=='not_attempted')
                        return i;
                }
                if($scope.nextSectionIndex==i)  
                    start=true;
            }
            for(var i=0;i<$scope.sections.length;i++)
            {
                if($scope.sections[i].status=='not_attempted')
                    return i;
            }
            return nextSectionIndex;
        }
        $scope.getSectionIndex=function(idSection)
        {
            var i=0;
            for(i=0;i<$scope.sections.length;i++)
            {
                if($scope.sections[i].id_section==idSection)
                {
                    return i;
                }
            }
        }
        $scope.getNextQuestionIndex=function(currentQuestionIndex)
        {
            var start=false;
            var nextQuestionIndex=null;
            for(var i=0;i<$scope.section.number_of_questions;i++)
            {
                if(nextQuestionIndex==null && ($scope.section.questions[i].answer_status=='not_viewed'||$scope.section.questions[i].answer_status=='not_attempted'||$scope.section.questions[i].answer_status=='skipped'||$scope.section.questions[i].answer_status=='skipped_rvw'||$scope.section.questions[i].answer_status=='attempted_rvw'))
                    nextQuestionIndex=i;
                if(start)
                {
                    if($scope.section.questions[i].answer_status=='not_viewed'||$scope.section.questions[i].answer_status=='not_attempted'||$scope.section.questions[i].answer_status=='skipped'||$scope.section.questions[i].answer_status=='skipped_rvw'||$scope.section.questions[i].answer_status=='attempted_rvw')
                        return i;
                }
                if(currentQuestionIndex==i)  
                    start=true;
            }
            if(nextQuestionIndex!=null&&$scope.section.questions.length==$scope.section.number_of_questions)
                return nextQuestionIndex;
            start=false;
            for(var i=0;i<$scope.section.number_of_questions;i++)
            {
                if(nextQuestionIndex==null && ($scope.section.questions[i].answer_status=='correct'||$scope.section.questions[i].answer_status=='wrong'||$scope.section.questions[i].answer_status=='answered'))
                    nextQuestionIndex=i;
                if(start)
                {
                    if($scope.section.questions[i].answer_status=='correct'||$scope.section.questions[i].answer_status=='wrong'||$scope.section.questions[i].answer_status=='answered')
                        return i;
                }
                if(currentQuestionIndex==i)  
                    start=true;
            }
            if(nextQuestionIndex!=null&&$scope.section.questions.length==$scope.section.number_of_questions)
                return nextQuestionIndex;
            return currentQuestionIndex;
        };
        $scope.setStudentExamSectionStatus=function(id_section,status)
        {
            $http({
                    method: "POST",
                    timeout:15000,
                    url: SITE_URL+'setStudentExamSectionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:id_section,status:status}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    if(data.status)
                        data.status;
                })
                .error(function(data, status){
                });
        }
        $scope.updateExamQuestionStatus=function(question)
        {
            $scope.examQuestionStatus=true;
            $http({
                    method: "POST",
                    timeout:15000,
                    url: SITE_URL+'updateExamQuestionStatus',
                    data : $.param({id_exam:$scope.id_exam,id_section:$scope.sectionId,id_exam_has_student_has_question:question.id_exam_has_student_has_question,answer_status:question.answer_status,answer:question.answer}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                .success(function(data, status) {
                    $scope.examQuestionStatus=false;
                    if(data.answer_status)
                        question.answer_status=data.answer_status;
                })
                .error(function(data, status){
                    $scope.examQuestionStatus=false;
                });
        }
        $scope.updateStudentExamStatus=function()
        {
            if(!$scope.examQuestionStatus&&!$scope.finishTestStatus)
            {    
                var data={id_exam:$scope.id_exam};
                data.id_section='';
                if($scope.sectionId)
                    data.id_section=$scope.sectionId;
                if($scope.question && $scope.question.id_exam_has_student_has_question)
                    data.id_exam_has_student_has_question=$scope.question.id_exam_has_student_has_question;
                if($scope.sectionInfo)
                {
                    data.id_section='';
                    data.id_exam_has_student_has_question='';
                }
                if($scope.extraTime&&$scope.extraTime!='')
                {
                    data.extra_time=$scope.extraTime;
                }
                $http({
                        method: "POST",
                        url: SITE_URL+'updateStudentExamStatus',
                        data : $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                    })
                    .success(function(data, status) {
                        if(data.status)
                            $scope.status=data.status;
                            if(data.examStatus!='started')
                            {
                                $scope.logout();
                            }
                    })
                    .error(function(data, status){

                    });
            }
        }
        $scope.confirmExit=function()
        {
            $scope.exitTestStatus=true;
            $scope.confirmSectionStatus=false;
            $scope.confirmFinishStatus=false;
            $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0};
            angular.forEach($scope.sections, function(section) {
                $scope.sectionTotal.number_of_questions+=section.number_of_questions;
                $scope.sectionTotal.attempted+=section.attempted;
            });
        }
        $scope.exitTest=function()
        {
            $scope.actionDisabled=true;
            $http({
            method: "POST",
            timeout:60000,
            url: SITE_URL+'finishTest',
            data:$.param({'id_exam':$scope.id_exam,'status':'exited'}),                    
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data) {
                $scope.actionDisabled=false;
                $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0,'marks':0};
                $scope.sections=data.sections; 
                $scope.finishTestStatus=true;
                $scope.exitTestStatus=false;
                $scope.confirmFinishStatus=false;
                $scope.examQuestionStatus=true;
                $scope.logoutPressedStatus=true;
                if(document.getElementsByTagName('timer'))
                {
                    for(var i=0;i<document.getElementsByTagName('timer').length;i++)
                    {
                        document.getElementsByTagName('timer')[i].clear();                            
                    }
                }
                if(interval!=null)
                {
                    $interval.cancel(interval);
                    interval=null
                }
                if(autoSaveInterval!=null)
                {
                    $interval.cancel(autoSaveInterval);
                    autoSaveInterval=null;
                }
                if($scope.progressDiv)
                {
                    percent1 = 0;            
                    effectFadeToggle('msg_div');
                    $scope.loadingProgress(percent1+'%');
                }
                else
                {
                    if($scope.examType=='pattern'||($scope.examType=='advanced'&&$scope.id_pattern=='3')&&!$scope.showExplanationAnswer&&document.getElementById('logoutDiv')&&document.getElementById('logoutDiv').getElementsByTagName('timer'))
                    {
                        $('timer').addClass('timer-red');
                        $scope.$broadcast('timer-set-countdown-seconds', 10);
                        document.getElementById('logoutDiv').getElementsByTagName('timer')[0].start();
                    }
                }
                FreshWidget.init("", {"queryString": "&widgetType=popup", "widgetType": "popup", "buttonType": "text", "buttonText": "Feedback", "buttonColor": "black", "buttonBg": "#B8B8B8", "alignment": "2", "offset": "235px", "formHeight": "500px", "url": "https://formac.freshdesk.com"} );
            }).error(function(data, status){
                $scope.actionDisabled=false;
                });            
        }
        $scope.confirmSection=function()
        {
            $scope.exitTestStatus=false;
            $scope.confirmSectionStatus=true;
            $scope.confirmFinishStatus=false;
        }
        $scope.checkSectionAttempted=function()
        {
            var i=0;
            for(i=0;i<$scope.sections.length;i++)
            {
                if($scope.sections[i].status=='attempted')
                    return true;
            }
            return false;
        }
        $scope.confirmFinish=function()
        {
            $scope.exitTestStatus=false;
            $scope.confirmSectionStatus=false;
            $scope.confirmFinishStatus=true;
            $scope.sectionTotal={'number_of_questions':0,'attempted':0,'not_attempted':0,'correct':0,'wrong':0,'score':0};
            angular.forEach($scope.sections, function(section) {
                $scope.sectionTotal.number_of_questions+=section.number_of_questions;
                $scope.sectionTotal.attempted+=section.attempted;
            });
        }
        $scope.showExplanation = function ()
        {
            $scope.sectiondatnew = $scope.sections[0];
            $scope.filteredData = $scope.sections.slice(0, $scope.numPerPage);
            $timeout(function(){$('#sectionAnchor_'+$scope.filteredData[0].id_section).trigger('click')},100);
            if ($scope.explanation == false)
                $scope.explanation = true;
            else
                $scope.explanation = false;

        }
        $scope.logout=function()
        {
            $scope.logoutPressedStatus=true;
            angular.forEach($cookies, function (cookie, key) {
                delete $cookies[key];                
             });
            $location.path('/login');
        }
        $scope.message="";
         
       $scope.closeExamPopup = function ()
        {
            $location.path('/login');
        }
       $scope.loadingProgress=function(percent){
            $('#progress span').animate({width:percent},100,function(){
                $(this).children().html(percent);

                if(percent=='1%'){
                    $('#cal_done').removeClass('hidden');
                    $('#cal_done').html('Gathering Your Answers');
                    $('#top_msg').addClass('hidden');
                }
                if(percent=='30%'){
                    $('#cal_done').removeClass('hidden');
                    $('#cal_done').html('Calculating Result');
                    $('#top_msg').addClass('hidden');
                }    
                if(percent=='60%'){
                    $('#cal_done').removeClass('hidden');
                    $('#cal_done').html('Generating Report');
                    $('#top_msg').addClass('hidden');
                }    
                if(percent=='100%'){
                    $(this).children().html('');

                    $timeout(function(){
                        $scope.progressDiv=false;
                    },100);
                }
                percent1=percent1+1;
                if(percent1<=100){
                    $scope.loadingProgress(percent1+'%');
                }                
            })
        }
        $scope.hideOfflineDiv=function()
        {
            $rootScope.offlineDiv = false;
            $rootScope.offline = false; 
            b = new Date();
            var connectionLostTime=(dateDifferenceInSeconds(a,b))+1;
            //checkExam(connectionLostTime);
            if(!$scope.sectionInfo&&$scope.question&&document.getElementById('mainScreen').getElementsByTagName('timer'))
            {
                $scope.extraTime=connectionLostTime;
                $scope.updateStudentExamStatus();
                $scope.extraTime='';
                document.getElementById('mainScreen').getElementsByTagName('timer')[0].resume();   
                //document.getElementById('mainScreen').getElementsByTagName('timer')[0].addCDSeconds(connectionLostTime);
            }
            if($scope.sectionInfo&&document.getElementById('sectionInfo').getElementsByTagName('timer'))
                document.getElementById('sectionInfo').getElementsByTagName('timer')[0].resume();   
        }
        $scope.currentQuestion=1;
        $scope.markreview=null;
        $scope.timerRunning = true;
        $scope.loading=false;
        if($scope.examType=='advanced'&&$scope.id_pattern!='3')
            autoSaveInterval=$interval($scope.autoSave, 10000);
        if($scope.exam.current_id_section!=null&&$scope.exam.current_id_section!=''&&$scope.exam.current_id_section!='0')
        {
//            if($scope.getNextSectionIndex()==null)
//            {
//                $scope.finishTest();
//                return;
//            }
//            else
//            {
                var sectionIndex=$scope.getSectionIndex($scope.exam.current_id_section);
                $scope.nextSection(sectionIndex);
                if($scope.exam.current_id_exam_questions!=null)
                {
                    $scope.loadQuestion($scope.exam.current_id_exam_questions);
                }
            }
//        }
        else
        {
            if($scope.checkSectionAttempted())
            {
                $scope.nextSectionIndex=$scope.getNextSectionIndex('viewed');
                $scope.sectionInfo = true;
            }
            else
            {
                $scope.nextSectionIndex=$scope.getNextSectionIndex();
                $scope.sectionInfo=false;
                $scope.nextSection($scope.nextSectionIndex);            
            }
        }
        $scope.updateStudentExamStatus();
        interval=$interval($scope.updateStudentExamStatus, 10000);
        document.getElementById('sectionInfo').getElementsByTagName('timer')[0].start();
        $scope.$on('timer-stopped', function (event, data){
            if($rootScope.offline == false)
            {
                if(!$scope.sectionInfo&&$scope.nextSectionIndex!=null)
                    $scope.goToNextSection();
                else
                {
                    if($scope.finishTestStatus&&!$scope.progressDiv)
                        $location.path('/login');
                    else
                    {
                        if(!$scope.finishTestStatus)
                        {
                            if($scope.nextSectionIndex!=null)
                                $scope.nextSection();
                            else
                                $scope.finishTest();
                        }
                    }
                }
                $scope.$apply(); 
            }
        });
        $scope.$on('timer-tick', function (event, args) {
            if(!$scope.sectionInfo)
            {
                if(args.millis<60000)
                {
                    $('timer').addClass('timer-red');
                }
                $scope.section.duration--;
            }
        });        
      });
      
        /*if (window.addEventListener) {
            window.addEventListener("offline", function(e) {
                $rootScope.offlineDiv = true;
                $rootScope.offline = true;                   
                            //alert("offline");
              }, false);

              window.addEventListener("online", function(e) {
                  $scope.updateStudentExamStatus();
                  $rootScope.offline = false;
              }, false);
          }
        else {
            document.body.ononline = function() {
              $rootScope.offlineDiv = true;
                $rootScope.offline = true;  
            };
            document.body.onoffline = function() {
                $rootScope.offline = false;
              $scope.updateStudentExamStatus();
            };
          }*/
      window.onbeforeunload = function (e) {
        if(!$scope.logoutPressedStatus){
            $scope.setFinishTestStatus('browser_closed'); 
        }                   
    };
    $timeout(function () {
        $scope.$watch('currentPage + numPerPage', function () {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            if($scope.sections&&$scope.sections.length>0)
                $scope.filteredData = $scope.sections.slice(begin, end);
        }), 1500
    });
});
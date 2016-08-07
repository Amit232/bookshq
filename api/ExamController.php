<?php

/**
 * Class with all the methods required for Exam Controller
 * @author Rupraj
 * @copyright 2015
 */

class ExamController 
{
    public function __construct() {
    }
    public function __destruct() {
    }
    public function login($examType,$email,$password,$procId)
    {
        
        $examHasStudent=new ExamHasStudent();
        $login=$examHasStudent->checkLogin($examType,$email,$password,$procId);
        $response=array("message"=>"Your Email Id or Password or Proc Id is invalid","status"=>false);            
        if($login&&count($login)>0)
        {
            $minDate=date('Y-m-d H:i:s',  strtotime('now'));
            $maxDate=date('Y-m-d H:i:s',  strtotime('+15 minutes',strtotime('now')));
            $max15Min=date('Y-m-d H:i:s',  strtotime('-30 minutes',strtotime('now')));
            if($login[0]['slot_status']=='ended')
            {
                $response["message"]='Exam is already Ended.';
                return $response;
            }
            elseif($login[0]['slot_status']=='suspended')
            {
                $response["message"]='Exam is currently Suspended.';
                return $response;
            }
            elseif($login[0]['slot_status']=='cancelled')
            {
                $response["message"]='Exam is already Cancelled.';
                return $response;
            }
            /*elseif($login[0]['student_status']=='not_started'&&$login[0]['slot_status']=='started'&&$max15Min>=$login[0]['exam_start_date'])
            {
                echo 'Exam already Started';
                exit;
            }*/
            elseif($login[0]['slot_status']=='not-started'&&$login[0]['slot_time']>=$minDate&&$login[0]['slot_time']<=$maxDate)
            {

            }
            elseif($login[0]['slot_status']=='not-started'&&$minDate>=$login[0]['slot_time'])
            {

            }
            elseif($login[0]['slot_status']=='not-started')
            {
                $response["message"]='Exam is not started yet.';
                return $response;
            }
            elseif($login[0]['student_status']=='blocked')
            {
                $response["message"]='You are blocked by Exam Administrator.';
                return $response;
            }
            elseif($login[0]['student_status']=='present'||$login[0]['student_status']=='in_progress')
            {
                $response["message"]='You are already Logged in to this exam.';
                return $response;
            }
            elseif($login[0]['student_status']=='crashed')
            {
                $response["message"]='Please contact administrator to recover your exam.';
                return $response;
            }
            elseif($login[0]['student_status']=='exited'||$login[0]['student_status']=='browser_closed')
            {
                $response["message"]='You have already attempted and exited this exam.';
                return $response;
            } 
            elseif($login[0]['student_status']=='completed')
            {
                $response["message"]='You have already attempted this exam.';
                return $response;
            } 
            elseif($login[0]['slot_status']=='started'&&$login[0]['slot_cutoff_time']!=''&&$minDate>=$login[0]['slot_cutoff_time']&&$login[0]['student_status']!='recovered')
            {
                $response["message"]='This exam has been expired.';
                return $response;
            }
            if($login[0]['student_status']=='not_started'||$login[0]['student_status']=='recovered')
            {
                $utility=new Utility();
                $accessToken = $utility->generateRandomString(22).time();
                $status='in_progress';
                if($login[0]['student_status']=='not_started')
                    $status='present';
                $examRealTime=new ExamRealTime();
                $loginStudent=false;
                if($examType=='pattern')
                    $loginStudent=$examRealTime->updateStudentStatus($utility,$login[0]['id_exam_has_student'],$status,$accessToken);
                elseif($examType=='advanced')
                    $loginStudent=$examRealTime->updateAdvancedStudentStatus($utility,$login[0]['id_exam_has_student'],$status,$accessToken);
                if($loginStudent)
                {
                    
                    if($login[0]['student_status']=='not_started')
                    {
                        $examHasStudentHasQuestion=new ExamHasStudentHasQuestion();
                        $examHasStudentHasQuestion->setStudentExamQuestions($examType,$login[0]);
                    }
                    $login[0]['access_token']=$accessToken;
                    if($login[0]['student_status']=='recovered')
                    {
                        $examSectionModel=new ExamHasStudentHasSection();
                        $examSections=$examSectionModel->getExamHasSections($examType,$login[0]['id_exam_has_student']);
                        if($login[0]['last_accessed_time']!=''&&$examSections&&count($examSections)>0)
                        {
                            foreach($examSections as $section)
                            {
                                if($section['status']=='viewed')
                                {
                                    $extraTime=0;
                                    $totalExtraTime=0;
                                    $timeFirst  = strtotime($login[0]['last_accessed_time']);
                                    $date=date('Y-m-d H:i:s');
                                    $timeSecond = strtotime($date);
                                    $extraTime += ($timeSecond - $timeFirst);
                                    $totalExtraTime=$extraTime;
                                    $spentDuration=  $timeSecond - strtotime($section['date_added']);
                                    if($login[0]['extra_time']!='')
                                        $extraTime+=$login[0]['extra_time'];
                                    if($login[0]['total_extra_time']!='')
                                        $totalExtraTime+=$login[0]['total_extra_time'];
                                    $examHasStudent->setStudentExamStatus($login[0]['id_exam_has_student'],$examType,TRUE,NULL,NULL,NULL,NULL,NULL,NULL,$extraTime,$totalExtraTime);
                                    break;
                                }
                            }
                        }
                        else
                        {
                            $login[0]['student_status']='not_started';
                            $examHasStudent->setStudentExamStatus($login[0]['id_exam_has_student'],$examType,TRUE,NULL,NULL,'present');
                        }
                    }
                    $response['status']=true;
                    $login[0]['exam_type']=$examType;
                    $college=new College();
                    $collegeDetails = $college->getCollegeDetails($login[0]['college_id_college']);
                    $login[0]['college']=$collegeDetails[0];
                    $response['exam']=$login[0]; 
                    return $response;
                }
            }
            else
                return $response;
        }
        else
            return $response;
    }
    /**
	 *  Author -  Rupraj
	 *  Description - Return all the questions sectionwise related to the exam
	 *  Date Updated - 08 Sept 2015
	 *  Request Parameter - id_exam
	 *
	 * @return Response
	 */
    public function getExamQuestions($idExam,$examType,$idExamHasStudent,$details=false)
    {
        $examHasQuestion=new ExamHasStudentHasQuestion();
        $exam=new Exam();
        $examObject=array();
        if($examType=='pattern')
            $examObject=$exam->getExamDetails($idExam);
        elseif($examType=='advanced')
            $examObject=$exam->getAdvancedExamDetails($idExam);
        $examHasStudent=new ExamHasStudent();
        $examHasStudentObject=$examHasStudent->getExamHasStudentDetails($examType,$idExamHasStudent);
        $examQuestions= $examHasQuestion->getStudentExamQuestions($examObject[0],$examType,$examHasStudentObject,$idExamHasStudent,$details);
        $studentStatus=$examHasStudent->setStudentExamStatus($idExamHasStudent,$examType,TRUE);
        if($examQuestions)
            return array('exam'=>$examHasStudentObject+$examObject[0],'sections'=>$examQuestions); 
        else
            return false;
    }
}
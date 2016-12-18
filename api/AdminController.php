<?php

/**
 * Class with all the methods required for Exam Controller
 * @author Chiranjeevi
 * @copyright 2016
 */

class AdminController  
{

    public function __construct() {
    }
    public function __destruct() {
    }

    public function adminLogin($email,$password){

      $adminObj = new Admin();
      $res = $adminObj->adminLogin($email,$password);

      if($res)
      {
        $updateArray=[];
        $utilityObj = new Utility();
        $updateArray['csrf_token']=$utilityObj->generateRandomString(40);
        $id_admin=$res[0]['id_admin'];
        $updateCondition =" id_admin='$id_admin'";
        $adminup = $adminObj->updateAdmin($updateArray,$updateCondition);
        return array('error'=>200,'name'=>$res[0]['username'],'id_admin'=>$res[0]['id_admin'],'csrf_token'=>$updateArray['csrf_token']);
      }
      else
      {
        return array('error'=>403,'message'=>'Invalid User Name and Password');
      }
    }


    public function getAdminLenderbooks($startIndex,$limitIndex)
    {
      $adminObj = new Admin();
      $adminLP = $adminObj->getAdminLenderbooks($startIndex,$limitIndex);
      return $adminLP;
    }

    public function getTransactions($startIndex,$limitIndex)
    {
      $adminObj = new Admin();
      $transactions = $adminObj->getTransactions($startIndex,$limitIndex);
      return $transactions;
    }

    public function changeTransactionStatus($status,$date,$ids,$dueDays){
      $updateInfo=[];
      $dateIssued =$date;
      $updateInfo['date_issued']=$dateIssued;
      $dueDate =  date('Y-m-d', strtotime($updateInfo['date_issued']. ' + '.$config['due_days'].' days'));
      $updateInfo['due_date']=$dueDate;
      $updateInfo['status']=$status;
      for($i=0;$i<count($ids);$i++)
      {
        $trandId=$ids[$i];
        $adminObj = new Admin();
        $updateCondition=" id_sub_transaction ='$trandId'";
        $res = $adminObj->updateTransaction($updateInfo,$updateCondition);
      
      }
      $message="Transaction updated successfully";
      return array('message'=>$message); 
      
    }

    public function addProduct($product,$img,$id_admin)
    {

      $product = json_decode($product);
      
      $adminObj = new Admin();
      $id_lender_notification='';
      $insertInfo =array();
      $file = $img['file'];
      $file_name = $product->name."_".time()."_".$file['name'];
      $file_size = $file['size'];
      $file_tmp =$file['tmp_name'];

      $file_ext=strtolower(end(explode('.',$file['name'])));
      $expensions= array("jpeg","jpg","png");
      if(in_array($file_ext,$expensions)=== false){
           echo $error="extension not allowed, please choose a JPEG or PNG file.";
           exit;
      }
      if($file_size > 1000000){
           $errors[]='File size must be less than 1 MB';
        }
      else{
        move_uploaded_file($file_tmp,"../uploads/".$file_name);
      }  
      $insertInfo['admin_id_admin'] = $id_admin;
      $insertInfo['isbn'] = $product->isbn;
      $insertInfo['name'] = ucfirst($product->name);
      $insertInfo['description'] = ucfirst($product->description);
      $insertInfo['author'] = ucfirst($product->author);

      if($product->user_id_user&&$product->user_id_user!='')
      {
              $insertInfo['user_id_user'] =$product->user_id_user ;

      }
      else
      {
        $insertInfo['user_id_user'] = NULL;
      }

      if($product->id_lender_notification&&$product->id_lender_notification!='')
      {
        $id_lender_notification=$product->id_lender_notification;
      }
      else
      {
        $id_lender_notification='';
      }


      $insertInfo['category_id_category'] = $product->category;
      $insertInfo['copies'] = $product->copies;
      $insertInfo['pic_name'] = NULL;
      $insertInfo['pic']=$file_name;
      $insertInfo['created_at'] = date('Y-m-d H:i:s');
      $insertInfo['updated_at'] = date('Y-m-d H:i:s');
     
      $res = $adminObj->setProduct($insertInfo);

      if($res)
      {
        if ($img)
        {
           
            /*$updateArrayNew=array('pic'=>$file_name);
            $updateCondition=" id_product='$res'";
            $updateStudentProfile=$adminObj->updateProduct($updateCondition,$updateArrayNew);*/
        }
        if($id_lender_notification!='')
        {
          $updateArray=[];
          $updateArray['status']=1;
          $updateCondition=" id_lender_product_notification='$id_lender_notification'";
          $res1= $adminObj->updateLenderStatus($updateArray,$updateCondition);
        }
        return array('error'=>200,'message'=>'Product added successfully.');
      }

    }

    public function getAdminProducts($startIndex,$limitIndex)
    {
      $adminObj = new Admin();
      $res = $adminObj->getAdminProducts($startIndex,$limitIndex);
      return $res;
    }

    public function getAllOrganization($startIndex,$limitIndex){
      $adminObj = new Admin();
      $res = $adminObj->getAllOrganization($startIndex,$limitIndex);
      return $res;
    }

    public function updateOrganizationDetail($id_organization,$status){
      $adminObj = new Admin();
      $updateArray =[];
      $updateArray['status']=$status;
      $updateCondition=" id_organization='$id_organization'";
      $res = $adminObj->updateOrganizationDetail($updateArray,$updateCondition);
      if($res)
      {
        return array('message'=>'Organization updated successfully');
      }
    }

    public function addAdminOrganization($id_admin,$Organization)
    {
      $adminObj = new Admin();
      $insertInfo = [];
      $insertInfo['name'] = ucfirst($Organization['name']);
      $insertInfo['address'] = $Organization['address'];
      $insertInfo['admin_id_admin'] = $id_admin;
      $insertInfo['status'] = 1;
      $insertInfo['created_at'] = date('Y-m-d H:i:s');
      $insertInfo['user_id_user'] =NULL;
      $res = $adminObj->addAdminOrganization($insertInfo);
      if($res)
      {
        return array('message'=>'Organization added successfully');
      }

    }

    public function deleteOrganization($id_organization)
    {
      $adminObj = new Admin();
      $res = $adminObj->deleteOrganization($id_organization);
      return array('message'=>'Organization deleted successfully');

    }


    public function addNewAdmin($id_admin,$user)
    {
      $adminObj = new Admin();
      $insertInfo = [];
      $insertInfo['username'] = $user['name'];
      $insertInfo['password'] = $user['password'];
      $res = $adminObj->addNewAdmin($insertInfo);
      return array('message'=>'Admin added successfully');

    }

    public function uploadLenderBook($books,$idUser)
    {
      $adminObj = new Admin();
      if($books&&count($books)>0)
      {
        for ($i=0; $i <count($books) ; $i++) { 
          $insertInfo =[];
          $insertInfo['name']=$books[$i];
          $insertInfo['user_id_user']=$idUser;
          $insertInfo['updated_at'] = date('Y-m-d h:i:s');
          $res = $adminObj->uploadLenderBook($insertInfo);
        }
      }
      return array('message'=>count($books).' notification sent. we will contact you shortly in mean time');
    }
}
<?php

/**
 * Class with all the methods required for Exam Controller
 * @author Chiranjeevi
 * @copyright 2016
 */

class AdminController  
{

    public function __construct() {
      $this->custom_sms_message='Your order #';
      $this->custom_sms_message1=' has been delivered. Your due date is ';
      $this->custom_sms_message2='.There after you will be charged addition 20Rs/Day for each book';
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
      $dueDate =  date('Y-m-d', strtotime($updateInfo['date_issued']. ' + '.$dueDays.' days'));
      $updateInfo['due_date']=$dueDate;
      $updateInfo['status']=$status;
      $mainTransactionID ="";
      $adminObj = new Admin();
      for($i=0;$i<count($ids);$i++)
      {
        $trandId=$ids[$i];
        $mainTransactionID = $trandId;
        $updateCondition=" id_sub_transaction ='$trandId'";
        $res = $adminObj->updateTransaction($updateInfo,$updateCondition);
        if($res||!$res){
          if($status=='delivered'){
            $productsDetails  =$adminObj->getSubTrasactionDetails($trandId);
            $smsMessage="";
            $smsMessage.=$this->custom_sms_message.$productsDetails[0]['transaction_id_transaction'].$this->custom_sms_message1.$dueDate.$this->custom_sms_message2;
            $sendSms = sendSms($productsDetails[0]['mobile'],$smsMessage,'123456');
          }
          if($status=='finished'){
            $productObj = new Product();
            $productsDetails  =$productObj->getTrasctionObject($trandId);
            $updateProductInfo = array();
            $updateProductInfo['copies']= $productsDetails[0]['copies']+1;
            $idpro =$productsDetails[0]['id_product']; 
            $updateCondition = "id_product ='$idpro'";
            $updateProDetails = $productObj->updateProductDetail($updateProductInfo,$updateCondition);  
          }
          
        }
      
      }
      if($status=='delivered'){
        if(SEND_ORDER_DELIVERY_EMAIL){


          $productsDetails  =$adminObj->getSubTrasactionDetails($mainTransactionID);
          if($productsDetails){

            $to=$productsDetails[0]['user_email'];
            $from='admin@chainreaders.in';
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo1.jpg';
            $content = 'We are pleased to inform that the following book/s in your order #'.$productsDetails[0]['transaction_id_transaction'].' have been delivered. Enjoy Reading!.';
            $subject='Delivery Confirmation for ChainReaders.in Order #'.$productsDetails[0]['transaction_id_transaction'];
            $message = file_get_contents('../email_templates/delivery.html');
            $message = str_replace('{url}', $url, $message);           
            $message = str_replace('{name}', $productsDetails[0]['buyer_name'], $message);
            $message = str_replace('{img}', $imgurl, $message);
            $message = str_replace('{content}', $content, $message);
            $message = str_replace('{orderpagelink}', SERVER_URL.'/#/orders', $message);

            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $productsDetails[0]['buyer_name'], $subject, $message, $body, $altBody);
            if($mymail){
            }
          }
        }
      }
      if($status=='finished'){
        if(SEND_COMPLETED_RETURN__EMAIL){


          $productsDetails  =$adminObj->getSubTrasactionDetails($mainTransactionID);
          if($productsDetails&&$productsDetails[0]['seler_id']&&$productsDetails[0]['seler_id']!=''){

            $to=$productsDetails[0]['seller_email'];
            $from='admin@chainreaders.in';
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo1.jpg';
            $content = 'We are pleased to inform you that the book/s that you have uploaded have been returned to us. Please feel free to come and collect the book from our ChainReaders associate at your IT park on ( +1 day from the date the book has been returned to us )';

            $subject= 'Book Return Order';
            $message = file_get_contents('../email_templates/returnbook.html');
            $message = str_replace('{url}', $url, $message);           
            $message = str_replace('{name}', $productsDetails[0]['seler_name'], $message);
            $message = str_replace('{img}', $imgurl, $message);
            $message = str_replace('{content}', $content, $message);
            $message = str_replace('{orderpagelink}', SERVER_URL.'/#/orders', $message);
            $message1="";
            $now = time(); // or your date as well
            /*$date_issued = strtotime($productsDetails[0]['date_issued']);
            $date_due = strtotime($productsDetails[0]['returned_date']);
            $datediff = $date_due - $date_issued;*/
            $date_due=date_create($productsDetails[0]['returned_date']);
            $date_issued=date_create($productsDetails[0]['date_issued']);
            $diff=date_diff($date_issued,$date_due);
            $noOfdays = $diff->format("%a days");
            if(SHOW_AMOUNT_ON_RETURNING){
              //$noOfdays = ($datediff / (60 * 60 * 24));
              if($noOfdays>0&&$noOfdays>7){
                $remainingDays = $noOfdays % 7;
                $exactweeks = ($noOfdays - $remainingDays) / 7;
                if($exactweeks>DUE_WEEKS){
                  $remainingWeeks = $exactweeks-DUE_WEEKS;
                  $totalAmount = $exactweeks * RSPERWEEK;
                  //$totalAmount+ = $remainingDays*RSDUEPERDAY;
                  if($remainingWeeks>0){
                    $totalAmount+= $remainingWeeks*RSDUEPERWEEK;
                  }
                  if($remainingDays>0){
                    $totalAmount+= (1*RSDUEPERWEEK);
                  }
                  $totalAmountOwedByU = $exactweeks*LENDEDPERWEEK;
                }else{
                  $totalAmount = $exactweeks * RSPERWEEK;
                  if($remainingDays>0){
                    $totalAmount+= (1*RSDUEPERWEEK);
                    $exactweeks++;
                  }
                  $totalAmountOwedByU = $exactweeks*LENDEDPERWEEK;
                }
                
              }else{
                $totalAmount = RSPERWEEK;
                $totalAmountOwedByU = LENDEDPERWEEK;
              }
            }else{
              $noOfdays = ($datediff / (60 * 60 * 24));
              $totalAmount ='-Currently its free-';
              $totalAmountOwedByU = 'free';
            }
            $message1.='<tr>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.$productsDetails[0]['product_name'].'</td>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.RSPERWEEK.'</td>
                        <td style="font-family:arial; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="left">Rs '.$noOfdays.'/day</td>
                         <td style="font-family:arial; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="left">Rs '.$totalAmount.'/day</td>
                        </tr>
                        <tr>
                        <td>
                          Total Amount Owed to you = '.$totalAmountOwedByU.'
                        </td>
                        </tr>';
            $message = str_replace('{section_array}', $message1, $message);


            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $productsDetails[0]['buyer_name'], $subject, $message, $body, $altBody);
            if($mymail){
            }
          }
        }
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
      if(isset($product->ratings)&&$product->ratings!=''){
              $insertInfo['ratings'] = $product->ratings;

      }
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
          $updateArray['product_id_product']=$res;
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

        if(SEND_LENDER_BOOK_EMAIL){
            $userObj = new User();
            $userDetails = $userObj->getUser($idUser);

            $to=$userDetails[0]['email'];
            $from='admin@chainreaders.in';
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo1.jpg';
            $content = 'Thank you for uploading your book on ChainReaders.in. We will intimate you once a request comes in for your book.';
            $subject='Acknowledgement of receipt of your book(s)';
            $message = file_get_contents('../email_templates/lender.html');
            $message = str_replace('{url}', $url, $message);           
            $message = str_replace('{name}', $userDetails[0]['name'], $message);
            $message = str_replace('{img}', $imgurl, $message);
            $message = str_replace('{content}', $content, $message);


            $message1="";
            
            for ($i=0; $i <count($books) ; $i++) {              # code...

            $message1.='<tr>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.$books[$i].'</td>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.date('d M Y',  strtotime(date('Y-m-d H:i:s'))).'</td>';
            }
            $message = str_replace('{section_array}', $message1, $message);

            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $userDetails[0]['name'], $subject, $message, $body, $altBody);
            if($mymail){
            }
        }
        return array('message'=>count($books).' notification sent. We will conact once an order has been placed for one of your book(s)');
      }else{
        return array('message'=>'closepoup');
      }
      
    }
}
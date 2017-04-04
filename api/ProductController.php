<?php

/**
 * Class with all the methods required for Exam Controller
 * @author Chiranjeevi
 * @copyright 2016
 */

class ProductController  
{
    public function __construct() {
      $this->custom_sms_message='We have received your order for order number';
      $this->custom_sms_message1=' and it is being processed. You can expect delivery within 3 days';
      $this->custom_sms_message2='We have received your return request for order #';
      $this->custom_sms_message3=' .You can expect our pickup within 3 days';

    }
    public function __destruct() {
    }


    public function mainSend(){
      $to = 'chiranjeeviadi@gmail.com';
      $name ="cc";
      $subject ="dummy";
      $message ="hello";
      $body ="fd";
      $already ="";
      $mymail = phpmailerObj($to, $name, $subject, $message, $body, $altBody);
      return $mymail;
    }
    public function getCategories()
    {
      /*$to = 'chiranjeeviadi@gmail.com';
      $name ="cc";
      $subject ="dummy";
      $message ="hello";
      $body ="fd";
      $already ="";
      $mymail = phpmailerObj($to, $name, $subject, $message, $body, $altBody);
      die;*/
      $productObj = new Product();
      $categories = $productObj->getCategories();
      return array('categories'=>$categories,'error'=>false);  
   
    }

    public function login($email,$idGoogle,$name,$csrf_token,$imgUrl)
    {
      $userObj = new User();
      $userDetails =  $userObj->checkUserExists1($email);
      if($userDetails&&count($userDetails)>0)
      {
        $updateArray=[];
        $updateArray['csrf_token']=$csrf_token;
        $idUser =$userDetails[0]['id_user'];
        $res = $userObj->updateUserDetails($idUser,$updateArray);
        $userCartDetails=$userObj->getUserProducts($idUser);
        $userDetails = $userObj->getUser($idUser);
        $notifications = $userObj->getNotifications($idUser);

        if(SEND_WELCOME_EMAIL)
        {
          if($userDetails[0]['email_notified']=="0"){
            $to=$email;
            $from='sachin@chainreader.in';
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo.jpg';
            $subject='Welcome to ChainReaders';
            $message = file_get_contents('../email_templates/welcome.html');
            $message = str_replace('{url}', $url, $message);           
            $message = str_replace('{name}', $name, $message);
            $message = str_replace('{img}', $imgurl, $message);
            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $name, $subject, $message, $body, $altBody);
            if($mymail){
                $updateArray['email_notified']='1';
                $res = $userObj->updateUserDetails($idUser,$updateArray);
            }
          }
        }

        return array('user_cart_details'=>$userDetailsCartDetails,'id_user'=>$idUser,'user_detail'=>$userDetails[0],'notifications'=>$notifications);  
      }
      else
      {
        $userInfo=array('name'=>$name,'email'=>$email,'google_id_user'=>$idGoogle,'csrf_token'=>$csrf_token,'img_url'=>$imgUrl,'email_notified'=>'1');
        $res=$userObj->setUser($userInfo);
        if($res)
        {
          if(SEND_WELCOME_EMAIL)
          {
            $to=$email;
            $from=$_SESSION['login_email'];
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo.jpg';
            $subject='Welcome to ChainReaders';
            $message = file_get_contents('../email_templates/welcome.html');
            $message = str_replace('{url}', $url, $message);
            $message = str_replace('{name}', $name, $message);
            $message = str_replace('{img}', $imgurl, $message);

            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $name, $subject, $message, $body, $altBody);
            if($mymail){
                $updateArray['email_notified']='1';
                $res = $userObj->updateUserDetails($idUser,$updateArray);
            }
          }
          $userCartDetails=$userObj->getUserProducts($res);
          $userDetails = $userObj->getUser($res);
          $notifications = $userObj->getNotifications($res);
          return array('user_cart_details'=>$userCartDetails,'id_user'=>$res,'user_detail'=>$userDetails[0],'notifications'=>$notifications);

        }
      }

     
    }

    public function getTrendingBooks()
    {
      $productObj = new Product();
      $trendinigBooks = $productObj->getTrendingBooks();
      if($trendinigBooks)
      {
        return array('error'=>false,'trending_books'=>$trendinigBooks);

      }
      else
      {
        return array('error'=>false,'trending_books'=>$trendinigBooks,'message'=>'No trending books');

      }
    }

    public function getAllProducts($startIndex,$limitIndex,$searchString,$categories,$idUser='')
    {
      //$sms = sendSms('917892026750','hi first mess','917892026750');
      $productObj = new Product();
      $products = $productObj->getAllProducts($startIndex,$limitIndex,$searchString,$categories);
      if(isset($searchString)&&$searchString!=''){
        $insertInfo=array('user_id_user'=>$idUser,'search_text'=>$searchString,'created_at'=>date('Y-m-d H:i:s'));
        $storeSearching = $productObj->storeSearchedFields($insertInfo);
      }
     
      return array('error'=>false,'products'=>$products);
    }   


    public function addProductToCart($id_user,$productDetails)
    {
      $productObj = new Product();
      $insertInfo = [];
      $insertInfo=array('user_id_user'=>$id_user,'product_id_product'=>$productDetails['id_product'],'organization_id_organization'=>$productDetails['organization_id_organization']);
      $checkProructAddedtocart = $productObj->checkProductAddedtocart($productDetails['id_product'],$id_user);
      if($checkProructAddedtocart){
        return array('error'=>true,'message'=>'Product already added to cart.');
      }
      $addtoCartRes = $productObj->addProductToCart($insertInfo);
      if($addtoCartRes)
      {
        return array('error'=>false,'message'=>'Product added to cart successfully.');
      }
      else
      {
        return array('error'=>true,'message'=>'Something went wrong while adding product to cart.');
      }
    } 

    public function getUserProducts($idUser)
    {
      $userObj = new User();
      $prodructs = $userObj->getUserProducts($idUser);
      return $prodructs;
    }

    public function deleteProductFromCart($idUser,$product)
    {
      if(isset($product['id_product'])){
        $id_product = $product['id_product'];
      }
      if(isset($product['product_id_product'])){
        $id_product = $product['product_id_product'];
      }
      $productObj = new Product();
      $userObj = new User();
      $deleteP = $productObj->deleteProductFromCart($idUser,$id_product);
      $userCartDetails=$userObj->getUserProducts($idUser);
      return array('user_cart_details'=>$userCartDetails,'message'=>'Product deleted from cart');  


    }

    public function getOrganizations($status=1,$idOrganization)
    {
      $userObj = new User();
      $oragannizations=$userObj->getOrganizations($idUser);

      return array('oraganizations'=>$oragannizations);  
    }

    public function buyProducts($products,$idUser,$organizationId,$mobile)
    {
      $productObj = new Product();
      $userObj = new User();
      $productIds=array();
      foreach ($products as $product) {
        array_push($productIds, $product['id_product']);
      }
      $recentOrders =array();
      $date=date('Y-m-d');
      $created_at = date('Y-m-d H:i:s');
      $dueDate=date('Y-m-d', strtotime("+15 days"));
      $insertInfo=array();
      $insertInfo['user_id_user']=$idUser;
      $insertInfo['product_ids']=implode(',',$productIds);
      $insertInfo['created_at']=$created_at;
      $alertmessage = false;
      $alertmessageProducts=array();
      foreach ($products as $product) {
          $productDetail= $productObj->getProducts($product['id_product']);
          if($productDetail[0]['copies']>0)
          {
            
          }
          else
          {
            $id_product=$productDetail[0]['id_product'];
            $deleteP = $productObj->deleteProductFromCart($idUser,$id_product);

            $alertmessage=true;
            array_push($alertmessageProducts, $productDetail[0]['name']);
          }
      }
      if($alertmessage)
      {
        $alertmessageProducts=implode(',',$alertmessageProducts);
        $userCartDetails=$userObj->getUserProducts($idUser);
        $message=$alertmessageProducts." products are not available. please try later.";
        return array('error'=>true,'meessage'=>$message,'user_cart_details'=>$userCartDetails);
      }
      else
      {
        $res = $productObj->setTransaction($insertInfo);
        $message="'Your ordered will be delivered in 2 days'";
        foreach ($products as $product) {
            $insertInfo1=array();
            $insertInfo1['user_id_user']=$idUser;
            $insertInfo1['product_id_product']=$product['id_product'];
            $insertInfo1['ordered_date']=$date;
            $insertInfo1['status']='Pending';
            $insertInfo1['transaction_id_transaction']=$res; 
            $insertInfo1['oraganization_id_organization']=$product['organization_id_organization'];

            $res1 = $productObj->setSubTransaction($insertInfo1);
            if($res1)
            {
              $updateInfo=array();
              $productId=$product['id_product'];
              $copies=$product['copies']-1;
              $updateInfo=array('copies'=>$copies);
              $updateCondition=" id_product='$productId'";
              $updateProDetails = $productObj->updateProductDetail($updateInfo,$updateCondition);
            } 
       
          $id_product=$product['id_product'];
          $deleteP = $productObj->deleteProductFromCart($idUser,$id_product);



        }
         if(SEND_INVOICE_EMAIL){
            $userDetails = $userObj->getUser($idUser);

            $to=$userDetails[0]['email'];
            $from='sachin@chainreader.in';
            $url=SERVER_URL; 
            $imgurl=SERVER_URL.'img/logo1.jpg';
            $content = 'We will send you another email once the books in your order have been dispatched.Below is the summary of your order';
            $subject='Your Order with ChainReaders.in # '.$res.' has been successfully placed!';
            $message = file_get_contents('../email_templates/orders.html');
            $message = str_replace('{url}', $url, $message);           
            $message = str_replace('{name}', $userDetails[0]['name'], $message);
            $message = str_replace('{img}', $imgurl, $message);
            $message = str_replace('{content}', $content, $message);
            $message = str_replace('{invoice_id}', '#'.$res, $message);
            $message = str_replace('{invoice_date}',date('d M Y g:i A',  strtotime($created_at)), $message);

            $message1="";
            
            foreach ($products as $product) {              # code...

            $message1.='<tr>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.$product['name'].'</td>
                        <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.$product['author'].'</td>
                        <td style="font-family:arial; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="left">Rs '.RSPERDAY.'/day</td>
                        </tr>';
            }
            $message = str_replace('{section_array}', $message1, $message);

            $body    = $message;
            $altBody = '';
            // call the phpmailerObj on mainConfig.php page
            $mymail = phpmailerObj($to, $name, $subject, $message, $body, $altBody);
            if($mymail){
            }
          }
        $updateArray['mobile']=$mobile;
        $orderNo = $res;
        $res = $userObj->updateUserDetails($idUser,$updateArray);

        $userCartDetails=$userObj->getUserProducts($idUser);
        $smsMessage="";
        $smsMessage.=$this->custom_sms_message.$orderNo.$this->custom_sms_message1;
        $sendSms = sendSms($mobile,$smsMessage,'123456');
        $message='Products are successfully brought by you and Your ordered will be delivered in 2 days';
        return array('error'=>false,'meessage'=>$message,'user_cart_details'=>$userCartDetails);


      }    

    }


    public function addOrganization($idUser,$techParkname,$techParkaddress)
    {
      $userObj = new User();
      $insertInfo=[];
      $insertInfo['name']=$techParkname;
      $insertInfo['address']=$techParkaddress;
      $insertInfo['user_id_user']=$idUser;
      $insertInfo['status']=0;
      $userDetails = $userObj->addOrganization($insertInfo);
      $addP =array('message'=>'Organization added successfully');
      return $userDetails;
    }

    public function getOrders($idUser)
    {
      $userObj =new User();
      $orders =$userObj->getOrders($idUser);
      $lenderedProducts = $userObj->getYourLenderedProducts($idUser);
      $orders =array('orders'=>$orders,'lenderedProducts'=>$lenderedProducts);

      return $orders;

    }

    public function setTransactionStatus($id_user,$id_transaction,$status,$rating,$description,$id_product)
    {

      $productObj = new Product();
      $userObj = new User();
      $adminObj = new Admin();
      $transaction=$id_transaction;

      $status = $status;

      $Updateinfo=[];

      $Updateinfo['status']=$status;

      $Updatecondition=" id_sub_transaction='$transaction'";

      $res = $productObj->setTransactionStatus($Updateinfo,$Updatecondition);
      
      if($status=='in_progress')
      {
        $status='updated';
      }
      $userDetails = $userObj->getUser($id_user);
      $orders =$userObj->getOrders($id_user);
      $lenderedProducts = $userObj->getYourLenderedProducts($id_user);
      if(!isset($rating)){

        $rating ="";
      }
      if(!isset($description)){
        $description="";
      }
        $insertInfo =array();
        $insertInfo['user_id_user']=$id_user;
        $insertInfo['product_id_product']=$id_product;
        $insertInfo['rating']=$rating;
        $insertInfo['description']=$description;
        $insertInfo['created_at']=date('Y-m-d H:i:s');
        $insertInfo['updated_at']=date('Y-m-d H:i:s');
        $userObj = new User();
        $res = $userObj->setProductReview($insertInfo);
        if($res||!$res){
          $smsMessage="";
          $smsMessage.=$this->custom_sms_message2.$transaction.$this->custom_sms_message3;
          $sendSms = sendSms($userDetails[0]['mobile'],$smsMessage,'123456');


          if($status=='updated'){
           if(SEND_ORDER_RETURN_EMAIL){
              $productsDetails  =$adminObj->getSubTrasactionDetails($transaction);
              if($productsDetails){

                $to=$productsDetails[0]['user_email'];
                $from='sachin@chainreader.in';
                $url=SERVER_URL; 
                $imgurl=SERVER_URL.'img/logo1.jpg';
                $content = 'Hope you have enjoyed the reading experience with ChainReaders.in
                            A ChainReaders associate will come and collect the book/s from you.';
                $subject='Return request for book/s '.$productsDetails[0]['product_name'];
                $message = file_get_contents('../email_templates/returnbook.html');
                $message = str_replace('{url}', $url, $message);           
                $message = str_replace('{name}', $productsDetails[0]['buyer_name'], $message);
                $message = str_replace('{img}', $imgurl, $message);
                $message = str_replace('{content}', $content, $message);

                $message1="";
                $now = time(); // or your date as well
                $date_issued = strtotime($productsDetails[0]['date_issued']);
                $date_due = strtotime($productsDetails[0]['due_date']);
                $datediff = $date_due - $date_issued;
                if(SHOW_AMOUNT_ON_RETURNING){
                  $noOfdays = ($datediff / (60 * 60 * 24));
                  if($noOfdays>20){
                    $totalAmount = $noOfdays*RSPERDAY;
                  }else{
                    $totalAmount = (DUE_DAYS*RSPERDAY);
                  }
                }else{
                  $noOfdays = ($datediff / (60 * 60 * 24));
                  $totalAmount ='-Currently its free-';
                }
                $message1.='<tr>
                            <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.$productsDetails[0]['product_name'].'</td>
                            <td style="font-family:arial;font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;" align="left">'.RSPERDAY.'</td>
                            <td style="font-family:arial; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="left">Rs '.$noOfdays.'/day</td>
                             <td style="font-family:arial; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="left">Rs '.$totalAmount.'/day</td>
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

          return array('message'=>'Order is '.$status.' successfully','orders'=>$orders,'lenderedProducts'=>$lenderedProducts);
        }

      

    }

    public function registerNewUser($userD)
    {
      $insertInfo=[];
      $insertInfo['name']=$userD['name'];
      $insertInfo['email']=$userD['email'];
      $insertInfo['password']=md5($userD['password']);
      $userObj = new User();

      $userDetails =  $userObj->checkUserExists1($insertInfo['email']);
      /*if($userDetails&&$userDetails[0]['password']&&$userDetails[0]['password']!='')
      {
        $updateArray=[];
        $updateArray['password']=$password;
        $idUser =$userDetails[0]['id_user'];
        $res = $userObj->updateUserDetails($idUser,$updateArray);
        $userCartDetails=$userObj->getUserProducts($idUser);
        return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$idUser,'message'=>'User registered successfully.');  
      }*/
      if($userDetails&&count($userDetails)>0){
        return array('error'=>403,'message'=>'Email id is already registered.');
      }
      else
      {
        if($userDetails&&!$userDetails[0]['password']&&$userDetails[0]['password']!=NULL){
          $updateInfo =[];
          $updateInfo['password']=md5($userD['password']);
          $idUser =$userDetails[0]['id_user'];
          $res = $userObj->updateUserDetails($idUser,$updateInfo);
          if($res)
          {
            $userCartDetails=$userObj->getUserProducts($res);
            return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$idUser,'message'=>'User registered successfully.');

          }

        }
        $userDetails =  $userObj->checkUserExists1($insertInfo['email']);
        if($userDetails)
        {
          return array('error'=>403,'message'=>'Email id is already registered.');
        }
        $res=$userObj->setUser($insertInfo);
        if($res)
        {
          $userCartDetails=$userObj->getUserProducts($res);
          return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$res,'message'=>'User registered successfully.Activation link has been sent to your email.');

        }
      }

    }

    public function loginAsUser($email,$password)
    {
      $userObj = new User();
      $utilitObj = new Utility();
      $userDetails =  $userObj->checkUserExists1($email);
      if($userDetails)
      {
        if($userDetails[0]['password']!='')
        {
          if(md5($password)==$userDetails[0]['password'])
          {
            $updateArray=[];
            $csrf_token = $utilitObj->generateRandomString(40);
            $updateArray['csrf_token']=$csrf_token;

            $idUser =$userDetails[0]['id_user'];

            $res = $userObj->updateUserDetails($idUser,$updateArray);

            $userCartDetails=$userObj->getUserProducts($userDetails[0]['id_user']);
            $notifications = $userObj->getNotifications($idUser);

            return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$userDetails[0]['id_user'],'name'=>$userDetails[0]['name'],'email'=>$userDetails[0]['email'],'pic'=>$userDetails[0]['pic'],'csrf_token'=>$csrf_token,'message'=>'Successfully logged into the application.','notifications'=>$notifications);  
 
          }
          else
          {
            return array('error'=>403,'message'=>'Email id or password is invalid.');
 
          }
        }
        else
        {
         return array('error'=>403,'message'=>'Email id is not registered manually.');
        }
      }
      else
      {
        return array('error'=>403,'message'=>'Email id or password is invalid.');
      }
    }

    public function getProductDetail($id_product){
      $productObj = new Product();
      $res= $productObj->getProductDetail($id_product);
      if($res){
        return array('error'=>200,'res'=>$res);

      }
    }


    public function addBulkProductToCart($id_user,$products){
      $productObj = new Product();
      if($products&&count($products)>0){
        foreach ($products as $key => $value) {
            $insertInfo=array('user_id_user'=>$id_user,'product_id_product'=>$value['id_product']);
            $checkProructAddedtocart = $productObj->checkProductAddedtocart($value['id_product'],$id_user);
            if($checkProructAddedtocart){
              //return array('error'=>true,'message'=>'Product already added to cart.');
            }else{

              $addtoCartRes = $productObj->addProductToCart($insertInfo);
            }
        }
      }
      $userObj = new User();
      $userCartDetails=$userObj->getUserProducts($id_user);
      return array('error'=>200,'user_cart_details'=>$userCartDetails,'message'=>'Products added to cart successfully.');

    }


    public function addSubScriber($email){
        $productObj = new Product();
        $array =array('email'=>$email);
        if($email!=''){
              $addtoCartRes = $productObj->addSubScriber($array);
              if($addtoCartRes){
                return array('error'=>200,'message'=>'Subscribed successfully.');
              }
        }else{
          return array('error'=>403,'message'=>'Subscription failed.');
        }

    }
}
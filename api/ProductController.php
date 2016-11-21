<?php

/**
 * Class with all the methods required for Exam Controller
 * @author Chiranjeevi
 * @copyright 2016
 */

class ProductController  
{
    public function __construct() {
    }
    public function __destruct() {
    }

    public function getCategories()
    {
      $productObj = new Product();
      $categories = $productObj->getCategories();
      return array('categories'=>$categories,'error'=>false);  
   
    }

    public function login($email,$idGoogle,$name,$csrf_token,$imgUrl)
    {
      $userObj = new User();
      $userDetails =  $userObj->checkUserExists($idGoogle,$email);
      if($userDetails)
      {
        $updateArray=[];
        $updateArray['csrf_token']=$csrf_token;
        $idUser =$userDetails[0]['id_user'];
        $res = $userObj->updateUserDetails($idUser,$updateArray);
        $userCartDetails=$userObj->getUserProducts($idUser);
        $userDetails = $userObj->getUser($idUser);
        return array('user_cart_details'=>$userCartDetails,'id_user'=>$idUser,'user_detail'=>$userDetails[0]);  
      }
      else
      {
        $userInfo=array('name'=>$name,'email'=>$email,'google_id_user'=>$idGoogle,'csrf_token'=>$csrf_token,'img_url'=>$imgUrl);
        $res=$userObj->setUser($userInfo);
        if($res)
        {
          $userCartDetails=$userObj->getUserProducts($res);
          $userDetails = $userObj->getUser($res);
          return array('user_cart_details'=>$userCartDetails,'id_user'=>$res,'user_detail'=>$userDetails[0]);

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
      $insertInfo=array('user_id_user'=>$id_user,'product_id_product'=>$productDetails['id_product']);
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
      $productObj = new Product();
      $userObj = new User();
      $deleteP = $productObj->deleteProductFromCart($idUser,$product['id_product']);
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
      $dueDate=date('Y-m-d', strtotime("+15 days"));
      $insertInfo=array();
      $insertInfo['user_id_user']=$idUser;
      $insertInfo['product_ids']=implode(',',$productIds);
      $insertInfo['created_at']=$date;
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
            $insertInfo1['oraganization_id_organization']=$organizationId;

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
        $updateArray['mobile']=$mobile;
        $res = $userObj->updateUserDetails($idUser,$updateArray);

        $userCartDetails=$userObj->getUserProducts($idUser);
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

    public function setTransactionStatus($id_user,$id_transaction,$status)
    {

      $productObj = new Product();
      $userObj = new User();
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
      $orders =$userObj->getOrders($id_user);
      $lenderedProducts = $userObj->getYourLenderedProducts($id_user);
      return array('message'=>'Order is '.$status.' successfully','orders'=>$orders,'lenderedProducts'=>$lenderedProducts);
      

    }

    public function registerNewUser($userD)
    {
      $insertInfo=[];
      $insertInfo['name']=$userD['name'];
      $insertInfo['email']=$userD['email'];
      $insertInfo['password']=md5($userD['password']);
      $userObj = new User();

      $userDetails =  $userObj->checkUserExists1($insertInfo['email']);
      if($userDetails&&$userDetails[0]['password']&&$userDetails[0]['password']!='')
      {
        $updateArray=[];
        $updateArray['password']=$password;
        $idUser =$userDetails[0]['id_user'];
        $res = $userObj->updateUserDetails($idUser,$updateArray);
        $userCartDetails=$userObj->getUserProducts($idUser);
        return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$idUser,'message'=>'User registered successfully.');  
      }
      else
      {
        if($userDetails&&!$userDetails[0]['password']&&$userDetails[0]['password']==NULL){
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
          return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$res,'message'=>'User registered successfully.');

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
            return array('error'=>200,'user_cart_details'=>$userCartDetails,'id_user'=>$userDetails[0]['id_user'],'name'=>$userDetails[0]['name'],'email'=>$userDetails[0]['email'],'pic'=>$userDetails[0]['pic'],'csrf_token'=>$csrf_token,'message'=>'Successfully logged into the application.');  
 
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
}
<?php
	require_once("../mainConfig.php");
	require_once("Rest.inc.php");
    require_once("AdminController.php");
    require_once("ProductController.php");

    class Api extends Rest {
	   
		public $data = "";
		
		public function __construct(){
			parent::__construct();				// Init parent contructor
		}
		
		/*
		 * Public method for access api.
		 * This method dynmically call the method based on the query string
		 *
		 */
		public function processApi(){
        $func = trim(str_replace("/","",$_REQUEST['rquest']));
			if((int)method_exists($this,$func) > 0)
                        {

                                /*if($func!='checkToken'&&$func!='login')
                                {
                                    $this->checkToken();
                                }*/
				            $this->$func();
                        }
			else
                            $this->response('',404);				// If the method not exist with in this class, response would be "Page not found".
		}
		

		

        /*********Books Api Code Starts Here ************/

        public function mainSend()
        {
            if($this->get_request_method() != "GET"){
                        $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $categories = $productControllerObj->mainSend();
            $this->response($this->json($categories),200);   
            
        }

        public function getCategories()
        {
            if($this->get_request_method() != "GET"){
                        $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $categories = $productControllerObj->getCategories();
            if($categories)
            {
               $this->response($this->json($categories),200);   
            }
            else
            {
                $error = array("message" => "No categories");
                $this->response($this->json($error), 403);
            }
        }

           /* 
         *  login API
         *  Login must be POST method
         */
        
        private function login(){
                    if($this->get_request_method() != "POST"){
                            $this->response('',405);
                    }
                   
                    $productControllerObj=new ProductController();
                    $login = $productControllerObj->login($this->_request['email'],$this->_request['id_google'],$this->_request['name'],$this->_request['csrf-token'],$this->_request['img_url']);
                    if(!$login)
                    {
                    $error = array("message" => "Unauthorized access");
                    $this->response($this->json($error), 401);
                    } 
                    else
                    {
                        $this->response($this->json($login),200);   
                    } 
        }

        public function getTrendingBooks()
        {
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $trendingBooks = $productControllerObj->getTrendingBooks();
            if(!$trendingBooks['error'])
            {
                $this->response($this->json($trendingBooks),200);    
            }
            else
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401); 
            }
       
        }

        public function getAllProducts()
        {

                    if($this->get_request_method() != "POST"){
                            $this->response('',405);
                    }
                    $productControllerObj=new ProductController();
                    $products = $productControllerObj->getAllProducts($this->_request['startIndex'],$this->_request['limitIndex'],$this->_request['searchString'],$this->_request['categories'],$this->_request['id_user']);
                    if(!$products)
                    {
                    $error = array("message" => "Unauthorized access");
                    $this->response($this->json($error), 401);
                    } 
                    else
                    {
                        $this->response($this->json($products),200);   
                    } 
        
        }

        public function addProductToCart()
        {
            $accessToken = $this->getHeader('Csrf-Token');
             $accessToken1 = $this->getHeader('csrf-token');
            if(!$accessToken&&!$accessToken1)            {
                $error = array("message" => "Please login to add product to cart");
                $this->response($this->json($error), 401);
            }
            else
            {

                $productControllerObj = new ProductController();
                $productDetails = $productControllerObj->addProductToCart($this->_request['id_user'],$this->_request['product']);

                if($productDetails['error']==false)
                {
                   $error = array("message" => "Product added to cart successfully.");
                    $this->response($this->json($error), 200); 
                }
                else
                {
                   $error = array("message" =>  $productDetails['message']);
                    $this->response($this->json($error), 403); 
 
                }
            }
        }

        public function addBulkProductToCart(){
            $accessToken = $this->getHeader('Csrf-Token');
             $accessToken1 = $this->getHeader('csrf-token');
            if(!$accessToken&&!$accessToken1)            {
                $error = array("message" => "Please login to add product to cart");
                $this->response($this->json($error), 401);
            }
            else
            {

                $productControllerObj = new ProductController();
                $productDetails = $productControllerObj->addBulkProductToCart($this->_request['id_user'],$this->_request['product']);

                if($productDetails['error']==200)
                {
                    $this->response($this->json($productDetails), 200); 
                }
                else
                {
                   $error = array("message" =>  $productDetails['message']);
                    $this->response($this->json($error), 403); 
 
                }
            }
        }

        public function getUserProducts()
        {

            if($this->get_request_method() != "GET"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Csrf-Token');
             $accessToken1 = $this->getHeader('csrf-token');
            if(!$accessToken&&!$accessToken1)
            {
                $error = array("message" => "Please login to add product to cart");
                $this->response($this->json($error), 401);
            }
            else
            {
                $productControllerObj = new ProductController();
                $cart_details = $productControllerObj->getUserProducts($this->_request['id_user']);
                
                    $this->response($this->json($cart_details), 200);
 
            }

        }
        public function deleteProductFromCart()
        {
             if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Csrf-Token');
             $accessToken1 = $this->getHeader('csrf-token');
            if(!$accessToken&&!$accessToken1)            {
                $error = array("message" => "Please login to add product to cart");
                $this->response($this->json($error), 401);
            }
            else
            {
                $productControllerObj = new ProductController();
                $delete = $productControllerObj->deleteProductFromCart($this->_request['id_user'],$this->_request['product']);
                $this->response($this->json($delete), 200);
 
            }
        }

        public function getOrganizations()
        {
            if($this->get_request_method() != "GET"){
                            $this->response('',405);
            }
            $productControllerObj = new ProductController();
            $oraganizations =$productControllerObj->getOrganizations();
            $this->response($this->json($oraganizations), 200);

        }

        public function buyProducts()
        {
           if($this->get_request_method() != "POST"){
                            $this->response('',405);
            } 
            $productControllerObj = new ProductController();
            $buyProducts =$productControllerObj->buyProducts($this->_request['products'],$this->_request['id_user'],$this->_request['id_organization'],$this->_request['mobile']);
            if(!$buyProducts['error'])
            $this->response($this->json($buyProducts), 200);
            else
            {
              $this->response($this->json($buyProducts), 403);

            }

        }
         public function addOrganization()
        {
           if($this->get_request_method() != "POST"){
                            $this->response('',405);
            } 
            $productControllerObj = new ProductController();
            $addP =$productControllerObj->addOrganization($this->_request['id_user'],$this->_request['techpark'],$this->_request['techparkaddress']);
           
            $this->response($this->json($addP), 200);

        }


        public function getOrders()
        {
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj = new ProductController();
            $orders = $productControllerObj->getOrders($this->_request['id_user']);
            $this->response($this->json($orders), 200);
  
        }

        public function setTransactionStatus()
        {
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj = new ProductController();
            $status = $productControllerObj->setTransactionStatus($this->_request['id_user'],$this->_request['id_subtransaction'],$this->_request['status'],$this->_request['rating'],$this->_request['description'],$this->_request['id_product']);
            $this->response($this->json($status), 200);

 
        }

        public function registerNewUser()
        {
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj = new ProductController();
            $res = $productControllerObj->registerNewUser($this->_request['user']);
            if($res['error']==200)
            $this->response($this->json($res), 200);
            else
            {
              $this->response($this->json($res), 403);

            }
  
        }

        public function loginAsUser()
        {
           if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }

            $productControllerObj = new ProductController();

            $res = $productControllerObj->loginAsUser($this->_request['email'],$this->_request['password']);
            if($res['error']==200)
            $this->response($this->json($res), 200);
            else
            {
              $this->response($this->json($res), 403);

            }
        }
        private function checkToken(){  

            $accessToken = $this->getHeader('Csrf-Token');
            $accessToken1 = $this->getHeader('csrf-token');
            if(!$accessToken&&!$accessToken1)            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
                return $accessToken;
        }

        public function checkAdminLogin()
        {
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
                return $accessToken;
        }

        public function adminLogin(){

            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }

            $adminController = new AdminController();
            $login = $adminController->adminLogin($this->_request['email'],$this->_request['password']);
            if($login['error']==200)
            $this->response($this->json($login), 200);
            else
            $this->response($this->json($login), 403);
    
 
        }

        public function getAdminLenderbooks(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();
                $lenderBooks =$adminController->getAdminLenderbooks($this->_request['startIndex'],$this->_request['limitIndex']);
                $this->response($this->json($lenderBooks), 200);
    
            }
        }

        public function getTransactions(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();
                $transactions = $adminController->getTransactions($this->_request['startIndex'],$this->_request['limitIndex']);
                $this->response($this->json($transactions), 200);
            }
        }

        public function changeTransactionStatus(){
            if($this->get_request_method() != "PUT"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                
                $adminController = new AdminController();
                $transactions = $adminController->changeTransactionStatus($this->_request['status'],$this->_request['date'],$this->_request['transactionsIds'],$this->_request['due_days']);
                $this->response($this->json($transactions), 200);

            }

        }

        public function addProduct(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $file = $_FILES;
                $adminController = new AdminController();
                $addP = $adminController->addProduct($this->_request['product'],$file,$this->_request['id_admin']);
               
                $this->response($this->json($addP), 200);
 
            }
        }

        public function getAdminProducts(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
               $adminController = new AdminController();
               $res = $adminController->getAdminProducts($this->_request['startIndex'],$this->_request['limitIndex']);
               $this->response($this->json($res), 200);

            } 
        }

        public function getAllOrganization(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();
                $res = $adminController->getAllOrganization($this->_request['startIndex'],$this->_request['limitIndex']);
                $this->response($this->json($res), 200);

            }
        }

        public function updateOrganizationDetail(){
            if($this->get_request_method() != "PUT"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();

                $res = $adminController->updateOrganizationDetail($this->_request['id_organization'],$this->_request['status']);

                $this->response($this->json($res), 200);
  
            }
        }



        public function addAdminOrganization(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();
                $res = $adminController->addAdminOrganization($this->_request['id_admin'],$this->_request['oraganization']);
                 $this->response($this->json($res), 200);

            }    
        }

        public function deleteOrganization(){
             if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);

            }
            else
            {
                $adminController = new AdminController();
                $res = $adminController->deleteOrganization($this->_request['id_organization']);
                $this->response($this->json($res), 200);

            }
        }

        public function addNewAdmin(){
             if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $accessToken = $this->getHeader('Admin-Csrf-Token');
            if(!$accessToken)
            {
                $error = array("message" => "Unauthorized access");
                $this->response($this->json($error), 401);
            }
            else
            {
                $adminController = new AdminController();
                $res = $adminController->addNewAdmin($this->_request['id_admin'],$this->_request['user']);
                $this->response($this->json($res), 200);


            }
        }

        public function uploadLenderBook(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $adminController = new AdminController();
            $res = $adminController->uploadLenderBook($this->_request['books'],$this->_request['id_user']);
            $this->response($this->json($res), 200);
  
        }

        public function getProductDetail(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $results = $productControllerObj->getProductDetail($this->_request['id_product']);
            $this->response($this->json($results), 200);
        }


        public function addSubScriber(){
            if($this->get_request_method() != "POST"){
                            $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $results = $productControllerObj->addSubScriber($this->_request['user']);
            $this->response($this->json($results), 200);
        }

        public function getNotifications(){
            if($this->get_request_method() != "GET"){
                            $this->response('',405);
            }
            $productControllerObj=new ProductController();
            $results =array();
            if(isset($this->_request['id_user'])){
                $results = $productControllerObj->getNotifications($this->_request['id_user']);
                $this->response($this->json($results), 200);
            }
            else{
                $this->response($this->json($results), 200);
            }
        }

        
        /************ END *****************/

        
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
                        return $data;
		}
	}
	
	// Initiiate Library
	
	$api = new Api;
	$api->processApi();
?>
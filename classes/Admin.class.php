<?php


class Admin{

   
    
    public function __construct() {
        
    }
    public function __destruct() {
    }

    public function adminLogin($email,$password)
    {
      global $db;
      $q_login="SELECT id_admin,username FROM admin WHERE username='$email' AND password='$password'";

      $login = $db->select($q_login);

      return $login;

    }

    public function updateAdmin($update,$updateCondition){
      
      global $db;
      $q_usr = $db->update('admin',$update,$updateCondition);
      return $q_usr;

    }

    public function getAdminLenderbooks($startIndex=0,$limitIndex=10){
      global $db;
      $q_products= "SELECT u.id_user,u.name as user_name,u.email as user_email,lpn.name as lender_product_name,lpn.id_lender_product_notification,lpn.updated_at,lpn.status FROM lender_product_notification as lpn left Join user as u ON lpn.user_id_user=u.id_user  Order By lpn.updated_at DESC";
      $products = $db->select($q_products);

      $q_products1= "SELECT u.id_user,u.name as user_name,u.email as user_email,lpn.name as lender_product_name,lpn.id_lender_product_notification,lpn.updated_at,lpn.status FROM lender_product_notification as lpn left Join user as u ON lpn.user_id_user=u.id_user  Order By lpn.updated_at DESC LIMIT $limitIndex OFFSET $startIndex";
      $products1 = $db->select($q_products1);

      $finalArray=[];
      $finalArray['products'] = $products1;
      $finalArray['total_count'] = count($products); 
      return $finalArray;
    }

    public function getTransactions($startIndex=0,$limitIndex=10){
      global $db;
      $where='1';
      $q_transaction="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.name as product_name,p.id_product as id_product,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN lender_product_notification as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where Order By st.ordered_date  LIMIT $limitIndex OFFSET $startIndex ";
      $where1='1';
      $q_transaction1="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.name as product_name,p.id_product as id_product,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN lender_product_notification as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where1  Order By st.ordered_date";
    
    $transactions = $db->select($q_transaction);

    $transactions1 = $db->select($q_transaction1);

    $finalArray=[];
    $finalArray['transactions'] = $transactions;
    $finalArray['total_count'] = count($transactions1);
     return $finalArray;

    }

    public function updateTransaction($updateInfo,$updateCondition){
      global $db;
      $res=$db->update('sub_transaction',$updateInfo, $updateCondition);
      return $res;  
    }

    public function updateProduct($updateInfo,$updateCondition)
    {
      global $db;
      $res=$db->update('product',$updateInfo, $updateCondition);
      return $res; 
    }

    public function updateLenderStatus($updateInfo,$updateCondition){
      global $db;
      $res=$db->update('lender_product_notification',$updateInfo, $updateCondition);
      return $res;  
    }
    public function setProduct($insetInfi)
    {
      global $db;
      $res=$db->insert('product',$insetInfi);
      return $res;

    }


    public function getAdminProducts($startIndex,$limitIndex){
      global $db;
      $q_products= "SELECT p.*,a.username as admin_name,u.name as username FROM product as p LEFT JOIN user as u ON p.user_id_user=u.id_user LEFT JOIN admin as a ON a.id_admin=p.admin_id_admin Order BY id_product DESC LIMIT $limitIndex OFFSET $startIndex";

      $products = $db->select($q_products);

      $q_products1= $db->getCount('product');

      $finalArray=[];

      $finalArray['products'] = $products;

      $finalArray['total_count'] = $q_products1;

      return $finalArray;

    }


    public function getAllOrganization($startIndex,$limitIndex){
      global $db;
       $q_products= "SELECT a.username as admin_name,o.*,u.name as requested_username FROM organization as o LEFT JOIN user as u ON o.user_id_user=u.id_user LEFT JOIN admin as a ON a.id_admin=o.admin_id_admin Order BY o.id_organization DESC LIMIT $limitIndex OFFSET $startIndex";
      $organizations = $db->select($q_products);
      $q_products1= $db->getCount('organization');
  
      $finalArray=[];

      $finalArray['organizations'] = $organizations;

      $finalArray['total_count'] = $q_products1;

      return $finalArray;

 
    }

    public function updateOrganizationDetail($updateArry,$updateCondition){
     global $db;
      $q_usr = $db->update('organization',$updateArry,$updateCondition);
      return $q_usr; 
    }

    public function addAdminOrganization($insert)
    {
       global $db;
      $res=$db->insert('organization',$insert);
      return $res;
    }

    public function deleteOrganization($id_organization)
    {
      global $db;

      $where ="id_organization='$id_organization'";

      $deleted=$db->delete('organization',$where);

      return $deleted;

    }

    public function addNewAdmin($insert){
       global $db;
      $res=$db->insert('admin',$insert);
      return $res;
    }

    public function uploadLenderBook($insert){
       global $db;
      $res=$db->insert('lender_product_notification',$insert);
      return $res;
    }

    public function getSubTrasactionDetails($id_sub_transaction){
      global $db;
      $where="st.id_sub_transaction = '$id_sub_transaction'";
     $q_transaction=  "SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,u.email as user_email,p.name as product_name,p.id_product as id_product,st.date_issued,st.due_date,u1.id_user as seler_id,u1.email as seller_email, u1.name as seller_name,st.status as transaction_status,u.mobile FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN lender_product_notification as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where";
     $transactions = $db->select($q_transaction); 
     return $transactions;
    }

}

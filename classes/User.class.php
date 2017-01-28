<?php


class User{

   
    
    public function __construct() {
        
    }
    public function __destruct() {
    }

    public function checkUserExists($googleUserId,$googleUserEmail)
    {
      global $db;
      $where=" google_id_user='$googleUserId' AND user.email='$googleUserEmail'";
      $userExists="SELECT * FROM user WHERE $where";
      $userInfo = $db->select($userExists);
      return $userInfo;
    }
    public function checkUserExists1($googleUserEmail)
    {
      global $db;
      $where=" user.email='$googleUserEmail'";
      $userExists="SELECT * FROM user WHERE $where";
      $userInfo = $db->select($userExists);
      return $userInfo;
    }

    public function getUserProducts($idUser)
    {
      global $db;
      $projects="SELECT * FROM cart LEFT JOIN product as p ON cart.product_id_product=p.id_product WHERE cart.user_id_user='$idUser'";
      $projectsD = $db->select($projects);
      return array_values($projectsD);
    }

    public function getAllUsers($idUser='')
    {
      $where='';
      if($idUser!='')
      {
        $where.="id_user='$idUser'";
      }
      else
      {
         $where.=' 1';

      }
       global $db;
       $q_usr="SELECT id_user,name,email FROM user WHERE $where";
       $users=$db->select($q_usr);
       return $users;

    }


    public function updateUserDetails($idUser,$updateArray)
    {
      $where='';
      $where.="id_user='$idUser'";
      global $db;
      $q_usr = $db->update('user',$updateArray,$where);
      return $q_usr;
    }

    public function setUser($userInfo)
    {
      global $db;
      $q_usr = $db->insert('user',$userInfo);
      return $q_usr;
    }


    public function getOrganizations($status=1,$idOrganization='')
    {
      global $db;
      $where='';

      if($idOrganization!='')
      {
        $where.=' id_organization='.$idOrganization;
      }
      if($where!='')
      {
        $where=" AND status='1'";
      }
      else
      {
        $where="status='1'";
      }
      $q_comps = "SELECT * FROM organization WHERE $where";
      $compns =$db->select($q_comps);
      return $compns;
    }


    public function addOrganization($insertinf)
    {
      global $db;
      $q_s = $db->insert('organization',$insertinf);
      return $q_s;
    }

    public function getOrders($id_user='')
    {
      global $db;
      $where='';
      if($id_user!='')
      {
        $where="st.user_id_user='$id_user'";
      
     
       $q_orders="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.*,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN product_label as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where Order By st.ordered_date DESC";
       $orders = $db->select($q_orders);
       return $orders;
      }
    }

    public function getYourLenderedProducts($id_user)
    {
      global $db;
      $q_select="SELECT p.user_id_user as lendered_user_id,p.name,p.pic,st.* FROM sub_transaction as st left join product as p ON p.id_product=st.product_id_product WHERE p.user_id_user='$id_user' GROUP BY st.product_id_product";
      /*echo $q_select="SELECT pl.user_id_user as lendered_user_id,p.name,p.pic,st.* FROM sub_transaction as st JOIN product_label as pl ON pl.user_id_user=st.user_id_user AND pl.product_id_product=st.product_id_product LEFT JOIN product as p ON pl.product_id_product=p.id_product  WHERE p.user_id_user='$id_user' GROUP BY st.product_id_product";
      die;*/
      $res = $db->select($q_select);
      return $res;
    }

    public function getUser($idUser){
      global $db;
      $q_select ="SELECT * FROM user where id_user='$idUser'";
      $res = $db->select($q_select);
      return $res;
    }

    public function setProductReview($inserInf){
       global $db;
      $q_usr = $db->insert('product_has_user_review',$inserInf);
      return $q_usr;
    }

    public function getNotifications($idUser){
      global $db;
      $where='';
      if($idUser!='')
      {
        $where="st.user_id_user='$idUser' and st.status='delivered'";
      }
    $q_select ="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.*,p.name as productname,p.id_product as prod_id,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status,CONCAT('') as message FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN product_label as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where Order By st.ordered_date DESC";
      $res = $db->select($q_select);
      $finalArray=array();
      if($res&&count($res)>0){
        foreach ($res as $key => $value) {
          $message= "";
          $curdate = date('Y-m-d H:i:s');
          if($value['due_date']!=''){
            if($curdate===$value['due_date'])
            {
              $value['message']= "Due date is going to exceed.You will be charged additionally after that.";
            }else{
              $time1 = strtotime($curdate);
              $time2 = strtotime($value['due_date']);
              $days =floor( ($time2-$time1) /(60*60*24));
              if($days<=5&&$days>0){
                $value['message']=$days."days remaining for subscribed book";

              }else{
                if($days<0)
                $value['message']="Due date is exceeded.You will be charged additionally.";
              }
            } 
          }else{
          }
          array_push($finalArray, $value);
        }
      }
      return $finalArray;
    }

}
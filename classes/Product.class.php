<?php


class Product{

   
    
    public function __construct() {
    }
    public function __destruct() {
    }

    /** To get all the products **/
    public function getProducts($idProduct='',$qty=FALSE,$limit=5,$condition='',$categories=array(),$searchString='',$orderBy='')
    {
      global $db;
      $where='';
      if($idProduct!='')
      {
        $where.="id_product='$idProduct'";
      }
      if($qty&&$idProduct!='')
      {
        $where.="AND copies>0";
      }
      else
      {
        if($qty)
        {
          $where.=" copies>0";
        }
        else
        {
          if($idProduct=='')
          $where.=' 1';
        }
      }
      if($condition!='')
      {
        if($where!='')
        $where.=" AND $condition";
        else
          $where.=" $condition";
      }
      if($searchString!='')
      {
        if($where!='')
        {
          $where.="  AND name LIKE '%$searchString%'";
        }
        else
          $where.=" name LIKE '%$searchString%'";

      }
      if($categories&&count($categories)>0)
      {
       $categories=implode(',', $categories); 
        if($where!='')
        $where.=" AND category_id_category IN($categories)";
      }
      $q_products= "SELECT * FROM product where $where Order BY id_product DESC LIMIT $limit";
      $products = $db->select($q_products);
      return $products;
   
    }

    public function getLenderProducts()
    {
      global $db;
      $where="1";
      $q_products= "SELECT u.id_user,u.name as user_name,u.email as user_email,lpn.name as lender_product_name,lpn.id_lender_product_notification,lpn.updated_at,CONCAT('<a href=\"add_product.php?product_name=',lpn.name,'&id_user=',u.id_user,'\">','Add to product','</a>') as add_to_product FROM lender_product_notification as lpn left Join user as u ON lpn.user_id_user=u.id_user where $where Order By lpn.updated_at DESC";
      $products = $db->select($q_products);
      return $products;
    }

    public function getAllTransaction($idTransaction='')
    {
      global $db;
      $where='';
      if($idTransaction!='')
      {
        $where="st.transaction_id_transaction='$idTransaction'";
      }
      else
      {
        $where='1';
      }
     $q_transaction="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.name as product_name,p.id_product as id_product,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN lender_product_notification as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where Order By st.ordered_date";
     $transactions = $db->select($q_transaction);
     return $transactions;

    }

    public function getUserProject($userId)
    {
      
    }

public function getOrders($id_user='')
    {
      global $db;
      $where='';
      if($id_user!='')
      {
        $where="st.user_id_user='$id_user'";
      
     
       $q_orders="SELECT st.id_sub_transaction,st.transaction_id_transaction,st.ordered_date,u.name as buyer_name,p.*,st.date_issued,st.due_date,u1.name as seller_name,st.status as transaction_status FROM sub_transaction as st LEFT JOIN product as p ON st.product_id_product=p.id_product LEFT JOIN user as u ON st.user_id_user=u.id_user LEFT JOIN lender_product_notification as pl ON p.id_product=pl.product_id_product LEFT JOIN user as u1 ON pl.user_id_user=u1.id_user where $where Order By st.ordered_date";
       $orders = $db->select($q_orders);
       return $orders;
      }
    }

  public function getCategories($id_category='')  
  {
    global $db;
    $where='';
    if($id_category!='')
    {
      $where.=" id_category='$id_category'";
    }
    else
    {
      $where.=' 1';
    }
    $q_category="SELECT * FROM category WHERE $where";
    $categorys=$db->select($q_category);
    return $categorys;
  }

  public function getTrendingBooks($limit=8)
  {
    global $db;
    $q_t_items= "SELECT p.id_product,p.author,p.name,p.pic,p.pic_name,COUNT(t.product_id_product) as product_count FROM product as p LEFT JOIN sub_transaction as t ON t.product_id_product=p.id_product GROUP BY p.id_product ORDER BY product_count DESC LIMIT $limit";
    $treding_pr=$db->select($q_t_items);
    return $treding_pr;

  }

  public function searchString($searchTeam='')
  {
    global $db;
    if($searchTeam!='')
    {
      $q_select="SELECT * FROM product as p WHERE p.name LIKE '%$searchTeam%'ORDER BY p.name ASC";
      $select =$db->select($q_select);
      return $select;
    }
  }

  public function getYourLenderedProducts($id_user)
  {
    global $db;
    $q_select="SELECT pl.user_id_user as lendered_user_id,p.name,p.pic,st.* FROM sub_transaction as st JOIN lender_product_notification as pl ON pl.user_id_user=st.user_id_user AND pl.product_id_product=st.product_id_product LEFT JOIN product as p ON pl.product_id_product=p.id_product  WHERE p.user_id_user='$id_user' GROUP BY st.product_id_product";
    $res = $db->select($q_select);
    return $res;
  }


  /** To get all the products **/
    public function getAllProducts($startIndex=0,$limitIndex=10,$searchString='',$categories=array())
    {
      global $db;
      $where='1';
      
      if($searchString!='')
      {
        if($where!='')
        {
          $where.=" AND (product.name LIKE '%$searchString%' OR product.isbn LIKE '%$searchString%' OR product.author LIKE '%$searchString%')";
        }

      }
      if($categories&&count($categories)>0)
      {
        
       $categories=implode(',', $categories); 
        if($where!='')
        $where.=" AND product.category_id_category IN($categories)";
      }
      if($categories&&count($categories)>0) 
      {
        $orderByQ = "ORDER BY FIELD(product.category_id_category ,$categories),product.updated_at DESC";
      }
      else{
        $orderByQ ="Order BY product.updated_at DESC";
      }
       $q_products= "SELECT product.*,avg(phur.rating) as rating FROM product left join product_has_user_review as phur ON phur.product_id_product=product.id_product where $where group by product.id_product $orderByQ LIMIT $limitIndex OFFSET $startIndex";
      $products = $db->select($q_products);

      $q_total_count =$db->getCount('product',$where);
      $finalArray=[];
      $finalArray['products'] = $products;
      $finalArray['total_count'] = $q_total_count; 
      return $finalArray;
   
    }

    public function addProductToCart($insertImfo)
    {
      global $db;
      $res=$db->insert('cart',$insertImfo);
      return $res;
    }

    public function deleteProductFromCart($id_user,$id_product)
    {
      global $db;
      $where ="product_id_product='$id_product' AND user_id_user='$id_user'";
      //$deleteQ="DELETE FROM cart WHERE ";
      $deleted=$db->delete('cart',$where);
      return $deleted;
    }

    public function updateProductDetail($updateInfo,$condition)
    {
      global $db;
      $updateInfor= $db->update('product', $updateInfo, $condition);
      return $updateInfor;
    }

    public function setSubTransaction($insertInf)
    {
      global $db;
      $res=$db->insert('sub_transaction',$insertInf);
      return $res;
    }
    public function setTransaction($insertInf)
    {
      global $db;
      $res=$db->insert('transaction',$insertInf);
      return $res;
    }

    public function setTransactionStatus($updateInfo,$updateCodition)
    {
      global $db;
      $res=$db->update('sub_transaction',$updateInfo,$updateCodition);
      return $res;
    }

    public function storeSearchedFields($insertInfo){
      global $db;
      $res = $db->insert('search_history',$insertInfo);
      return $res;
    }

    public function getProductDetail($idProduct){
      global $db;
      $where="id_product='$idProduct'";
      $q_products= "SELECT product.*,avg(phur.rating) as rating FROM product left join product_has_user_review as phur ON phur.product_id_product=product.id_product  where $where Order BY product.id_product";
      $products = $db->select($q_products);
      $where1="product_id_product='$idProduct'";
      $qreviews = "SELECT product_has_user_review.*,u.name FROM product_has_user_review left join user as u ON u.id_user=product_has_user_review.user_id_user where $where1 Order BY product_id_product DESC LIMIT 10";
      $reviews = $db->select($qreviews);

      $qtotalratings = "SELECT count(*) as count FROM product_has_user_review where $where1 AND rating>0 Order BY product_id_product ";
            $qtotalratings = $db->select($qtotalratings);

      $qtotalrev = "SELECT count(*)  as count FROM product_has_user_review where $where1 AND description!='' Order BY product_id_product ";
      $qtotalrev = $db->select($qtotalrev);
      $finalArray=array('product'=>$products[0],'reviews'=>$reviews,'total_ratings'=>$qtotalratings[0]['count'],'total_reviews'=>$qtotalrev[0]['count']);
      return $finalArray;
    }

    public function getTrasctionObject($idTransaction){
      global $db;
      $q_select="SELECT sub_transaction.*,product.name,product.copies,product.id_product FROM sub_transaction LEFT JOIN product ON product.id_product=sub_transaction.product_id_product WHERE id_sub_transaction='$idTransaction' LIMIT 1";
      $select =$db->select($q_select);
      return $select;
    }

    public function checkProductAddedtocart($product,$id_user){
      global $db;
      $q_select="SELECT cart.* FROM cart LEFT JOIN product ON product.id_product=cart.product_id_product WHERE product.id_product='$product' AND cart.user_id_user='$id_user'";
      $select =$db->select($q_select);
      return $select;
    }

    public function addBulkProductToCart($id_user,$products){
      
    }


    public function addSubScriber($insert){
      global $db;
      $res=$db->insert('subscribers',$insert);
      return $res;
    }
    
}

?>    
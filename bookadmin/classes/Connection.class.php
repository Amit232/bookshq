<?php

/**
 * Class with all the methods required for database operation
 */
class Connection{
    
    /**
     * Database connection object
     * @var $dbConn Connection  
     */
	private $dbConn;
	
	public function __construct($host,$username,$password,$database,$port=''){
        if($port!='')
            $this->dbConn=@mysqli_connect($host,$username,$password,$database,(int)$port);
        else
            $this->dbConn=@mysqli_connect($host,$username,$password,$database);
        // Check connection
        if (mysqli_connect_errno($this->dbConn))
        {
            $this->dbConn=false;
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
			exit;
        }
        else
            mysqli_set_charset($this->dbConn,'utf8');
	}
	
	function select($sql,$is_unique=false,$return_type=""){
		$retResult	=	array();
		//print $sql;
                if($is_unique)
                {
                    $sql.=' LIMIT 1';
                }
		$rs	=	mysqli_query($this->dbConn,$sql);
		
		if($return_type == "")
		{
            if($rs)
            {
                while( ($row	=	mysqli_fetch_assoc($rs))){
                    $retResult[]	=	$row;
                }
            }
            if($rs&&!is_bool($rs))
                mysqli_free_result($rs);
			return $retResult;
		}
		elseif($return_type == 'resource')
			return $rs;
			
	}
	function num_rows($sql){
		$rs	=	mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_num_rows($rs);
	}
	function insert($table, $arFieldsValues,$trim=true){
		$fields	=	array_keys($arFieldsValues);
		$values	=	array_values($arFieldsValues);
		
		$formatedValues	=	array();
		foreach($values as $val){
			//if(!is_numeric($val) && $val !='now()'){
            if($trim)
				$val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
            else
                $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
			//}
			$formatedValues[]	=	$val;
		}
		
		$sql	=	"INSERT INTO ".$table." (";
		$sql	.=	join(", ",$fields).") ";
		$sql	.=	"VALUES( ";
		$sql	.=	join(", ",$formatedValues);
		$sql	.=	")";
       //	print $sql;
		//exit;
		mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_insert_id($this->dbConn); //If the table contains autoincrement field
	}
	function insertIgnore($table, $arFieldsValues,$trim=true){
		$fields	=	array_keys($arFieldsValues);
		$values	=	array_values($arFieldsValues);
		
		$formatedValues	=	array();
		foreach($values as $val){
			//if(!is_numeric($val) && $val !='now()'){
            if($trim)
				$val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
            else
                $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
			//}
			$formatedValues[]	=	$val;
		}
		
		$sql	=	"INSERT IGNORE INTO ".$table." (";
		$sql	.=	join(", ",$fields).") ";
		$sql	.=	"VALUES( ";
		$sql	.=	join(", ",$formatedValues);
		$sql	.=	")";
       //	print $sql;
		//exit;
		mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_insert_id($this->dbConn); //If the table contains autoincrement field
	}
        function insertUpdate($table, $arFieldsValues,$arFieldsValues1,$trim=true){
		$fields	=	array_keys($arFieldsValues);
		$values	=	array_values($arFieldsValues);
		$formatedValues	=	array();
		foreach($values as $val){
			//if(!is_numeric($val) && $val !='now()'){
			if($trim)
				$val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
            else
                $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
			//}
			$formatedValues[]	=	$val;
		}
		
		$sql	=	"INSERT INTO ".$table." (";
		$sql	.=	join(", ",$fields).") ";
		$sql	.=	"VALUES( ";
		$sql	.=	join(", ",$formatedValues);
		$sql	.=	")";
                $sql	.=	" ON DUPLICATE KEY UPDATE ";
                $i=0;
                foreach($arFieldsValues1 as $key=>$value)
                {
                    if($trim)
                        $value=trim($value);
                    if($i!=0)
                        $sql.=",`$key`='".mysqli_real_escape_string($this->dbConn,$value)."'";
                    else
                        $sql.="`$key`='".mysqli_real_escape_string($this->dbConn,$value)."'";
                    $i++;
                }
       //	print $sql;
		//exit;
		mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_insert_id($this->dbConn); //If the table contains autoincrement field
	}


	function insertCheck($table, $arFieldsValues,$field1)
	{
		$values	=	array_values($arFieldsValues);
		foreach($values as $val)
			{
				$sql='INSERT INTO '.$table.' VALUES('.$field1.','.$val.')';
				//echo $sql;
				mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
			}
		return mysqli_insert_id($this->dbConn); //If the table contains autoincrement field
	}


	function update($table, $arFieldsValues, $strCondition='',$trim=true){
	
		$formatedValues	=	array();
		foreach($arFieldsValues as $key => $val){
			//if(!is_numeric($val)){
            if($val==NULL)
            {
                $formatedValues[]	=	"$key = NULL";
            }
            else
            {
			if($trim)
				$val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
            else
                $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
            $formatedValues[]	=	"$key = $val";
			//}
            }
			
		}
		
		$sql	=	"UPDATE ".$table." SET ";
		$sql	.=	join(", ",$formatedValues);
		if($strCondition != "") {
			$sql	.=	" WHERE ".$strCondition;
		}
		
		//print $sql; exit;
		$rs	=	mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_affected_rows($this->dbConn);
	}
	
	function updateCheck($table, $arFieldsValues,$field1)
	{
		$sql='DELETE FROM '.$table.' where package_id='.$field1;
		mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		
		$values	=	array_values($arFieldsValues);
		foreach($values as $val)
			{
				$sql='INSERT INTO '.$table.' VALUES('.$field1.','.$val.')';
				mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
			}
		return mysqli_insert_id($this->dbConn); //If the table contains autoincrement field*/
	}

	function delete($table, $strCondition=''){
	
		$sql	=	"DELETE FROM ".$table;
		if($strCondition != "") {
			$sql	.=	" WHERE ".$strCondition;
		}
		//print $sql; exit;
		$rs	=	mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_affected_rows($this->dbConn);
	}
	
	function deleteFieldValue($field,$table,$strCondition){
	
	    $sql	=	"UPDATE ".$table." SET ".$field." = '' WHERE ".$strCondition."";
		$rs	    =	mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_affected_rows($this->dbConn);
	}
	
	function executeQry($sql) 
	{
		$rs	=	mysqli_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
		return mysqli_affected_rows($this->dbConn);
	}
	public function getCount($tbl,$where='')
    {
        if($where)
        {
            $query = "SELECT COUNT(*) AS count FROM ".$tbl.' where '.$where;

        }
        else
              $query = "SELECT COUNT(*) AS count FROM ".$tbl.' '.$where;
        $result = $this->select($query);
        if($result)
            return $result[0]['count'];
        else
            return 0;
    }
    public function getConnectionObject()
    {
        return $this->dbConn;
    }
    public function createInsertStatement($table,$arFieldsValues,$trim=true)
    {
        $fields	=	array_keys($arFieldsValues);
		$values	=	array_values($arFieldsValues);
        $formatedValues	=	array();
		foreach($values as $val){
            if($val!='')
            {
                if($trim)
                    $val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
                else
                    $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
            }
            else
                $val="NULL";
			$formatedValues[]	=	$val;
		}
		$sql	=	"INSERT IGNORE INTO ".$table." (";
		$sql	.=	implode(", ",$fields).") ";
		$sql	.=	"VALUES( ";
		$sql	.=	implode(", ",$formatedValues);
		$sql	.=	");\n";	
        return $sql;
    }
    function createInsertUpdateStatement($table, $arFieldsValues,$arFieldsValues1,$trim=true){
		$fields	=	array_keys($arFieldsValues);
		$values	=	array_values($arFieldsValues);
		$formatedValues	=	array();
		foreach($values as $val){
            if($val!='')
            {
                if($trim)
                    $val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
                else
                    $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
            }
            else
                $val="NULL";
			$formatedValues[]	=	$val;
		}
		
		$sql	=	"INSERT INTO ".$table." (";
		$sql	.=	implode(", ",$fields).") ";
		$sql	.=	"VALUES( ";
		$sql	.=	implode(", ",$formatedValues);
		$sql	.=	")";
        $sql	.=	" ON DUPLICATE KEY UPDATE ";
        $i=0;
        foreach($arFieldsValues1 as $key=>$value)
        {
            if($value!='')
            {
                if($i!=0)
                    $sql.=",`$key`='".mysqli_real_escape_string($this->dbConn,$value)."'";
                else
                    $sql.="`$key`='".mysqli_real_escape_string($this->dbConn,$value)."'";
            }
            else
            {
                if($i!=0)
                    $sql.=",`$key`=NULL";
                else
                    $sql.="`$key`=NULL";
            }                
            $i++;
        }
        $sql.=	";\n";	
        return $sql;       
	}
    function createUpdateStatement($table, $arFieldsValues, $strCondition='',$trim=true){
	
		$formatedValues	=	array();
		foreach($arFieldsValues as $key => $val){
			//if(!is_numeric($val)){
            if($val==NULL)
            {
                $formatedValues[]	=	"$key = NULL";
            }
            else
            {
			if($trim)
				$val	=	"'".trim(mysqli_real_escape_string($this->dbConn,$val))."'";
            else
                $val	=	"'".mysqli_real_escape_string($this->dbConn,$val)."'";
            $formatedValues[]	=	"$key = $val";
			//}
            }
			
		}
		
		$sql	=	"UPDATE ".$table." SET ";
		$sql	.=	join(", ",$formatedValues);
		if($strCondition != "") {
			$sql	.=	" WHERE ".$strCondition;
		}
		
		//print $sql; exit;
		$sql.=	";\n";	
        return $sql;
	}
    function executeMultiQry($sql) 
	{
		//mysqli_multi_query($this->dbConn,$sql) or die(mysqli_error($this->dbConn));
        $ord = array ( );
        $inv = array ( );
        $err = array ( );
        $c = 1;
        $link=$this->dbConn;
        if ( mysqli_multi_query ( $link, $sql) ) {
            do {
                // fetch results
                if ( $result = mysqli_use_result ( $link ) )
                {
                    while ( $row = mysqli_fetch_array ( $result, MYSQLI_ASSOC ) ) {
                        if ( count ( $row ) > 17 )
                            $ord[] = $row;
                        elseif ( count ( $row ) == 6 )
                            $inv[] = $row;
                    }
                }
                $c++;
                if ( !mysqli_more_results ( $link ) )
                    break;
                if ( !mysqli_next_result ( $link ) || mysqli_errno ( $link ) ) {
                    // report error
                    $err[$c] = mysqli_error ( $link );
                    break;
                }
            } while ( true );
        }
        else
            $err[$c] = mysqli_error ( $link );
        if(count($err)>0)
            return $err;
        else return 'ok';
	}
    public function __destruct() {
        if($this->dbConn)
       mysqli_close($this->dbConn);
    }
	
}
<?php
	class Rest {
		
		public $_allow = array();
		public $_content_type = "application/json";
		public $_request = array();//Clean Request 
                public $_rawrequest = array();//Raw request
                public $_header = array();
		
		private $_method = "";		
		private $_code = 200;
		
		public function __construct(){
     
			$this->inputs();
		}
		
		public function get_referer(){
			return $_SERVER['HTTP_REFERER'];
		}
		
		public function response($data,$status){
			$this->_code = ($status)?$status:200;
			$this->set_headers();
			echo $data;
			exit;
		}
		
		private function get_status_message(){
			$status = array(
						100 => 'Continue',
                                                101 => 'Switching Protocols',
                                                102 => 'Processing',            // RFC2518
                                                200 => 'OK',
                                                201 => 'Created',
                                                202 => 'Accepted',
                                                203 => 'Non-Authoritative Information',
                                                204 => 'No Content',
                                                205 => 'Reset Content',
                                                206 => 'Partial Content',
                                                207 => 'Multi-Status',          // RFC4918
                                                208 => 'Already Reported',      // RFC5842
                                                226 => 'IM Used',               // RFC3229
                                                300 => 'Multiple Choices',
                                                301 => 'Moved Permanently',
                                                302 => 'Found',
                                                303 => 'See Other',
                                                304 => 'Not Modified',
                                                305 => 'Use Proxy',
                                                306 => 'Reserved',
                                                307 => 'Temporary Redirect',
                                                308 => 'Permanent Redirect',    // RFC7238
                                                400 => 'Bad Request',
                                                401 => 'Unauthorized',
                                                402 => 'Payment Required',
                                                403 => 'Forbidden',
                                                404 => 'Not Found',
                                                405 => 'Method Not Allowed',
                                                406 => 'Not Acceptable',
                                                407 => 'Proxy Authentication Required',
                                                408 => 'Request Timeout',
                                                409 => 'Conflict',
                                                410 => 'Gone',
                                                411 => 'Length Required',
                                                412 => 'Precondition Failed',
                                                413 => 'Request Entity Too Large',
                                                414 => 'Request-URI Too Long',
                                                415 => 'Unsupported Media Type',
                                                416 => 'Requested Range Not Satisfiable',
                                                417 => 'Expectation Failed',
                                                418 => 'I\'m a teapot',                                               // RFC2324
                                                422 => 'Unprocessable Entity',                                        // RFC4918
                                                423 => 'Locked',                                                      // RFC4918
                                                424 => 'Failed Dependency',                                           // RFC4918
                                                425 => 'Reserved for WebDAV advanced collections expired proposal',   // RFC2817
                                                426 => 'Upgrade Required',                                            // RFC2817
                                                428 => 'Precondition Required',                                       // RFC6585
                                                429 => 'Too Many Requests',                                           // RFC6585
                                                431 => 'Request Header Fields Too Large',                             // RFC6585
                                                500 => 'Internal Server Error',
                                                501 => 'Not Implemented',
                                                502 => 'Bad Gateway',
                                                503 => 'Service Unavailable',
                                                504 => 'Gateway Timeout',
                                                505 => 'HTTP Version Not Supported',
                                                506 => 'Variant Also Negotiates (Experimental)',                      // RFC2295
                                                507 => 'Insufficient Storage',                                        // RFC4918
                                                508 => 'Loop Detected',                                               // RFC5842
                                                510 => 'Not Extended',                                                // RFC2774
                                                511 => 'Network Authentication Required',                             // RFC6585
                                                );
			return ($status[$this->_code])?$status[$this->_code]:$status[500];
		}
		
		public function get_request_method(){
			return $_SERVER['REQUEST_METHOD'];
		}
		
		private function inputs(){
			switch($this->get_request_method()){
				case "POST":
					$this->_request = $this->cleanInputs($_POST);
                                        $this->_rawrequest = $_POST;
					break;
				case "GET":
				case "DELETE":
                                        $this->_request = $this->cleanInputs($_GET);
					$this->_rawrequest = $_GET;
					break;
				case "PUT":
                                        parse_str(file_get_contents("php://input"),$this->_request);
					$this->_request = $this->cleanInputs($this->_request);
					$this->_rawrequest = $_POST;
					break;
				default:
					$this->response('',406);
					break;
			}
                        $this->_header = getallheaders();
		}		
		
		private function cleanInputs($data){
			$clean_input = array();
			if(is_array($data)){
				foreach($data as $k => $v){
          $clean_input[$k] = $this->cleanInputs($v);
        }
      }else{
        if(get_magic_quotes_gpc()){
          $data = trim(stripslashes($data));
        }
        //$data = strip_tags($data);
        $clean_input = trim($data);
      }
      return $clean_input;
		}		
		
		private function set_headers(){
			@header("HTTP/1.1 ".$this->_code." ".$this->get_status_message());
			@header("Content-Type:".$this->_content_type);
		}
                public function getHeader($key){
                    if(isset($this->_header[$key]))
			return $this->_header[$key];
                    else
                        return '';
		}
	}	

if (!function_exists('getallheaders')) 
{ 
	function getallheaders() 
	{ 
		$headers = ''; 
		foreach ($_SERVER as $name => $value) 
		{ 
			if (substr($name, 0, 5) == 'HTTP_') 
			{ 
				$headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value; 
			} 
		} 
		return $headers; 
	} 
}
?>
<?php
setlocale(LC_ALL, 'Asia/Kolkata');
date_default_timezone_set("Asia/Kolkata");
defined("DB_HOST") ? null : define("DB_HOST", "localhost");
defined("DB_USER") ? null : define("DB_USER", "root");
defined("DB_PASSWORD") ? null : define("DB_PASSWORD", "");
defined("DB_NAME") ? null : define("DB_NAME", "library");
$config['host']   = DB_HOST;
$config['username'] = DB_USER;
$config['password'] = DB_PASSWORD;
$config['database'] =   DB_NAME;

//require_once ('libraries/Google/autoload.php');

error_reporting(0);
/******** Autoload Function **********/
function autoLoad($className){
    if (preg_match('/[^a-z0-9\-_.]/i', $className)) {
            throw new RuntimeException('Security check: Illegal character in filename.');
        }        
    if(file_exists(__DIR__.'/classes/'.$className . '.class.php'))
    include_once(__DIR__.'/classes/'.$className . '.class.php');
    //include_once(__DIR__.'/lib/PHPExcel/'.CLASS_PREFIX.$className .'.class.php');
}

// Registering the autoLoad Function
spl_autoload_register('autoLoad');

//Creating instance of Database connection
$db=new Connection($config['host'],$config['username'],$config['password'],$config['database']);
$currency           = '&#8377; '; //currency symbol
$config['taxes']              = array( //List your Taxes percent here.
                            'VAT' => 12, 
                            'Service Tax' => 5,
                            'Other Tax' => 10
                            );

define("SEND_EMAIL", true);
function phpmailerObj($to, $name, $subject, $message, $body, $altBody)
{
      //Send Mail to the student
    require_once 'classes/PHPMailer/class.phpmailer.php';
    $mail = new PHPMailer;
    $mail->isSMTP(); 
    $mail->SMTPDebug  = 0;
    $mail->From = "sachin@chainreader.in";
    $mail->FromName = "Chain Readers";
    $mail->Host = 'server31.hostwhitelabel.com';                 // Specify main and backup server
    $mail->Username =  'sachin@chainreader.in'; 
    $mail->Password = 'sachin@12345';  
    $mail->AddAddress($to,$name);  // Add a recipient
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->AltBody =  $altBody;
    $mail->SMTPSecure = 'tls'; 
    $mail->Port = 25;
    $mail->IsHTML(true);  
    ///return $mail->Send();
    if(!$mail->send()) 
    {
        //echo "Mailer Error: " . $mail->ErrorInfo;
    } 
    else 
    {
        //echo "Message has been sent successfully";
        return true;   
    }
}

//Insert your cient ID and secret 
//You can get it from : https://console.developers.google.com/
$client_id = '588003759784-r4a4dbqrbd4bh6q55o3rm79j7nbsjula.apps.googleusercontent.com';
$client_secret = '2nljwGNjASdvb_GLJXn9_5Zo';
$redirect_uri = 'http://127.0.0.1/s/index.php';
$config['due_days']=21;
$config['per_date_rs']=5;
$config['custom_sms_message']='We have received your order for order number';
$config['custom_sms_message1']=' and it is being processed. You can expect delivery within 3 days';
$config['sendSMS'] =true;
function sendSms($number,$message,$sender){
   //Your authentication key
    if($config['sendSMS']){
        $authKey = "138855A8d0029bMfN588c4339";

        //Multiple mobiles numbers separated by comma
        $mobileNumber = $number;

        //Sender ID,While using route4 sender id should be 6 characters long.
        $senderId = "123456";

        //Your message to send, Add URL encoding here.
        $message = urlencode($message);

        //Define route 
        $route = "default";
        //Prepare you post parameters
        $postData = array(
            'authkey' => $authKey,
            'mobiles' => $mobileNumber,
            'message' => $message,
            'sender' => $senderId,
            'route' => $route
        );

        //API URL
        $url="http://api.msg91.com/api/sendhttp.php";

        // init the resource
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData
            //,CURLOPT_FOLLOWLOCATION => true
        ));


        //Ignore SSL certificate verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);


        //get response
        $output = curl_exec($ch);

        //Print error if any
        if(curl_errno($ch))
        {
            echo 'error:' . curl_error($ch);
        }

curl_close($ch);
    }
}


define("DUE_DAYS",21);
define("DUE_WEEKS",3);
define("SHOW_AMOUNT_ON_RETURNING",true);
define("SERVER_URL", 'https://chainreader.in/');
define("RSPERDAY", '5');
define("RSPERWEEK", '29');
define("RSDUEPERDAY", '29');
define("RSDUEPERWEEK", '39');
define("LENDEDPERWEEK", '10');
define("SEND_WELCOME_EMAIL", false);
define("SEND_INVOICE_EMAIL", false);
define("SEND_ORDER_DELIVERY_EMAIL",false);
define("SEND_LENDER_BOOK_EMAIL",false);
define("SEND_ORDER_RETURN_EMAIL",true);
define("SEND_COMPLETED_RETURN__EMAIL",false);

?>


<?php
setlocale(LC_ALL, 'Asia/Kolkata');
date_default_timezone_set("Asia/Kolkata");
defined("DB_HOST") ? null : define("DB_HOST", "localhost");
defined("DB_USER") ? null : define("DB_USER", "root");
defined("DB_PASSWORD") ? null : define("DB_PASSWORD", "admin");
defined("DB_NAME") ? null : define("DB_NAME", "library");
$config['host']   = DB_HOST;
$config['username'] = DB_USER;
$config['password'] = DB_PASSWORD;
$config['database'] =   DB_NAME;

//require_once ('libraries/Google/autoload.php');

error_reporting(-1);
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
    
    $mail->From = "chiranjeeviadi@gmail.com";
    $mail->FromName = "Full Name";
    $mail->isSMTP(); 
    $mail->AddAddress($to,$name);  // Add a recipient
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->AltBody =  $altBody;
    $mail->SMTPSecure = 'tls'; 
    $mail->Port = 587;
    $mail->IsHTML(true);  
    ///return $mail->Send();
    if(!$mail->send()) 
    {
        echo "Mailer Error: " . $mail->ErrorInfo;
    } 
    else 
    {
        echo "Message has been sent successfully";
        return true;   
    }
}

//Insert your cient ID and secret 
//You can get it from : https://console.developers.google.com/
$client_id = '588003759784-r4a4dbqrbd4bh6q55o3rm79j7nbsjula.apps.googleusercontent.com';
$client_secret = '2nljwGNjASdvb_GLJXn9_5Zo';
$redirect_uri = 'http://127.0.0.1/s/index.php';
$config['due_days']=20;
$config['per_date_rs']=5;

?>


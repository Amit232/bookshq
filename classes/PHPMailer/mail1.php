<?php
require 'class.phpmailer.php';

$mail = new PHPMailer;

$mail->IsSMTP();                                      // Set mailer to use SMTP



$mail->Host = 'smtp.mandrillapp.com';                 // Specify main and backup server
$mail->Port = 587;                                    // Set the SMTP port
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'chandra.sekhar@formaccorp.com';    // SMTP username
$mail->Password = 'FFSBHKEy9Ne4v-9V77iFng';           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted

$mail->From = 'admin@epracto.com';
$mail->FromName = 'Admin Epracto';
$mail->AddAddress('dnyanesh.pawar@formaccorp.com', 'dnyanesh');  // Add a recipient
$mail->AddAddress('rupraj.pradhan@formaccorp.com.com');               // Name is optional

$mail->IsHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Test Mail';
$mail->Body    = 'This is the HTML message body <strong>in bold!</strong>';
$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
print_r($mail);

if(!$mail->Send()) {
   echo 'Message could not be sent.';
   echo 'Mailer Error: ' . $mail->ErrorInfo;
   exit;
}

echo 'Message has been sent';
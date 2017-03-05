<?php

class Utility{
    
    public function __construct() {
    }
    public function __destruct() {
    }
    /**
     *
     * @create a ordinal number from a number
     *
     * @param int $num
     *
     * @return string
     *
     */
    public function ordi($n){
        $s='';
        switch($n%10){
        case 1: $s = 'st';
                break;
        case 2: $s = 'nd';
                break;
        case 3: $s = 'rd';
                break;
        default:$s = 'th';
                break;
        }
        return $n.$s;
    }
    public function generateRandomString($length = 10) {
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
}
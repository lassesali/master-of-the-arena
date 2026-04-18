<?php session_start();
/*
 * register.php
 * Handles regular user registration.
 */

if (isset($_POST['email']) && isset($_POST['password']) && isset($_POST['firstname'])) {
    $email = strip_tags($_POST['email']);
    $firstname = strip_tags($_POST['firstname']);
    $password = $_POST['password']; 

    if ($email != "" && $password != "") {
        include 'DBconnect.php';
        $tableName = "am_users";

        // ALWAYS escape inputs to prevent SQL Injection
        $safe_email = mysql_real_escape_string($email);
        $safe_firstname = mysql_real_escape_string($firstname);

        // Check if user already exists
        $check_result = mysql_query("SELECT * FROM $tableName WHERE user_email='$safe_email'");
        if (mysql_fetch_row($check_result)) {
            echo json_encode(array("status" => "error", "message" => "User already exists"));
            exit;
        }

        // Generate a secure salt for PHP 5.4 without relying on the missing mcrypt extension
        $characters = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $salt = '';
        for ($i = 0; $i < 22; $i++) {
            $salt .= $characters[mt_rand(0, 63)];
        }
        $hash = crypt($password, '$2y$10$' . $salt . '$');

        // Insert new user
        $query = "INSERT INTO $tableName (user_email, user_firstname, user_password) VALUES ('$safe_email', '$safe_firstname', '$hash')";

        if (mysql_query($query)) {
            echo json_encode(array("status" => "success", "message" => "User registered successfully"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Database error"));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Missing fields"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request"));
}
?>
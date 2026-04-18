<?php session_start();
/*
 * regular_login.php
 * Handles regular user login and session tracking.
 */

$sessid = session_id();

// Expecting POST for security, not GET
if (isset($_POST['session']) && isset($_POST['email']) && isset($_POST['password'])) {
    
    $session = strip_tags($_POST['session']);
    $email = strip_tags($_POST['email']);
    $password = $_POST['password'];

    if ($email != "" && $password != "") {
        
        include 'DBconnect.php';
        $tableName = "am_users";
        $loginTableName = "am_login";

        $safe_email = mysql_real_escape_string($email);

        // Query database for the user
        $result = mysql_query("SELECT * FROM $tableName WHERE user_email='$safe_email'");          
        $user_row = mysql_fetch_array($result);

        if ($user_row && $user_row['user_password'] != null) {
            
            // Verify the password against the stored bcrypt hash
            if (crypt($password, $user_row['user_password']) == $user_row['user_password']) {
                
                $num = 1; // User found and authenticated
                $first = mysql_real_escape_string($user_row['user_firstname']);
                $safe_session = mysql_real_escape_string($session);

                // Add to Login database, mimicking your Google login flow
                mysql_query("INSERT INTO $loginTableName (login_sessionid, login_firstname, login_email) VALUES ('$safe_session', '$first', '$safe_email')");
                // --- CHANGED: Return an array with the firstname ---
                echo json_encode(array("status" => 1, "firstname" => $user_row['user_firstname']));
                //echo json_encode($num);

            } else {
                // Invalid password
                echo json_encode(false);
            }
        } else {
            // User not found or is a Social-Only login (no password set)
            echo json_encode(false);
        }
    } else {
        Print "Error: Missing credentials.";
    }
} else {
    Print "Session or credentials not found. (" . $sessid . ")";
}
?>
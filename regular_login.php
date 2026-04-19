<?php session_start();
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 *
 * regular_login.php
 * Handles regular user login and session tracking.
 */
header('Content-Type: application/json');

$sessid = session_id();


// Check that form data has been submitted
if (isset($_POST['email']) && isset($_POST['password'])) {
    
    // Sanitize email. Password is NOT sanitized (strip_tags) to preserve special characters.
    $email = trim(strip_tags($_POST['email']));
    $password = $_POST['password'];

    if ($email !== "" && $password !== "") {
        include 'DBconnect.php'; // In Docker $host = 'db'
        $tableName = "am_users";
        $loginTableName = "am_login";

        // 1. Fetch user from database based on email (Prepared Statement)
        try {
            $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_password FROM $tableName WHERE user_email = ?");

        } catch (mysqli_sql_exception $e) {
            // FAILSAFE: Check if preparation failed (e.g., table doesn't exist)
            echo json_encode([
                "status" => "error", 
                "message" => "Database error (Check): " . mysqli_error($con) 
            ]);
            mysqli_close($con);
            exit;
        }

        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user_row = mysqli_fetch_assoc($result);

        // 2. Verify password
        // If user was found and password matches the database hash:
        if ($user_row && password_verify($password, $user_row['user_password'])) {
            
            // 3. MOST IMPORTANT STEP: Set the session as active!
            // This allows checklogin.php and player.php to recognize the player.
            $_SESSION['user_email'] = $email;
            $_SESSION['user_id'] = $user_row['ID'];
            
            $first = $user_row['user_firstname'];
            $session_id = session_id();

            // 4. (Optional) Log the login event into the am_login table
            try 
            {
                $log_stmt = mysqli_prepare($con, "INSERT INTO $loginTableName (login_sessionid, login_firstname, login_email) VALUES (?, ?, ?)");

            } catch (mysqli_sql_exception $e) {
                // FAILSAFE: Check if preparation failed (e.g., table doesn't exist)
                echo json_encode([
                    "status" => "error", 
                    "message" => "Database error (Check): " . mysqli_error($con) 
                ]);
                mysqli_close($con);
                exit;
            }

            mysqli_stmt_bind_param($log_stmt, "sss", $session_id, $first, $email);
            mysqli_stmt_execute($log_stmt);
            mysqli_stmt_close($log_stmt);

            // 5. Return success to the JS engine
            echo json_encode([
                "status" => 1, // game.js might be expecting the number 1
                "firstname" => $first,
                "message" => "Login successful"
            ]);

        } else {
            // Incorrect password or user does not exist
            // We don't tell the hacker which one it was so they can't guess emails.
            echo json_encode(["status" => 0, "message" => "Invalid email address or password."]);
        }
        
        mysqli_stmt_close($stmt);
        mysqli_close($con);
        
    } else {
        echo json_encode(["status" => 0, "message" => "Missing email or password."]);
    }
} else {
    echo json_encode(["status" => 0, "message" => "Invalid request."]);
}

?>
<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
session_start();
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 *
 * regular_login.php
 * Handles regular user login and session tracking.
 */
header('Content-Type: application/json; charset=utf-8');

$sessid = session_id();


// Check that form data has been submitted and inputs are strings
if (isset($_POST['email'], $_POST['password']) && is_string($_POST['email']) && is_string($_POST['password'])) {
    
    // Enforce strict byte limits to prevent oversized heap allocations and bcrypt DoS
    if (strlen($_POST['email']) > 254 || strlen($_POST['password']) > 72) {
        http_response_code(400);
        echo json_encode(["status" => 0, "message" => "Invalid email address or password."]);
        exit;
    }

    // Sanitize email. Password is NOT sanitized (strip_tags) to preserve special characters.
    $email = trim(strip_tags($_POST['email']));
    $password = $_POST['password'];

    if ($email !== "" && $password !== "") {
        require_once __DIR__ . '/DBconnect.php'; // In Docker $host = 'db'
        $tableName = "am_users";
        $loginTableName = "am_login";

        try {
            // 1. Fetch user from database based on email (Prepared Statement)
            $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_password FROM $tableName WHERE user_email = ? LIMIT 1");
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $user_row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);

            // 2. Verify password
            // If user was found and password matches the database hash:
            if ($user_row && is_string($user_row['user_password']) && password_verify($password, $user_row['user_password'])) {
                
                // 3. MOST IMPORTANT STEP: Set the session as active!
                // This allows checklogin.php and player.php to recognize the player.
                session_regenerate_id(true);
                $_SESSION['user_email'] = $email;
                $_SESSION['user_id'] = $user_row['ID'];
                
                $first = (string)$user_row['user_firstname'];
                $session_id = (string)session_id();

                // 4. (Optional) Log the login event into the am_login table
                $log_stmt = mysqli_prepare($con, "INSERT INTO $loginTableName (login_sessionid, login_firstname, login_email) VALUES (?, ?, ?)");
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
        } catch (Throwable $e) {
            // FAILSAFE: Check if preparation or execution failed without leaking internal driver error details
            http_response_code(500);
            echo json_encode([
                "status" => "error", 
                "message" => "Database error (Check)."
            ]);
        } finally {
            if (isset($con) && $con instanceof mysqli) {
                mysqli_close($con);
            }
        }
        
    } else {
        echo json_encode(["status" => 0, "message" => "Missing email or password."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => 0, "message" => "Invalid request."]);
}

?>
<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
session_start();
/*
 * register.php (PHP 8 Modernized Version)
 * Handles new player registration securely.
 */
header('Content-Type: application/json; charset=utf-8');

// Check if the form data was sent and all fields are strings
if (
    isset($_POST['email'], $_POST['password'], $_POST['firstname']) &&
    is_string($_POST['email']) &&
    is_string($_POST['password']) &&
    is_string($_POST['firstname'])
) {
    // Enforce strict byte limits before string allocations or hashing (bcrypt truncates >72 bytes)
    if (
        strlen($_POST['email']) > 254 ||
        strlen($_POST['firstname']) > 100 ||
        strlen($_POST['password']) > 72
    ) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Input exceeds maximum allowed length."]);
        exit;
    }
    
    // Sanitize email and first name. Password is NOT sanitized to preserve special characters.
    $email = trim(strip_tags($_POST['email']));
    $firstname = trim(strip_tags($_POST['firstname']));
    $password = $_POST['password']; 

    // Ensure fields are not empty and email is valid
    if ($email !== "" && $password !== "" && $firstname !== "" && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        require_once __DIR__ . '/DBconnect.php'; // In Docker, ensure $host = 'db'
        $tableName = "am_users";

        try {
            // 1. Prepare the query to check if the email is already in use
            $check_stmt = mysqli_prepare($con, "SELECT ID FROM $tableName WHERE user_email = ? LIMIT 1");
            mysqli_stmt_bind_param($check_stmt, "s", $email);
            mysqli_stmt_execute($check_stmt);
            $check_result = mysqli_stmt_get_result($check_stmt);

            // If a row is returned, the user already exists
            if (mysqli_fetch_assoc($check_result)) {
                echo json_encode(["status" => "error", "message" => "Email address is already in use."]);
                mysqli_stmt_close($check_stmt);
                mysqli_close($con);
                exit;
            }
            mysqli_stmt_close($check_stmt);

            // 2. Hash the password securely (PHP 8 standard)
            // This completely replaces the old crypt() and mt_rand() logic in one line!
            $hash = password_hash($password, PASSWORD_DEFAULT);

            // 3. Prepare the query to insert the new user
            $insert_stmt = mysqli_prepare($con, "INSERT INTO $tableName (user_email, user_firstname, user_password) VALUES (?, ?, ?)");
            mysqli_stmt_bind_param($insert_stmt, "sss", $email, $firstname, $hash);
            
            // Execute the insertion and check for success
            if (mysqli_stmt_execute($insert_stmt)) {
                echo json_encode(["status" => "success", "message" => "User registered successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Database error during registration."]);
            }
            
            mysqli_stmt_close($insert_stmt);
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
        echo json_encode(["status" => "error", "message" => "All fields must be filled."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
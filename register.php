<?php session_start();
/*
 * register.php (PHP 8 Modernized Version)
 * Handles new player registration securely.
 */
header('Content-Type: application/json');

// Check if the form data was sent
if (isset($_POST['email']) && isset($_POST['password']) && isset($_POST['firstname'])) {
    
    // Sanitize email and first name. Password is NOT sanitized to preserve special characters.
    $email = trim(strip_tags($_POST['email']));
    $firstname = trim(strip_tags($_POST['firstname']));
    $password = $_POST['password']; 

    // Ensure fields are not empty
    if ($email !== "" && $password !== "" && $firstname !== "") {
        include 'DBconnect.php'; // In Docker, ensure $host = 'db'
        $tableName = "am_users";

        try {
            // 1. Prepare the query to check if the email is already in use
            $check_stmt = mysqli_prepare($con, "SELECT ID FROM $tableName WHERE user_email = ?");

        } catch (mysqli_sql_exception $e) {
            // FAILSAFE: Check if preparation failed (e.g., table doesn't exist)
            echo json_encode([
                "status" => "error", 
                "message" => "Database error (Check): " . mysqli_error($con) 
            ]);
            mysqli_close($con);
            exit;
        }

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
        try {
            $insert_stmt = mysqli_prepare($con, "INSERT INTO $tableName (user_email, user_firstname, user_password) VALUES (?, ?, ?)");

        } catch (mysqli_sql_exception $e) {
            // FAILSAFE: Check if preparation failed (e.g., table doesn't exist)
            echo json_encode([
                "status" => "error", 
                "message" => "Database error (Check): " . mysqli_error($con) 
            ]);
            mysqli_close($con);
            exit;
        }

        mysqli_stmt_bind_param($insert_stmt, "sss", $email, $firstname, $hash);
        
        // Execute the insertion and check for success
        if (mysqli_stmt_execute($insert_stmt)) {
            echo json_encode(["status" => "success", "message" => "User registered successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error during registration: " . mysqli_error($insert_stmt)]);
        }
        
        mysqli_stmt_close($insert_stmt);
        mysqli_close($con);
        
    } else {
        echo json_encode(["status" => "error", "message" => "All fields must be filled."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
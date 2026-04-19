<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Setup</title>
    </head>

<body>

<?php

include 'DBconfig.php';

// 1. Connect to the database (PHP 8 style)
$con = mysqli_connect($host, $user, $pass);
if (!$con) {
    die("<p style='color:red;'>Connection error: " . mysqli_connect_error() . "</p>");
}

// Create the database if it doesn't exist, and select it
mysqli_query($con, "CREATE DATABASE IF NOT EXISTS $databaseName");
if (!mysqli_select_db($con, $databaseName)) {
    die("<p style='color:red;'>Database selection failed.</p>");
}

echo "<div style='font-family: sans-serif; padding: 20px; line-height: 1.6;'>";
echo "<h2>🛠️ Database initialization in progress...</h2>";

// ---------------------------------------------------------
// 2. Drop tables
// ---------------------------------------------------------
mysqli_query($con, "DROP TABLE IF EXISTS am_login");
mysqli_query($con, "DROP TABLE IF EXISTS am_users");
echo "<p>🗑️ Old tables removed.</p>";

// ---------------------------------------------------------
// 3. Create am_users table
// ---------------------------------------------------------
$create_users = "CREATE TABLE am_users (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(255) NOT NULL,
    user_firstname VARCHAR(255) DEFAULT NULL,
    user_password VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY user_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if (mysqli_query($con, $create_users)) {
    echo "<p>✅ Table <b>am_users</b> created.</p>";
}

// ---------------------------------------------------------
// 4. Create am_login table (Session tracking)
// ---------------------------------------------------------
$create_login = "CREATE TABLE am_login (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    login_sessionid VARCHAR(255) NOT NULL,
    login_firstname VARCHAR(255) DEFAULT NULL,
    login_email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if (mysqli_query($con, $create_login)) {
    echo "<p>✅ Table <b>am_login</b> created.</p>";
}

// ---------------------------------------------------------
// 5. Create test user (PHP 8 Modern Hash)
// ---------------------------------------------------------
$test_email = 'test@example.com';
$test_pass = 'test1234';
$test_name = 'TestPlayer';

// password_hash() handles salting automatically
$secure_hash = password_hash($test_pass, PASSWORD_DEFAULT);

$insert_sql = "INSERT INTO am_users (user_email, user_firstname, user_password) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($con, $insert_sql);
mysqli_stmt_bind_param($stmt, "sss", $test_email, $test_name, $secure_hash);

if (mysqli_stmt_execute($stmt)) {
    echo "<div style='background: #e7f3fe; border-left: 6px solid #2196F3; padding: 15px; margin-top: 20px;'>";
    echo "<strong>👤 Test user created!</strong><br>";
    echo "Email: $test_email<br>";
    echo "Password: $test_pass";
    echo "</div>";
}
mysqli_stmt_close($stmt);

echo "<h3 style='color: green;'>🎉 All done!</h3>";
echo "<p><a href='index.php'>⬅️ Go to the game's front page</a></p>";
echo "</div>";

mysqli_close($con);
?>

</body>
</html>

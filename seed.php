<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

<body>

<?php
/*
 * seed.php
 * Recreates the database tables for the application.
 * WARNING: Running this will delete all existing data!
 */

include 'DBconfig.php';

// Connect to the database using the legacy mysql_* functions matching your app
$con = mysql_connect($host, $user, $pass);
if (!$con) {
    die("Could not connect: " . mysql_error());
}

// Select the database (or attempt to create it if it doesn't exist)
$dbs = mysql_select_db($databaseName, $con);
if (!$dbs) {
    mysql_query("CREATE DATABASE IF NOT EXISTS $databaseName", $con);
    $dbs = mysql_select_db($databaseName, $con);
    if (!$dbs) {
        die("Could not select database: " . mysql_error());
    }
}

echo "<div style='font-family: sans-serif; padding: 20px;'>";
echo "<h2>Database Seeding Started...</h2>";

// ---------------------------------------------------------
// 1. Drop existing tables
// ---------------------------------------------------------
mysql_query("DROP TABLE IF EXISTS am_login");
mysql_query("DROP TABLE IF EXISTS am_users");
echo "<p>🗑️ Old tables dropped (if they existed).</p>";


// ---------------------------------------------------------
// 2. Create am_users table
// ---------------------------------------------------------
$create_users_query = "CREATE TABLE am_users (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(255) NOT NULL,
    user_firstname VARCHAR(255) DEFAULT NULL,
    user_password VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY user_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

if (mysql_query($create_users_query)) {
    echo "<p>✅ Table <b>am_users</b> created successfully.</p>";
} else {
    echo "<p>❌ Error creating am_users: " . mysql_error() . "</p>";
}


// ---------------------------------------------------------
// 3. Create am_login table
// ---------------------------------------------------------
$create_login_query = "CREATE TABLE am_login (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    login_sessionid VARCHAR(255) NOT NULL,
    login_firstname VARCHAR(255) DEFAULT NULL,
    login_email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

if (mysql_query($create_login_query)) {
    echo "<p>✅ Table <b>am_login</b> created successfully.</p>";
} else {
    echo "<p>❌ Error creating am_login: " . mysql_error() . "</p>";
}


// ---------------------------------------------------------
// 4. Insert a Test User
// ---------------------------------------------------------
// Generating the native PHP 5.4 salt we created earlier
$characters = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
$salt = '';
for ($i = 0; $i < 22; $i++) {
    $salt .= $characters[mt_rand(0, 63)];
}
$hash = crypt('test1234', '$2y$10$' . $salt . '$');

$insert_test_user = "INSERT INTO am_users (user_email, user_firstname, user_password) 
                     VALUES ('test@example.com', 'TestUser', '$hash')";

if (mysql_query($insert_test_user)) {
    echo "<p>👤 Test user created successfully!</p>";
    echo "<ul>";
    echo "<li><b>Email/Username:</b> test@example.com</li>";
    echo "<li><b>Password:</b> test1234</li>";
    echo "</ul>";
} else {
    echo "<p>❌ Error creating test user: " . mysql_error() . "</p>";
}

echo "<h3>🎉 Seeding Complete!</h3>";
echo "<p><a href='index.php'>Go back to the game</a></p>";
echo "</div>";

?>


</body>
</html>

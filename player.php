<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
session_start();
/*
 * player.php (PHP 8 Modernisoitu versio)
 * Hakee (tai päivittää) kirjautuneen pelaajan tiedot.
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/DBconnect.php'; // Varmista, että Dockerissa $host = 'db'

// 1. Varmistetaan, että pelaaja on kirjautunut sisään
if (isset($_SESSION['user_email']) && is_string($_SESSION['user_email']) && $_SESSION['user_email'] !== "" && strlen($_SESSION['user_email']) <= 254) {
    $email = $_SESSION['user_email'];
    $tableName = "am_users";

    // 2. Tehdään turvallinen haku (Prepared Statement)
    try {
        $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_email FROM $tableName WHERE user_email = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            
            $playerData = [
                "id" => $row['ID'],
                "name" => $row['user_firstname'],
                "email" => $row['user_email']
            ];

            echo json_encode([
                "status" => "success",
                "player" => $playerData
            ]);
            
        } else {
            echo json_encode(["status" => "error", "message" => "Player data corrupted or not found."]);
        }
        
        mysqli_stmt_close($stmt);
    } catch (Throwable $e) {
        // FAILSAFE: Check if preparation or execution failed without leaking internal driver error details
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "message" => "Database error (Check)."
        ]);
    }

} else {
    // Jos pelaaja yrittää hakea tietoja ilman kirjautumista
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in."]);
}

mysqli_close($con);
?>
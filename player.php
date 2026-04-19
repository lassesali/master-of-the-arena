<?php session_start();
/*
 * player.php (PHP 8 Modernisoitu versio)
 * Hakee (tai päivittää) kirjautuneen pelaajan tiedot.
 */
header('Content-Type: application/json');

include 'DBconnect.php'; // Varmista, että Dockerissa $host = 'db'

// 1. Varmistetaan, että pelaaja on kirjautunut sisään
if (isset($_SESSION['user_email'])) {
    $email = $_SESSION['user_email'];
    $tableName = "am_users";

    // 2. Tehdään turvallinen haku (Prepared Statement)
            try 
            {
		$stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_email FROM $tableName WHERE user_email = ?");

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

} else {
    // Jos pelaaja yrittää hakea tietoja ilman kirjautumista
    echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in."]);
}

mysqli_close($con);
?>
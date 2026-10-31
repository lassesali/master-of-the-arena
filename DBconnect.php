<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 */

require_once __DIR__ . '/DBconfig.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $con = mysqli_connect($host, $user, $pass, $databaseName);
    mysqli_set_charset($con, 'utf8mb4');
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'error', 'message' => 'Service temporarily unavailable.']);
    exit;
}
?>
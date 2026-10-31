<?php 
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 * Modernisoitu PHP 8 & Native Login -aikakaudelle.
 */

// Otetaan talteen koko näytön tila, jos se on asetettu URL:ssa (esim. ?fullscreen=1)
if (isset($_GET['fullscreen']) && is_string($_GET['fullscreen']) && $_GET['fullscreen'] === '1') {
    $fullscreen = "1";
} else {
    $fullscreen = "0";
}

// Otetaan talteen kieli, tai asetetaan oletuskieli
$allowedLanguages = ['English', 'Finnish', 'French', 'German', 'Portuguese', 'Spanish'];
if (isset($_GET['language']) && is_string($_GET['language']) && in_array($_GET['language'], $allowedLanguages, true)) {
    $language = $_GET['language'];
} else {
    $language = "English"; // Alkuperäinen oletusarvo
}

// Kaikki vanha LightOpenID, Google-kirjautumisen seuranta ja manuaalinen 
// session välittäminen on poistettu, koska uusi checklogin.php hoitaa 
// autentikaation turvallisesti evästeiden avulla.
?>
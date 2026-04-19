<?php 
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 * Modernisoitu PHP 8 & Native Login -aikakaudelle.
 */

// Otetaan talteen koko näytön tila, jos se on asetettu URL:ssa (esim. ?fullscreen=1)
if (isset($_GET['fullscreen'])) {
    $fullscreen = strip_tags($_GET['fullscreen']);
} else {
    $fullscreen = "0";
}

// Otetaan talteen kieli, tai asetetaan oletuskieli
if (isset($_GET['language'])) {
    $language = strip_tags($_GET['language']);
} else {
    $language = "English"; // Alkuperäinen oletusarvo
}

// Kaikki vanha LightOpenID, Google-kirjautumisen seuranta ja manuaalinen 
// session välittäminen on poistettu, koska uusi checklogin.php hoitaa 
// autentikaation turvallisesti evästeiden avulla.
?>
# 🚀 Master of the Arena (v0.3.0 2026 Modernization Upgrade)
**Branch:** `feature/php8-upgrade` (Built on `feature/native-login`)

## 📖 Overview
This branch represents a major architectural leap for the project, upgrading the original 2013-2014 codebase to modern **PHP 8** standards. It completely decouples the game from legacy third-party social integrations (Facebook/Google OpenID) and replaces them with a secure, native Email & Password authentication system. 

Additionally, this upgrade patches several legacy HTML5 Canvas and JavaScript bugs to ensure compatibility with modern browser engines (Chromium/Gecko/WebKit).

## ✨ Key Technical Upgrades

### 🔒 Backend & Security (PHP 8)
* **Removed Deprecated Extensions:** Completely removed all legacy `mysql_*` functions (e.g., `mysql_query`, `mysql_real_escape_string`) which are no longer supported in PHP 8.
* **Prepared Statements:** Migrated all database interactions to `mysqli` with parameterized/prepared statements to guarantee 100% protection against SQL Injection.
* **Modern Cryptography:** Replaced the manual `mt_rand()` and `crypt()` hashing algorithm with PHP's native, highly secure `password_hash()` and `password_verify()`.
* **Graceful Error Handling:** Handled PHP 8.1+ `mysqli` Strict Mode exceptions to prevent Fatal Errors when database tables are missing, returning clean JSON responses instead.
* **Decoupled Social Logins:** Removed obsolete OpenID and Facebook SDK backend validations in favor of standard, secure session cookies (`checklogin.php`).

### 🎮 Frontend & Engine (JavaScript)
* **Dynamic UI Notifications:** Implemented clear, on-screen notification messages on the login screen to provide immediate user feedback following registration and login attempts.
* **Infinite Loop Fix:** Rewrote the UI text-scaling engine in `this.draw()`. Replaced a dangerous `em`-based mathematical calculation with a safe, pixel-based failsafe loop to prevent the browser's main thread from freezing.
* **Modern Autoplay Policy Compliance:** Modern browsers block audio without user interaction. Updated the audio engine (`musicPlayer` and `this.playAudio()`) to catch `NotAllowedError` promises silently and trigger background music only upon the user's first physical click on the document.
* **UI State Machine Cleanup:** Removed `FACEBOOK_ONLINE` and `GOOGLE_ONLINE` states, consolidating the engine into a clean `REGULAR_ONLINE` vs `OFFLINE` state flow.

## 🛠️ Local Development & Setup

Since the application now relies on a modernized database structure, follow these steps to run the game locally using your Docker environment:

### 1. Start the Docker Containers
Ensure your PHP 8 and MySQL containers are running:
```bash
docker-compose up -d
```

### 2. Initialize the Database
Because Docker initializes with an empty MySQL volume, you must create the necessary tables for the new native login system.

Open your browser and navigate to: `http://localhost:8080/seed.php`

You should see success messages confirming that the am_users and am_login tables have been created.

### 3. Test the Game
Navigate to `http://localhost:8080/`

The game should initialize the new Native Login GUI.

Register a new user (data is sent via POST to `register.php`).

Ensure audio plays after your first click!

## 📂 Key Modified Files
`index.php` - Cleaned wrapper, removed FB-root and legacy PHP session echoes.

`init.php` - Stripped of old OpenID logic.

`register.php` / `player.php` / `checklogin.php` - Rewritten for PHP 8 / MySQLi.

`js/game.js` - State machine updates and text-scaling infinite loop fix.

`seed.php` - Utility script for database seeding.

## 🕰️ Historical Note
The original 2013-2014 codebase (with the Facebook Canvas/Google login implementations) is preserved in the 2014 branch for historical reference.

## License ##

Copyright (c) 2013-2026 Lasse Sali

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

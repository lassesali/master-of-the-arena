# Master of the Arena (v0.2.0 Auth Update)

## 🚀 Recent Changes (Native Login Update)
The authentication system has been modernized. Legacy 2013-era social logins (Facebook Graph API v1 and Google OpenID 2.0) have been retired due to upstream deprecations. 

The application now uses a **Native Email/Password Authentication** system. Passwords are securely hashed using a native bcrypt implementation compatible with PHP 5.4.

## 🛠️ Local Setup & Database Migration

**IMPORTANT:** If you are pulling this branch for the first time, you must update your local database to support the new password hashing system.

### Option 1: Quick Seed (Wipes Data)
If you are starting fresh or don't mind losing your local development data, you can run the provided seed script to instantly rebuild the tables and create a test user.
1. Start your local PHP/MySQL server.
2. Navigate to `http://localhost:8080/seed.php` in your browser.
3. Once successful, **delete or rename `seed.php`** so you don't accidentally wipe your database later.

### Option 2: Manual Migration (Keeps Data)
If you want to keep your existing `am_users` and `am_login` data, run this SQL command in your database client (like phpMyAdmin or MySQL Workbench):
```sql
ALTER TABLE am_users ADD COLUMN user_password VARCHAR(255) DEFAULT NULL;
```

## 🧪 Testing the Login ##
If you used the seed.php script, you can immediately log into the game using the following credentials:

- Email/Username: test@example.com
- Password: test1234

Otherwise, click "Sign Up" on the main screen to create a brand new account.

## ⚙️ Requirements ##
- PHP 5.4 (Note: Uses legacy mysql_* functions. These were deprecated in PHP 5.5 and completely removed in PHP 7.0+)
- MySQL Database

## License ##

Copyright (c) 2026 Lasse Sali

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. 

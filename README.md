# Absolutely secure banking

Demo https://absolutely-secure-banking.fly.dev/

This is an example application to show common security-holes in application.

I created this for use in educational presentations.

## Features aka glaring security-holes

- SQL-injection everywhere!
- Basic optional login
- Transfer money!
- Show password in plaintext, md5 and argon2. Still just uses plaintext-password.
- Scoped databases for each visitor

  - Each database is created on demand (in memory), with the scope-key set as a cookie.
  - Auto-cleanup if there are too many databases.

  ./docs/assets/abs.mp4

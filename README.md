# Simple-Authentication
This is a simple rest api built with node js which aims to authenticate and manage accounts

## Features
- login and signup
- email verification
- forgot password
- reset password
- view account
- update account
- delete account

## API
| Method | URI                                 | Middleware |
|--------|-------------------------------------|------------|
| POST   | /authentication/login               | guest      |
| POST   | /authentication/signup              | guest      |
| POST   | /authentication/verify              | guest      |
| POST   | /authentication/resend              | guest      |
| POST   | /authentication/forgot-password     | guest      |
| POST   | /authentication/change-password     | auth       |
| GET    | /user                               | auth       |
| PATCH  | /user                               | auth       |
| DELETE | /user                               | auth       |

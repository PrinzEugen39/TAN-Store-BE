# TAN-Store-BE

An Express backend with MongoDB+Mongoose made with 🥰.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- Email Verification after signing up the application
- Mailtrap and Brevo for email client
- Robust error handling
- Schema methods and mongodb aggregation
- Forgot password feature and reset password email
- Winston for logging
- Some modern backend API Features such as:
  - Search via API
  - Filtering
  - Sorting
  - etc
- Alias routes

## Getting Started

### Installation

- Clone This Repository

`https://github.com/PrinzEugen39/TAN-Store-BE.git`

- Install Module

`yarn`

- Run this project in development mode with `yarn start`.

- Run this project in production mode with `yarn start:prod`.

- Setting env

```bash
NODE_ENV=
DATABASE=
DATABASE_PASSWORD=
PORT=
JWT_SECRET=
JWT_EXPIRE=
JWT_COOKIE_EXPIRES_IN=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=

EMAIL_FROM=

PROD_EMAIL_BREVO_HOST=
PROD_EMAIL_BREVO_PORT=
PROD_EMAIL_BREVO_LOGIN=
PROD_EMAIL_BREVO_SMTP=
PROD_EMAIL_BREVO_API=
```

### Prerequisites

- [Node.js](https://nodejs.org/) - JavaScript runtime.
- [Yarn](https://yarnpkg.com/) - Dependency manager.
- [MongoDB](https://www.mongodb.com/) - NoSQL database.

## API Documentation

If your project has an API, provide information about how to use it.

## License

This project is licensed under the [License Name] - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

My mom <3

# Description

Candidate API

# How to start

1. Copy .env.sample and rename to .env

```sh
  cp .env.sample .env
```

2. Start Docker

```sh
  docker-compose up --build
```

3. Server will listen at `:3000` by default. you can try some simple request

```sh
  curl --location 'http://localhost:3000'
```

# Generate Bearer Access token

This system has two role for users (Candidate, Admin). you can get Candidate id or Admin id from database and run these command to get access-token

```sh
  // pnpm
  pnpm run generate-token {id} {Admin|Candidate}

  // yarn
  yarn generate-token {id} {Admin|Candidate}

  // npm
  npm generate-token {id} {Admin|Candidate}
```

```sh
  pnpm run generate-token 1 Candidate
```

## Sample Request

You can make a request with curl or use [Postman Collection](Candidate-Backend.postman_collection.json)

```sh
  curl --location 'http://localhost:3000/appointments?limit=3' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJDYW5kaWRhdGUiLCJpYXQiOjE2ODk1ODg5MTQsImV4cCI6MTY4OTY3NTMxNH0.Zcxm1xb-rTc3F5mure1f4_868-7X_FQ18Q0VpMV7jzg'
```

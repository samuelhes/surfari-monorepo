# API Documentation

Base URL: `http://localhost:3000`

## Authentication

### Register
`POST /auth/register`
- Body: `{ email, password, full_name, phone, role, car_info? }`
- Response: `{ token, user }`

### Login
`POST /auth/login`
- Body: `{ email, password }`
- Response: `{ token, user }`

### Get Me
`GET /auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ id, email, full_name, role, ... }`

## Rides

### Publish Ride
`POST /rides`
- Headers: `Authorization: Bearer <token>`
- Body: `{ origin, destination, departure_time, seats_total, price_per_seat, ... }`

### Search Rides
`GET /rides`
- Query Params: `origin`, `destination`, `date`
- Response: `[Ride]`

### Get Ride Details
`GET /rides/:id`
- Response: `Ride` details including driver info.

## Requests

### Create Request
`POST /rides/:id/requests`
- Headers: `Authorization: Bearer <token>`
- Body: `{ seats_requested }`

### Get Requests (Driver only)
`GET /rides/:id/requests`
- Headers: `Authorization: Bearer <token>`
- Response: `[Request]`

### Accept Request
`POST /rides/:id/requests/:requestId/accept`
- Headers: `Authorization: Bearer <token>`
- Effect: Triggers payment, updates status to ACCEPTED.

### Reject Request
`POST /rides/:id/requests/:requestId/reject`
- Headers: `Authorization: Bearer <token>`
- Effect: Updates status to REJECTED.

## User

### My Trips
`GET /users/me/trips`
- Headers: `Authorization: Bearer <token>`
- Response: `{ asPassenger: [Request], asDriver: [Ride] }`

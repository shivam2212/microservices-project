# Microservices Project

This repository contains a microservices-based architecture with multiple independent services working together. Each service can be developed, tested, and deployed independently.

---

## Project Structure

microservices-project/
├── api-gateway/
│ ├── index.js
│ └── routes/
├── auth-service/
│ ├── index.js
│ └── controllers/
├── user-service/
│ ├── index.js
│ └── controllers/
├── wallet-service/
│ ├── index.js
│ └── services/
├── service-charge-service/
│ ├── index.js
│ └── utils/
├── transaction-service/
│ ├── index.js
│ └── models/
├── queue-service/
│ ├── index.js
│ └── consumer.js
├── cron-service/
│ ├── index.js
│ └── cron.js
├── dummy-bank-api/
│ └── index.js
├── common/
│ ├── db.js
│ ├── logger.js
│ └── models/
├── docker-compose.yml
├── .env
└── README.md



---

## Overview of Services

- **api-gateway**: The entry point for client requests. Routes requests to appropriate microservices.
- **auth-service**: Handles authentication and authorization.
- **user-service**: Manages user data and profiles.
- **wallet-service**: Manages wallet operations and balances.
- **service-charge-service**: Calculates and manages service charges.
- **transaction-service**: Handles transaction records and processing.
- **queue-service**: Manages asynchronous message queues and consumers.
- **cron-service**: Runs scheduled tasks and cron jobs.
- **dummy-bank-api**: Simulates a bank API for testing purposes.
- **common**: Shared utilities, database connection, logging, and models used across services.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized setup)
- MongoDB or your preferred database (configured via `.env`)

---

## Setup and Running Services

### 1. Clone the repository

git clone https://github.com/shivam2212/microservices-project.git
cd microservices-project


### 2. Environment Variables

Create a `.env` file in the root directory (if not already present) and configure necessary environment variables such as database URIs, ports, API keys, etc.

Example `.env`:

PORT=3000
DB_URI=mongodb://localhost:27017/microservices
JWT_SECRET=your_jwt_secret


### 3. Install dependencies for each service

Each microservice has its own `package.json`. Navigate into each service folder and run:


You need to do this for:

- api-gateway
- auth-service
- user-service
- wallet-service
- service-charge-service
- transaction-service
- queue-service
- cron-service
- dummy-bank-api

### 4. Running the services

To start any service in development mode, navigate to the respective service directory and run:

npm run dev


Example:

cd auth-service
npm run dev


Repeat for all services you want to run.

---

## Running All Services with Docker Compose (Optional)

If you prefer to run all services together using Docker, ensure Docker and Docker Compose are installed.

1. Configure your `.env` file as needed.
2. Run:

docker-compose up --build


This will build and start all the services defined in `docker-compose.yml`.

---

## Useful Commands

| Command               | Description                             |
|-----------------------|-------------------------------------|
| `npm run dev`         | Starts the microservice in dev mode |
| `npm install`         | Installs dependencies                |
| `docker-compose up`   | Starts all services via Docker Compose |
| `docker-compose down` | Stops all running containers         |

---

## Notes

- Make sure all services are running on different ports as configured in `.env` or their respective configs.
- The `common` folder contains shared code and should be imported by services as needed.
- The `dummy-bank-api` service simulates external banking API calls for testing.

---

## Contributing

Feel free to open issues or submit pull requests for improvements.

---

## Contact

For any questions or support, contact [Shivam Pathak](mailto:shivampathak2212@gmail.com).



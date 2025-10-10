
A concise description of the project, its purpose, and key features.

Table of Contents

Features

Authentication

HTTP Session Management

Server Setup

Docker Setup

Branching Strategy

Linting

Unit Testing

Installation

Usage

Features

Secure authentication with bcrypt, HMAC, and JWT (HS256)

HTTP session management for persistent user sessions

Pre-fork worker server setup using NGINX, Gunicorn, and Waitress

Containerized deployment with Docker and Docker Compose

Clean and maintainable code with linting and unit testing

Git workflow using structured branching

Authentication

bcrypt: Hash and verify passwords securely

HMAC: Generate message authentication codes for integrity

JWT: JSON Web Tokens for stateless authentication

HS256: HMAC using SHA-256 algorithm for signing JWTs

HTTP Session Management

Use secure cookies for session tracking

Session expiration and renewal policies

Protection against CSRF and session hijacking

Server Setup

NGINX: Reverse proxy for load balancing and SSL termination

Gunicorn: WSGI server for Python apps with pre-fork worker model

Waitress: Production-ready WSGI server for Windows-based deployments

Docker Setup

Dockerfile: Defines the environment and dependencies

Docker Compose: Orchestrates multi-container setups for development and production

Branching Strategy

Main: Stable production-ready code

Develop: Latest development changes

Feature branches: Individual features and bug fixes

Merge pull requests after code review and testing

Linting

Black: Code formatting to maintain consistency and readability

Run:

black .

Unit Testing

Test individual components for correctness

Use pytest or your preferred testing framework

Run:

pytest

Installation

git clone https://github.com/Nandhan-rao9/todo.git

cd project

docker-compose up --build

Usage

Access the app at http://localhost:8000 (or configured port)

Use JWT tokens for authenticated routes

Monitor logs via Docker or server logs

Contributing

Fork the repo

Create a feature branch

Run tests before submitting a pull request

Follow linting and coding standards


# GitHub Copilot Instructions — TMDB BFF (Node.js + Vercel)

## Overview

You are helping build a production-ready **Backend for Frontend (BFF)** using Node.js that wraps TMDB APIs.

The goal is to:

- Provide a clean abstraction over TMDB
- Deploy on **Vercel (serverless)**
- Run smoothly in **local development**
- Follow modern, scalable backend patterns

This project should be optimized for integration with modern frontends (e.g., Next.js).

---

## Tech Stack Preferences

- Node.js (ES Modules preferred)
- TypeScript support (lightweight configuration)
- Minimal dependencies
- Serverless-first architecture
- Code should be clean, modular, maintainable and eslint-friendly

Avoid heavy frameworks unless clearly justified.

---

## Architecture Goals

- BFF pattern (frontend-friendly API layer)
- Hide TMDB complexity from frontend
- Normalize external API responses
- Add caching and resiliency

---

## Core Features

### Required Endpoints

- `GET /api/trending`
- `GET /api/movie/:id`
- `GET /api/tv/:id`
- `GET /api/search?q=`
- `GET /api/health` (health check)

---

## TMDB Integration

- Use TMDB API via environment variable:
  - `TMDB_API_KEY`
- Never expose API key to client
- Use:
  - fetch (preferred) OR axios
- Add:
  - Timeout handling
  - Retry logic
  - Error normalization

---

## Response Handling

- Transform responses into frontend-friendly DTOs
- Remove unnecessary fields
- Normalize:
  - image URLs
  - release dates
  - ratings
- Keep response shape consistent across endpoints

---

## Caching Strategy

- Lightweight in-memory caching
- Edge-safe where possible
- TTL-based caching for:
  - trending
  - popular movies
  - search results

---

## Test case

- Basic unit tests for API routes
- Mock TMDB API responses
- Follow typescript best practices

## Project Structure

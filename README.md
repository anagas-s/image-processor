# Image Processor

The **Image Processor** is a Node.js-based application designed to process image URLs submitted via an API. It calculates the perimeter of each image (based on its dimensions) and stores the results for retrieval. The system validates store IDs, downloads images, computes their dimensions using the `image-size` library, and updates job statuses accordingly.

---

## Features

- **API Endpoints**:
  - `/api/submit`: Accepts a JSON payload with store visits and image URLs.
  - `/api/status`: Retrieves the status and results of a submitted job.
- **Job Processing**: Uses BullMQ for background job processing.
- **Validation**: Ensures store IDs are valid before processing.
- **Error Handling**: Captures and logs errors during image downloads or processing.

---

## Assumptions

1. **Store Validation**: Valid store IDs are provided in a CSV file (`StoreMasterAssignment.csv`) and loaded into memory at startup.
2. **Image URLs**: All image URLs are publicly accessible and return valid image data.
3. **Environment**: Tested on Linux/macOS but should work on Windows with minor adjustments.
4. **Dependencies**: Assumes Node.js (v16+), npm, and Docker (optional) are installed on the host machine.
5. **Concurrency**: Processes one job at a time for simplicity, but BullMQ supports scaling with multiple workers if needed.

---

## Installation and Setup

### Without Docker

#### Prerequisites

- Node.js (v16 or higher)
- npm
- Redis (for BullMQ)

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/image-processor.git
   cd image-processor
   ```
2. Install dependencies:

```bash
 npm install

```

3. Start Redis locally. If not installed, follow the Redis installation guide .
4. Place the StoreMasterAssignment.csv file in the project root directory.
5. Run the application:

```bash
  npm start

```

The server will start on http://localhost:3000. 6. Test the API:

```bash

```

# Submit a job

curl -X POST http://localhost:3000/api/submit \
-H "Content-Type: application/json" \
-d '{
"count": 1,
"visits": [
{
"store_id": "RP00004",
"image_url": ["https://www.gstatic.com/webp/gallery/1.jpg"],
"visit_time": "2023-09-20T12:00:00Z"
}
]
}'

# Check job status

curl http://localhost:3000/api/status?jobid=<job_id>

```

```

# With Docker

Prerequisites

1. Docker and Docker Compose installed.
   . Steps
1. Clone the repository:

```bash
1. git clone https://github.com/your-repo/image-processor.git
2. cd image-processor
```

2. Build and run containers:

```bash
 docker-compose up --build
```

This will:
. Start a Redis container.
. Build and run the nodejs application container. 3. Test the API as described above. 4. View logs:

```bash
docker logs image-processor-app-1 --follow
```

# Work Environment

Operating System :Windows 11
Text Editor/IDE : Visual Studio Code.
Libraries :
express: For creating the API server.
bullmq: For background job processing.
axios: For downloading images.
image-size: For calculating image dimensions.
csv-parser: For parsing the store master CSV file.
Database : Redis (in-memory data store for job queue).
Testing Tools : Postman for API testing.

# Future Improvements

If given more time, here are some improvements that can be made:

# Scalability :

Add support for multiple workers to process jobs concurrently.
Use a persistent database (e.g., PostgreSQL) instead of in-memory storage for job results.

# Error Reporting :

Implement detailed error reporting with stack traces and retry mechanisms for failed jobs.

# Frontend Interface :

Build a simple frontend to submit jobs and view results without using curl.

# Security :

Add authentication and authorization to the API endpoints.
Validate image URLs more rigorously (e.g., check MIME types).

# Logging :

Integrate a logging library like winston for structured logs and log rotation.

# Testing :

Write unit tests for critical modules (e.g., store validation, image processing).
Add integration tests for API endpoints.

# Performance Optimization :

Cache frequently accessed store IDs to reduce lookup times.
Optimize image downloads by reusing HTTP connections.

# Documentation :

Provide OpenAPI/Swagger documentation for the API.
Add a user guide for non-technical users.

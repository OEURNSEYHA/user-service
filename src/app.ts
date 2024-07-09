import express from 'express';
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from '@/src/routes/v1/routes';
import fs from 'fs';
import path from 'path'
import { loggingMiddleware } from './utils/logger';
import { errorHandler } from './utils/errors/errorHanler';
// ===============================================================

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));

// ========================
// Initialize App Express
// ========================
const app = express();

// ========================
// Loggin Middleware
// ========================
app.use(loggingMiddleware);

// ========================
// Global Middleware
// ========================
app.use(express.json())  // Help to get the json from request body

// ========================
// Global API V1
// ========================
RegisterRoutes(app)

// ========================
// API Documentations
// ========================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
app.use(errorHandler);



export default app;
// jest.setup.ts

import 'tsconfig-paths/register'; // Register tsconfig-paths for path alias support
import dotenv from 'dotenv';

// Load dotenv to manage environment variables if needed
dotenv.config({
  path: './.env' // Adjust the path based on your project setup
});

// Additional setup if required for your tests

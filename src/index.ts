// src/index.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { startCLI } from './cli';

console.log("Initializing LineaCLI...");
console.log("Assistant Name:", process.env.ASSISTANT_NAME);

startCLI();

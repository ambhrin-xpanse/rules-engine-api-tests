import { test, expect } from "@playwright/test";
import { listJsonFiles, getJsonFileContent } from "../helpers/s3-helper";
import axios from "axios";
import { config } from "dotenv";

config(); 

const API_ENDPOINT = process.env.API_ENDPOINT!;

test.describe("API Tests using JSON files from S3", () => {
  test("Process all JSON files from S3", async ({ request }) => {
    // Step 1: List all JSON files in the bucket
    const jsonFiles = await listJsonFiles();

    if (jsonFiles.length === 0) {
      test.skip(true, "No JSON files found in the S3 bucket.");
    }

    for (const file of jsonFiles) {
      console.log(`Processing file: ${file}`);

      // Step 2: Read file content
      const requestBody = await getJsonFileContent(file);

      // Step 3: Make API request
      const response = await request.post(API_ENDPOINT, {
        data: requestBody,
      });

      // Step 4: Validate response status
      expect(response.status()).toBe(200); // Adjust status code as needed

      console.log(`✅ ${file} processed successfully.`);
    }
  });
});

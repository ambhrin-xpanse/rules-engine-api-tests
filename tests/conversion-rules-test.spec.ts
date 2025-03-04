import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';
dotenv.config();

test('Test: Execute one Conversion Rule', async () => {

//read the json from the request payload file
const requestPayload = require('../test-data/request.json');
const Url = process.env.API_URL;
if (!Url) {
  throw new Error('API_URL is not defined in the environment variables');
}
let response: AxiosResponse<any, any>;
  try {
    response = await axios.post(Url, requestPayload, {  
        headers: {
            'Content-Type': 'application/json',        
        }
    });
  } catch (error) {
    throw new Error('Failed to run the rule');
  }

  console.log('API response status:', response.status);
  console.log('API response data:', response.data);
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});

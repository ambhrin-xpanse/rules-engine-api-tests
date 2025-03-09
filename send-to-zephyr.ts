import * as fs from 'fs';
import axios, { AxiosError } from 'axios';
import { parseStringPromise } from 'xml2js';

async function sendResultsToZephyr() {
  // Zephyr API configuration
  const jiraUrl = 'https://xpanseinc.atlassian.net'; // Replace with your Jira URL
  const apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL3hwYW5zZWluYy5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI3MTIwMjA6MDUwMWNjYmQtYzVjMi00ZWMyLTkzOTItZDQ5OWNkZGE2MTQwIiwidG9rZW5JZCI6ImQyYTlhNjUyLTFkMjYtNDI5Ny1iMGVjLWE0ZTBmNTc0ZGRhMSJ9fSwiaXNzIjoiY29tLmthbm9haC50ZXN0LW1hbmFnZXIiLCJzdWIiOiI0ZjYzN2FjZS1iMjkzLTMyZmYtYmEwNC1jN2I3Nzk3NTIzOGQiLCJleHAiOjE3NzI4MzMzODUsImlhdCI6MTc0MTI5NzM4NX0.vekvZFzW7-QfZLq9XZFStxmoY2Fbr0SzNZUexpXvQbM'; // Replace with your Zephyr API token
  const projectKey = 'COPS'; // Replace with your Jira project key
  const testCycleName = `Automated Run - ${new Date().toISOString()}`;

  // Read JUnit XML report
  const xmlData = fs.readFileSync('./test-results/junit-report.xml', 'utf-8');
  const result = await parseStringPromise(xmlData);
  const testSuites = result.testsuites.testsuite;

  // Prepare test execution items
  const executionItems = testSuites.flatMap((suite: any) =>
    suite.testcase.map((testCase: any) => {
      const testCaseKey = testCase.$.name.match(/\[([^\]]+)\]/)?.[1]; // Extract key like PROJ-T1
      const status = testCase.failure ? 'FAIL' : 'PASS';
      return {
        testCaseKey,
        status,
        comment: testCase.failure ? testCase.failure[0].$.message : 'Test passed',
      };
    })
  );

  // Zephyr Scale API endpoint for creating a test run and adding executions
  const url = `${jiraUrl}/rest/atm/1.0/testrun`;
  const payload = {
    name: testCycleName,
    projectKey,
    items: executionItems,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Test cycle created: ${response.data.key}`);
    console.log(`View results at: ${jiraUrl}/secure/Tests.jspa#/testPlayer/${response.data.key}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error sending results to Zephyr:', error.response?.data || error.message);
  }
}

// Run the script
sendResultsToZephyr();

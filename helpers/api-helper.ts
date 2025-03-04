import axios, { AxiosResponse } from 'axios';

/**
 * Helper class for making API requests using axios.
 * 
 * @remarks
 * This class provides methods for making GET and POST requests with an authorization token.
 * 
 */
export class ApiHelper {


  /**
   * Sends a GET request to the specified URL with an authorization header.
   *
   * @template T - The expected response data type.
   * @param {string} url - The URL to send the GET request to.
   * @returns {Promise<AxiosResponse<T>>} - A promise that resolves to the response of the GET request.
   * @throws {Error} - Throws an error if the GET request fails.
   */
  public async get<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.get<T>(url, {});
      return response;
    } catch (error) {
      console.error(`Error with GET request to ${url}:`, error);
      throw new Error(`Failed to perform GET request to ${url}`);
    }
  }

  /**
   * Sends a POST request to the specified URL with the given payload.
   *
   * @template T - The expected response type.
   * @param {string} url - The URL to send the POST request to.
   * @param {unknown} payload - The payload to include in the POST request.
   * @returns {Promise<AxiosResponse<T>>} - A promise that resolves to the response of the POST request.
   * @throws {Error} - Throws an error if the POST request fails.
   */
  public async post<T>(url: string, payload: unknown): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.post<T>(url, payload, {});
      return response;
    } catch (error) {
      console.error(`Error with POST request to ${url}:`, error);
      throw new Error(`Failed to perform POST request to ${url}`);
    }
  }
}

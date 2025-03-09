import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { Readable } from "stream";

config(); // Load environment variables



const REGION = process.env.AWS_REGION!;
const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
// Construct the regional endpoint dynamically
const ENDPOINT = `https://s3.${REGION}.amazonaws.com`;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: ENDPOINT, // Explicitly set the correct S3 endpoint
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
/**
 * Get list of JSON files from S3 bucket.
 */
export async function listJsonFiles(): Promise<string[]> {
  const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
  console.log("access id" + process.env.AWS_ACCESS_KEY_ID);
  const response = await s3Client.send(command);
  return response.Contents?.map(obj => obj.Key!).filter(key => key.endsWith(".json")) || [];
}

/**
 * Read JSON file content from S3.
 */
export async function getJsonFileContent(fileName: string): Promise<any> {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName });
  const response = await s3Client.send(command);

  if (response.Body) {
    const stream = response.Body as Readable;
    const data = await streamToString(stream);
    return JSON.parse(data);
  }

  throw new Error(`Failed to read file: ${fileName}`);
}

/**
 * Convert Readable stream to string.
 */
function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
}

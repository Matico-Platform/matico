// Create service client module using ES6 syntax.
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const TIMEOUT: number = process.env.SIGNED_URL_EXPIRES_IN
  ? parseInt(process.env.SIGNED_URL_EXPIRES_IN)
  : 3600;

export const bucketParamsForUserUpload = (userId: string, filename: string) => {
  return {
    Bucket: process.env.DATA_BUCKET,
    Key: `${process.env.DATA_BUCKET_PREFIX}/${userId}/${filename}.arrow`,
    ContentType: "application/vnd.apache.arrow.file",
  };
};
// Create an Amazon S3 service client object.

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

export const getPresignedUploadUrl = async (
  userId: string,
  filename: string
) => {
  const params = bucketParamsForUserUpload(userId, filename);
  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: TIMEOUT,
  });
  return signedUrl;
};

export const deleteDataset = async (userId: string, datasetId: string) => {
  const command = new DeleteObjectCommand(
    bucketParamsForUserUpload(userId, datasetId)
  );
  let deleteResult = await s3Client.send(command);
};

export const getPresignedGetUrl = async (userId: string, filename: string) => {
  const command = new GetObjectCommand(
    bucketParamsForUserUpload(userId, filename)
  );
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: TIMEOUT,
  });
  return signedUrl;
};

export { s3Client };

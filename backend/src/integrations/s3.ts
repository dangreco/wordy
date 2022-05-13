import aws from 'aws-sdk';

aws.config.region = 'us-east-2';

const s3 = new aws.S3();

export const Bucket = process.env.S3_BUCKET_NAME!;

export default s3;
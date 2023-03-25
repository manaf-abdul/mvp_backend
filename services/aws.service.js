import AWS from 'aws-sdk'
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
export const gets3signedUrl = async (key) => {
    try {
        const s3 = new AWS.S3({ region: REGION });
        const url = await s3.getSignedUrl('getObject', {
            Bucket: S3_BUCKET,
            Key: key,
            Expires: signedUrlExpireSeconds,
          });
        return url
    } catch (error) {
        return false
    }

}
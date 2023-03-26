import AWS from 'aws-sdk'
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
export const gets3signedUrl = async (key) => {
    try {
        AWS.config.update({
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_KEY,
            region: AWS_REGION,
        })
        const s3 = new AWS.S3({signatureVersion: "v4"})

        const params = {
            Bucket: S3_BUCKET,
            Key: `${key}`,
            Expires: 43200,
        }
        return s3.getSignedUrlPromise("putObject", params)
    } catch (error) {
        return false
    }

}
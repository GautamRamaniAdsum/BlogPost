const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY || '';
const SECRET_KEY = process.env.AWS_SECRET_KEY || '';

const s3bucket = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
});

function uploadToS3(file, folderName, isLocalFile) {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);

    let bodyData = file.buffer;

    if (isLocalFile) {
        bodyData = fs.readFileSync(file.path);
    }

    const params = {
        Bucket: BUCKET_NAME,
        Key: "BlogPost/" + folderName + "/" + fileName,
        Body: bodyData,
        acl: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, function (err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

module.exports = { uploadToS3 };
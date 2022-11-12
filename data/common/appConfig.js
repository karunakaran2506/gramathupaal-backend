const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWSSECRETACCESSKEY,
  accessKeyId: process.env.AWSACCESSKEYID,
  region: process.env.AWSREGION,
});

const s3 = new aws.S3();

const appConfig = {
  s3,
};

module.exports = appConfig;

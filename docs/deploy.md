---
id: deploy
title: Deploy
sidebar_label: Deploy
---

In this guide, we'll deploy a Locust job along with all associated resources to a cloud provider. Locust is cloud provider agnostic however deployment is specific to each provider.

## Common

With any cloud provider, there will be at minimum two common integration points:
1. Call to the [`execute`](/docs/api#function-executejobdefinition) function once in the cloud function to start the job
2. Call to the cloud provider specific mechanism to invoke the cloud function in the [start hook](http://localhost:3001/docs/api#function-start)

Optionally, depending on the use case, there may be integration with a persistence layer in the [after hook](http://localhost:3001/docs/api#function-after)

## Prequisites & Setup

* [terraform](https://www.terraform.io/downloads.html) installed
* Cloud provider account and associated access setup

## Amazon Web Services

Deploy a Locust job to AWS Lambda configure related resources such as AWS ElasticCache and AWS Fargate

### Create a handler

In order to make Locust callable on AWS Lambda, a handler function that will recieve the request and start a single job:
```js
// handler.js
const { execute } = require('locust');
const job = require('./job');

module.exports.start = () => execute(job);
```

The [`start` hook](http://localhost:3001/docs/api#function-start) in the job will also need to invoke a new lambda function:

```js
// job.js
...
start: () => lambda.invoke({
  FunctionName: 'locust-example-lambda-invokation',
  InvocationType: 'Event',
}).promise(),
...
```

<details>
<summary>Example job with AWS Lambda invokation</summary>
```js
// job.js
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

module.exports job = {
  extract: async ($, browser) => ({
    'title': await $('title'),
  }),
  start: () => lambda.invoke({
      FunctionName: 'locust-example-lambda-invokation',
      InvocationType: 'Event',
    }).promise(),
  after: (jobResult, snapshot, stop) => {

    console.log(jobResult.data)

  },
  url: 'http://localhost:3000',
  config: {
    name: 'example-job',
    concurrencyLimit: 3,
    depthLimit: 2,
    delay: 3000,
  },
  connection: {
    redis: {
      port: 6379,
      host: process.env.REDIS_HOST
    },
    chrome: {
      browserWSEndpoint: `ws://${process.env.CHROME_HOST}:3000`,
    },
  }
};
```
</details>

#### Bundle

Bundle the source along with any dependencies:
```sh
zip -r ../src.zip ./
```

### Define resources

With source bundled, the next step is to create the Lambda and any other infrastructure resources. In order to accelerate this process, a terraform module, [locust-aws-terraform](https://github.com/achannarasappa/locust-aws-terraform), was created that will setup the resources needed by Locust and should be suitable for most use cases.

Add a reference to the module in your `main.tf` or equivalent terraform file:
```hcl
# main.tf
module "locust" {
  source             = "github.com/achannarasappa/locust-aws-terraform"
  private_subnet_ids = <private_subnets> # replace
  public_subnet_ids  = <public_subnets> # replace
  vpc_id             = <vpc_id> # replace
}
```

Add a lambda function that references the above bundle:
```hcl
resource "aws_lambda_function" "locust_job" {
  filename         = "src.js"
  source_code_hash = filebase64sha256("src.js")

  handler = "handler.start"
  runtime = "nodejs10.x"
  ...
}
```

The Lambda will also need access to other AWS resources. These are encapsulated in the role exposed by `locust-aws-terraform`:
```hcl
resource "aws_lambda_function" "locust_job" {
  ...
  role = "${module.locust.iam_role_arn}"
  ...
}
```

Finally, the hostnames for both the Chrome and Redis instances will need to be passed to the Lambda as environment variables:
```hcl
resource "aws_lambda_function" "locust_job" {
  ...
  environment {
      variables = {
        CHROME_HOST = "${module.locust.chrome_hostname}"
        REDIS_HOST  = "${module.locust.redis_hostname}"
      }
    }
  ...
}
```

A full example of the `main.tf` file can be found in the [single-lambda example](https://github.com/achannarasappa/locust-aws-terraform/tree/master/examples/single-lambda)

### Provision

Push the changes to AWS:
```sh
terraform init
terraform plan
terraform apply
```

### Reference
- [locust](https://github.com/achannarasappa/locust)
- [locust-aws-terraform](https://github.com/achannarasappa/locust-aws-terraform)
  - [AWS single job complete example](https://github.com/achannarasappa/locust-aws-terraform/tree/master/examples/single-lambda)
- [AWS JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
  - [AWS Lambda Invoke API reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property)
- [AWS Lambda function handler guide](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)
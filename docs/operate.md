---
id: operate
title: Operate
sidebar_label: Operate
---

<!--
* initiating
* logging
* monitoring
* aborting
-->

Work in progress guide

## Common

Common operational tooling is a work in progress however proprietary cloud provider solutions can be used to achieve similar results.

### Logging

Log level can be specified in the [`jobDefinition.config.logLevel`](https://locust.dev/docs/api#object-jobdefinition). Logging is disabled when the log level property is omitted.

Log output is JSON formatted:
```sh
{"message":"Started executing job","level":"info","source":"locust","timestamp":"2020-06-04T15:33:26.469Z"}
{"message":"Aborting job since temporary limit was met","level":"info","source":"locust","timestamp":"2020-06-04T15:33:28.342Z"}
``` 

At `info` level, only start, end, and errors are logged. At `debug` detailed output of each action Locust takes is logged.

## Amazon Web Services
### Initiate

Using the [AWS CLI](https://aws.amazon.com/cli/), invoke the function:
```sh
aws lambda invoke \
--invocation-type Event \
--function-name locust-example-job \
--region us-east-1  \
--profile default \
out.txt
```

### Logging

Check CloudWatch for any console output or stream logs to the terminal with [awslogs](https://github.com/jorgebastida/awslogs)

### Debugging

#### Debug Redis

It's possible to view the internal activity of the queue in Redis through the `MONITOR` command. This can be useful when trying to understand what is happening but shouldn't be used in place of logging.

##### Connect to Redis

It's not possible to directly connect to an ElasticCache instance so a jumpbox will be needed with the Redis CLI installed.

<details>
<summary>Example terraform block for a jumpbox</summary>
```hcl
resource "aws_instance" "jump" {
  ami           = "ami-04b9e92b5572fa0d1"
  instance_type = "t2.micro"

  vpc_security_group_ids      = ["${module.locust.security_group_id}", "${aws_security_group.ssh_access.id}"]
  subnet_id                   = <public_subnet_id> # replace with a public subnet
  associate_public_ip_address = true
  key_name                    = <key_name> # replace with a key in AWS

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa") # replace with the location of the above key
      host        = "${aws_instance.jump.public_ip}"
    }
    inline = [
      "sudo apt-get update && sudo apt-get install redis-server -y",
    ]
  }
}

output "instance_ip_addr" {
  value       = aws_instance.jump.public_ip
  description = "The public IP address of the main server instance."
}
```
</details>

Add this to your terraform file to output the redis hostname:
```hcl
output "redis_hostname" {
  value       = locust_aws_terraform.redis_hostname
}
```

##### Watch Redis commands from Locust

`redis-cli -c -h <insert_redis_hostname> -p 6379 MONITOR`

##### Clear Redis state

`redis-cli -c -h <insert_redis_hostname> -p 6379 KEYS "sc:*" | xargs redis-cli -c -h <insert_redis_hostname> -p 6379 DEL`

### Platform Caveats

* AWS Lambda functions will [retry on error](https://docs.aws.amazon.com/lambda/latest/dg/retries-on-errors.html) by default
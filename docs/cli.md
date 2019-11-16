---
id: cli
title: CLI
sidebar_label: CLI
---

Locust CLI is a collection of command line tools intended to accelerate development and testing of Locust jobs

## Setup

```sh
npm install @achannarasappa/locust-cli
```

## Usage

### `locust`
```sh
locust <command>

Commands:
  locust run       run in single job mode
  locust start     starts a job and crawls until a stop condition is met
  locust stop      Stop running jobs and stop redis and browserless containers
  locust generate  generate a job definition through a series of prompts
  locust validate  validate a job definition
  locust info      information on queue state and jobs in each status

Options:
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

### `locust run`
```sh
locust run <path_to_file>

Options:
  -v, --version         Show version number                            [boolean]
  -h, --help            Show help                                      [boolean]
  -t, --includeHtml     include html in the response            [default: false]
  -l, --includeLinks    include links in the response           [default: false]
  -c, --includeCookies  include cookies in the response         [default: false]

Examples:
  locust run job.js           Runs a single job and returns the results
  locust run job.js -l -t -c  Include all response fields
```

### `locust start`
```sh
locust start <path_to_file>

Options:
  -v, --version    Show version number                                 [boolean]
  -h, --help       Show help                                           [boolean]
  -b, --bootstrap  Start redis and browserless Docker containers if not already
                   available                                    [default: false]
  -r, --reset      Reset queue state before starting            [default: false]

Examples:
  locust start job.js     Starts a job
  locust start -b job.js  Starts redis and browserless containers if they are
                          not already running
```

## Concepts

### Operating Modes

While running Locust through the CLI for development or testing purposes, some behaviors are altered to suit the CLI context and development/test use cases. There are two possible operating modes described below.

#### Standard Mode

In standard mode, Locust will instrument the job definition to enable reporting to the CLI dashboard and override the job defintion's `start` user defined hook. When starting a job through the CLI in standard mode, an instance of Redis and Chrome must also be running and open for connection as defined in the job definition. Locust will use Redis for queue management and Chrome for http request as it normally would outside of the CLI.

#### Limited Mode

In limited mode, Locust will run the job definition against only the entrypoint url and does not require a connection to Redis or a pre-existing Chrome instance.
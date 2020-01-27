---
id: concepts
title: Concepts
sidebar_label: Concepts
---

## Stop Condition

A stop condition is a criteria that when met, will send a stop signal (setting the queue status to Inactive) which will stop an further jobs from being started however running jobs will continue to completion. There are three supported stop conditions:

1. Depth limit - when a link is encountered that has a depth from the entrypoint url that exceeds the [config.depthLimit](https://locust.dev/docs/api#object-jobdefinition) value, a stop signal is sent.
1. Empty queue - when there are no more jobs queued, a stop signal is sent.
1. User defined - a callback function in the [after hook](https://locust.dev/docs/api#function-after) that when called sends a stop signal
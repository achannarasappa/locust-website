---
id: api
title: API
sidebar_label: API
---

## function: `execute(jobDefinition)`

`locust.execute(jobDefinition)`

* [`jobDefinition`](#object-jobdefinition) `<Object>`

returns: `<Promise<Object>>` See [jobResult](#object-jobresult)

```js
// example.js
const { execute } = require('locust');
const execSync = require('child_process');
const job = {
  start: () => execSync('./example.js'),
  url: 'http://localhost:3001',
  config: {
    name: 'collect-data',
    depthLimit: 1,
  },
  connection: {
    redis: {
      port: 6379,
      host: 'localhost'
    },
    chrome: {
      port: 3000,
      host: 'localhost'
    },
  }
};

(() => execute(job))()
```

Starts a Locust job. On first run, the job runs against the entrypoint url and on subsequent runs, the first queued job is run.

## object: `jobDefinition`

* `jobDefinition` `<Object>`
  * `url` `<string>` the entrypoint url for the job
  * [`beforeAll`](#function-beforeall) `<Function>` [optional]
  * [`before`](#function-before) `<Function>` [optional]
  * [`after`](#function-after) `<Function>` [optional]
  * [`start`](#function-start) `<Function>`
  * [`extract`](#function-extract) `<Function>` [optional]
  * `config` `<Object>` Defines settings that determine global behavior of Locust
    * `name` `<string>` a unique name to identify the job
    * `concurrencyLimit` `<Number>` the maximum number of concurrent jobs
    * `depthLimit` `<Number>` the maximum link depth from the entrypoint url - when met, the Locust will stop processing additional jobs accross all instances of this job
    * `delay` `<Number>` wait time in milliseconds before starting a job after popping it from the queue
  * `filter` `<Function|Object>` [optional] filter links by a [hostname](api#object-filter) or [function](api#function-filter)
  * `connection` `<Object>`
    * [`redis`](https://github.com/luin/ioredis/blob/master/API.md#new_Redis_new) `<Object>` configuration for [ioredis](https://github.com/luin/ioredis) to connect to Redis
      * `host` `<string>`
      * `port` `<string>`
    * [`chrome`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions) `<Object>` configuration for [Puppeteer](https://github.com/GoogleChrome/puppeteer) to connect to Chrome
      * `browserWSEndpoint` `<string>` web socket address of a Chrome instance e.g. `ws://localhost:3000`

Configuration object that defines how to connect to Chrome and Redis and how the system behaves.

### object: `jobResult`

* `jobResult` `<Object>`
  * `cookies` `<Object>`
  * `data` `<?Object>` Return value of the [`jobDefinition.extract`](#function-extract) function if one was defined
  * `links` `<Array>`
  * `response` `<Object>`

Object containing the result of the job including the raw response, extracted links, cookies, and extracted data.

### object: `jobData`

* `jobData` `<Object>`
  * `url` `<string>` address for the job
  * `depth` `<Number>` page distance of the job from the entrypoint url in the `jobDefinition`

Minimal job representation used primarily within the Redis queue

### object: `snapshot`

* `snapshot` `<Object>`
  * `state` `<'ACTIVE'|'INACTIVE'>` current state of Redis queue
  * `queue` `<Object>` each value contains an array of urls 
    * `processing` `<Array<string>>` 
    * `done` `<Array<string>>`
    * `queued` `<Array<string>>`

A snapshot of the Redis queue at a given point in time

### object: `response`

* `response` `<Object>`
  * [`ok`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-responseok) `<Boolean>`
  * [`status`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-responsestatus) `<Number>` HTTP response code 
  * [`statusText`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-responsestatustext) `<string>` HTTP response message
  * [`headers`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-responseheaders) `<Object>`
  * `url` `<string>` url after following redirects or any page navigation
  * `body` `<string>` html content of the page

Response from the HTTP request after navigating to the url in `jobData` or `url` in the `jobDefinition`

### function: `beforeAll`

* `jobDefinition.beforeAll(browser, snapshot, jobData)`
  * `browser` [`<Puppeteer.Browser>`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-class-browser) Puppeteer browser instance
  * [`snapshot`](#object-snapshot) `<Object>` A snapshot of the Redis queue at the time the job was poped from the Redis queue
  * [`jobData`](#object-jobdata) `<Object>` Current job's data

User defined hook to run once before the first job is processed

### function: `before`

* `jobDefinition.before(page, snapshot, jobData)`
  * `page` [`<Puppeteer.Page>`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-class-page) Puppeteer page instance
  * [`snapshot`](#object-snapshot) `<Object>` A snapshot of the Redis queue at the time the job was poped from the Redis queue
  * [`jobData`](#object-jobdata) `<Object>` Current job's data

User defined hook to run before every job is processed

### function: `after`

* `jobDefinition.after(jobResult, snapshot, stopQueue)`
  * [`jobResult`](#object-jobresult) `<Object>`
  * [`snapshot`](#object-snapshot) `<Object>` A snapshot of the Redis queue after the new links for the current job were added to the queue
  * [`jobData`](#object-jobdata) `<Object>` Current job's data

User defined hook to run after every job is processed

### function: `start`

* `jobDefinition.start()`

User defined hook to define how to invoke a new instance of Locust within the parent context (e.g. AWS Lambda, system process)

### function: `extract`

* `jobDefinition.extract($, browser, jobData)`
  * `$(selector)` `<Function>` convenience function to get the text of an element on the page 
    * [`selector`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) `<string>` CSS selector e.g. `ul li .description`
    * returns: `<Promise<string>>` the [text content](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) of the first element at the selector
    * throws [`BrowserError`](#class-browsererror): when there is no element found at the selector
  * `browser` [`<Puppeteer.Browser>`](https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-class-browser) Puppeteer browser instance
  * [`jobData`](#object-jobdata) `<Object>` Current job's data

User defined hook to extract data from the page

### function: `filter`

* `jobDefinition.filter(links)`
  * `links` `<Array<string>>` Array of links extracted from the [`href`](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Attribute/href) attributes of [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) elements on the page

Filter which links are added to the queue from the page

### object: `filter`

* `filter` `<Object>`
  * `allowList` `<Array<string>>` list of hostnames to allow
  * `blockList` `<Array<string>>` list of hostnames to block

Filters which links are added to the queue from the page based on the hostname. Both lists can be used in conjunction.


## class: `BrowserError`

* `locust.error.BrowserError(response)`
  * `message` `<string>`
  * `url` `<string>`
  * [`response`](#object-response) `<Object>`

Thrown when Chrome encounters an error 

## class: `GeneralJobError`

* `locust.error.GeneralJobError(message, url)`
  * `message` `<string>`
  * `url` `<string>`

  Thrown when Locust encounters an error that causes it to abort

## class: `QueueEndError`

* `locust.error.QueueEndError(message, url)`
  * `message` `<string>`
  * `url` `<string>`

  Returned when a global queue end condition is met e.g. no more queued jobs remaining or depth limit has been met

## class: `QueueError`

* `locust.error.QueueError(message, url)`
  * `message` `<string>`
  * `url` `<string>`

  Returned when a transient condition its met where another job can not be started e.g. concurrency limit has been met
const React = require('react');
const { Container, Row, Col, Button } = require('reactstrap');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock;

class Index extends React.Component {
  render() {
    return (
      <div>
        <div className="hero-container">
          <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Viga&display=swap" rel="stylesheet" />
          <script src="https://kit.fontawesome.com/112ad9ad9e.js"></script>
          <Container>
            <Row>
              <Col>
                <h1 className="header-hero">Locust</h1>
                <div className="subheader-hero">Distributed web data discovery and collection framework</div>
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 4, offset: 4 }}>
                <MarkdownBlock>
                  {
                    [
                      '```sh',
                      'npm install @achannarasappa/locust',
                      '```',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="summary-container">
          <Container>
            <Row>
              <Col lg="8">
                <div className="section-header">
                  Features
            </div>
                <hr />
              </Col >
              <Col>
                <div className="section-header">
                  Use Cases
            </div>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col >
                <MarkdownBlock>
                  {
                    [
                      '* Configuration driven jobs',
                      '* Distributed execution model',
                      '* Handle client-side JavaScript execution',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
              <Col >
                <MarkdownBlock>
                  {
                    [
                      '* Data extraction using CSS selectors',
                      '* Depth-based stop condition along with support for custom stop condtions',
                      '* Robust dev tooling to build and test jobs',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
              <Col >
                <MarkdownBlock>
                  {
                    [
                      '* Web indexing (i.e. web crawling)',
                      '* Web data extraction (i.e. web scraping)',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="featured-container featured-container-dark">
          <Container>
            <Row>
              <Col className="featured-column" lg="4">
                <div className="featured-box">
                  <div className="featured-title">
                    Configuration Driven
                  </div>
                  <hr />
                  <div className="featured-description">
                    <MarkdownBlock className="featured-text">
                      Define _what_ data and _where_ to find it rather than _how_
                    </MarkdownBlock>
                    <div className="featured-reference">
                      <a href="/docs/api#object-jobdefinition">Job Reference</a> • <a href="#">Scraping Guide</a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="8">
                <MarkdownBlock>
                  {
                    [
                      '```',
                      `module.exports = job = {`,
                      `  extract: async ($) => ({`,
                      `    'title': await $('title'),`,
                      `  }),`,
                      `  url: 'http://ecommerce-site.com',`,
                      `};`,
                      '```',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="featured-container featured-container-light">
          <Container>
            <Row>
              <Col lg="8">
                <MarkdownBlock>
                  {
                    [
                      '```js',
                      `module.exports = job = {`,
                      `  ...`,
                      `  // AWS Lambda`,
                      `  start: () => (new require('aws-sdk').Lambda()).invoke({ `,
                      `    FunctionName: "locust-job",`,
                      `    InvocationType: "Event", `,
                      `   }),`,
                      `  // Google Cloud Functions`,
                      `  start: () => require('child_process').execSync('gcloud functions call locust-job'),`,
                      `  // Linux/Windows Process`,
                      `  start: () => require('child_process').execSync('node -e "(async () => require("./job").start(job))()"'),`,
                      `  // NodeJS`,
                      `  start: () => require('locust').execute(job),`,
                      `  ...`,
                      `};`,
                      '```',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
              <Col className="featured-column" lg="4">
                <div className="featured-box">
                  <div className="featured-title">
                    Built for Serverless
                  </div>
                  <hr />
                  <div className="featured-description">
                    <div className="featured-text">
                      Jobs run independently in separate threads, processes, or cloud functions with Redis as a centralized queue.
                      Just define how to start a new job.
                  </div>
                    <div className="featured-reference">
                      <a href="/docs/architecture">Architecture Reference</a> • <a href="#">Deployment Guide</a>
                    </div>
                    <div className="featured-reference">
                      <a href="/docs/lifecycle">Lifecycle Reference</a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="featured-container featured-container-dark">
          <Container>
            <Row>
              <Col className="featured-column" lg="4">
                <div className="featured-box">
                  <div className="featured-title">
                    Client-side Javascript Execution
                  </div>
                  <hr />
                  <div className="featured-description">
                    <div className="featured-text">
                      Handle crawling or scraping single-page applications (SPAs) including those based in AngularJs, React, and Vue.js
                  </div>
                    <div className="featured-reference">
                      <a href="/docs/lifecycle">Lifecycle Reference</a> • <a href="#">SPA Example</a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="8">
                <MarkdownBlock>
                  {
                    [
                      '```',
                      `module.exports = job = {`,
                      `  extract: async ($, page) => {`,
                      `    await page.waitFor('.profile');`,
                      `    return {`,
                      `      firstName: await $('.profile > .first_name'),`,
                      `      lastName: await $('.profile > .last_name'),`,
                      `    }`,
                      `  },`,
                      `};`,
                      '```',
                    ].join('\n')
                  }
                </MarkdownBlock>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="featured-container featured-container-light">
          <Container>
            <Row>
              <Col lg="8">
                <img src="/img/devtools-feature.gif" />
              </Col>
              <Col className="featured-column" lg="4">
                <div className="featured-box">
                  <div className="featured-title">
                    Powerful Devtools
                  </div>
                  <hr />
                  <div className="featured-description">
                    <div className="featured-text">
                      Comprehensive set of command line tools to accelerate development of locust jobs
                  </div>
                    <MarkdownBlock>
                      {
                        [
                          '* Generator',
                          '* Runner',
                          '* Validator',
                        ].join('\n')
                      }
                    </MarkdownBlock>
                    <div className="featured-reference">
                      <a href="/docs/cli">CLI Reference</a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

module.exports = Index;

# locust-website

## Usage

```
cd website && npm i && npm start
```

## Publishing

Build:
```
cd website && npm run build
```

Publish:
```
GIT_USER=USERNAME CURRENT_BRANCH=master USE_SSH=true npm run publish-gh-pages
```
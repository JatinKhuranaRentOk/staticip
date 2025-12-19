# HTTP Proxy Server

A Node.js Express server that acts as an HTTP proxy, allowing you to make HTTP requests through the server.

## Project Structure

```
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Local Development

1. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. The server will be available at:
   ```
   http://localhost:3000
   ```

## Endpoints

- **GET /** - Health check endpoint
- **POST /proxy** - HTTP proxy endpoint

## Usage

Send a POST request to `/proxy` with the following JSON structure:

```json
{
  "url": "https://api.example.com/endpoint",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-token"
  },
  "body": {
    "key": "value"
  }
}
```

Example using curl:
```bash
curl -X POST http://localhost:3000/proxy \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "GET"
  }'
```

## Deployment to Azure via GitHub

### Option 1: Azure App Service with GitHub Actions

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Create Azure App Service**:
   - Go to Azure Portal
   - Create a new App Service
   - Choose Node.js as runtime stack
   - Connect to your GitHub repository
   - Enable continuous deployment

3. **Azure will automatically**:
   - Detect it's a Node.js app
   - Run `npm install`
   - Start the app with `npm start`

### Option 2: Azure Container Instances

1. Create a `Dockerfile` (optional, Azure can auto-detect Node.js)
2. Push to GitHub
3. Use Azure Container Instances with GitHub integration

### Environment Variables

Set these in Azure App Service Configuration:
- `PORT` - Will be automatically set by Azure
- Any other environment variables your app needs

## CORS

The server includes CORS middleware to allow cross-origin requests from any domain. Modify the CORS configuration in `server.js` if you need specific domain restrictions.

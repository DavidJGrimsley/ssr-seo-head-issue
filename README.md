# SSR + Data Loader Bug Reproduction

## Issue
`useLoaderData()` does not resolve during SSR for routes nested in folders, causing:
- Empty `<title>` in SSR HTML
- Loading fallback rendered instead of content
- Suspense boundary never resolves on server

## Expected Behavior
When visiting `/mcp/mrdj-fne-mcp`:
- SSR HTML should contain `<title>mrdj-fne-mcp | MCP Server</title>`
- Page content should be rendered (not loading fallback)
- Loader data should be embedded in `__EXPO_ROUTER_LOADER_DATA__`

## Actual Behavior

### Issue 1: SSR Fails for Nested Routes
- SSR HTML contains empty `<title></title>`
- Loading fallback "Loading MCP details..." is rendered
- Loader data IS embedded correctly, but `useLoaderData()` doesn't return it during SSR

### Issue 2: Client-Side Navigation Fails
When navigating from `/mcp` (index) to `/mcp/mrdj-app-mcp`:
- Error: "Failed to load loader data for route: /mrdj-app-mcp"
- Notice the path is `/mrdj-app-mcp` NOT `/mcp/mrdj-app-mcp`
- The loader URL is being constructed incorrectly (missing parent folder)

## Steps to Reproduce

### Reproduction 1: SSR Issue
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npx expo start --port 8081
   ```

3. Open web browser and visit:
   - http://localhost:8081/mcp/mrdj-app-mcp

4. View page source (Ctrl+U) and check:
   - Search for `<title>` - it's empty
   - Search for "Loading MCP" - the fallback is being rendered
   - Search for `__EXPO_ROUTER_LOADER_DATA__` - the correct data IS embedded

### Reproduction 2: Client-Side Navigation Issue
1. Visit http://localhost:8081/mcp (the index page)
2. Click on any server link (e.g., "mrdj-app-mcp")
3. Observe error: "Failed to load loader data for route: /mrdj-app-mcp"
4. Note that the error path is `/mrdj-app-mcp` not `/mcp/mrdj-app-mcp`

## Configuration

`app.json` has SSR enabled:
```json
{
  "web": {
    "output": "server"
  },
  "plugins": [
    ["expo-router", {
      "unstable_useServerRendering": true,
      "unstable_useServerDataLoaders": true
    }]
  ]
}
```

## Route Structure
```
app/
  _layout.tsx        # Root Stack
  index.tsx          # Home page
  mcp/
    _layout.tsx      # MCP Stack
    index.tsx        # MCP list
    [id].tsx         # MCP detail (HAS LOADER)
  api/
    portfolio/
      [id]+api.ts    # API route for data
```

## Environment
- Expo SDK: 55 canary
- expo-router with SSR enabled
- Node.js v22+

## Notes
- The loader data IS correctly embedded in the HTML
- The issue is that `useLoaderData()` causes Suspense to suspend during SSR
- This only happens for nested routes (routes in folders)
- Root-level dynamic routes work fine with SSR
- Client-side navigation also fails because the loader URL is constructed without the parent folder path

## Verified Working
- Loader endpoint works: `/_expo/loaders/mcp/mrdj-app-mcp` returns correct data
- API endpoint works: `/api/portfolio/mrdj-app-mcp` returns correct data
- Direct browser navigation to `/mcp/mrdj-app-mcp` renders (hydrates client-side)
- The issue is specifically with SSR render and client-side navigation loader resolution

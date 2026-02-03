/**
 * Types for the minimal SSR reproduction
 */

export interface RegistryServer {
  id: string;
  type: 'api' | 'mcp';
  portfolioUrl: string;
}

export interface RegistryResponse {
  servers: RegistryServer[];
}

export interface APIServer {
  id: string;
  name: string;
  version: string;
  icon?: string;
  description: string;
  baseUrl?: string;
  docsUrl?: string;
  status?: string;
  featured?: boolean;
  tags?: string[];
}

export interface MCPServer {
  id: string;
  name: string;
  version: string;
  icon?: string;
  description: string;
  mcpEndpointUrl?: string;
  githubRepoUrl?: string;
  status?: string;
  featured?: boolean;
  tags?: string[];
}

export interface Endpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
}

export interface APIPortfolio {
  api: APIServer;
  endpoints?: Endpoint[];
}

export interface MCPPortfolio {
  mcp?: MCPServer;
  server?: MCPServer;  // Alternative key used by some portfolios
  tools?: Array<{ name: string; description: string }>;
  resources?: Array<{ id: string; title: string; description: string }>;
  prompts?: Array<{ name: string; description: string }>;
}

export type Portfolio = APIPortfolio | MCPPortfolio;

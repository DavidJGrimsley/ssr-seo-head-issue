/**
 * API Route: /api/registry
 * Fetches the external registry of APIs and MCPs from davidjgrimsley.com WITHOUT CORS RESTRICTIONS
 */
import type { RegistryResponse } from '@/types/registry';

const REGISTRY_URL = 'https://davidjgrimsley.com/secret/registry.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get('type'); // 'api' | 'mcp' | null

    const response = await fetch(REGISTRY_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Registry fetch failed: ${response.status}`);
    }

    const registry: RegistryResponse = await response.json();
    const registryServers = Array.isArray(registry.servers) ? registry.servers : [];

    // Filter by type if requested
    const filteredServers = typeFilter
      ? registryServers.filter((s) => s.type === typeFilter)
      : registryServers;

    return Response.json(
      {
        success: true,
        data: {
          ...registry,
          servers: filteredServers,
        },
        fetchedAt: new Date().toISOString(),
        source: 'live',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[API /registry] Error fetching registry:', error);

   

    return Response.json(
      {
        success: false,
        data: {
          servers: [],
        },
        fetchedAt: new Date().toISOString(),
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { headers: corsHeaders }
    );
  }
}

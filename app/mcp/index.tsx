/**
 * MCP List Page - Minimal SSR loader example
 */
import { Link, useLoaderData, type ErrorBoundaryProps } from 'expo-router';
import Head from 'expo-router/head';
import { type LoaderFunction } from 'expo-router/server';
import { Suspense } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Server = {
  id: string;
  type: string;
  portfolioUrl: string;
};

type LoaderData = Server[];

function getRequestOrigin(request?: { url?: string }): string {
  if (!request?.url) return 'http://localhost:8081';
  try {
    return new URL(request.url).origin;
  } catch {
    return 'http://localhost:8081';
  }
}

export const loader: LoaderFunction<LoaderData> = async (request, _params) => {
  const origin = getRequestOrigin(request);
  const url = `${origin}/api/registry?type=mcp`;

  console.log('[LOADER] Fetching from:', url);
  
  const response = await fetch(url);
  console.log('[LOADER] Response status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  console.log('[LOADER] Data:', data);
  return data.data?.servers ?? [];
}

function MCPListContent() {
  const servers = useLoaderData<typeof loader>();
  const count = Array.isArray(servers) ? servers.length : 0;

  return (
    <>
      <Head>
        <title>{`${count} MCP Servers`}</title>
        <meta name="description" content={`List of ${count} MCP servers available.`} />
        <meta property="og:title" content={`${count} MCP Servers`} />
        <meta property="og:description" content={`List of ${count} MCP servers available.`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <View style={styles.container}>
        <Text style={styles.title}>MCP Servers ({count})</Text>
        <Text style={styles.subtitle}>Select a server to view details</Text>

        {servers.map((server) => (
          <Link key={server.id} href={`/mcp/${server.id}`}>
            <Pressable>
              <View style={styles.serverCard}>
                <Text style={styles.serverName}>{server.id}</Text>
                <Text style={styles.serverArrow}>→</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Failed to load MCP servers</Text>
      <Text style={styles.body}>{error.message}</Text>
      <Text style={styles.retry} onPress={retry}>Try again</Text>
    </View>
  );
}

export default function MCPListPage() {
  return (
    <Suspense fallback={<Text style={styles.loading}>Loading MCP servers...</Text>}>
      <MCPListContent />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  serverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serverArrow: {
    fontSize: 18,
    color: '#0066cc',
  },
  body: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  retry: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  loading: {
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
  note: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#e65100',
  },
  noteText: {
    fontSize: 14,
    color: '#bf360c',
    lineHeight: 20,
  },
});
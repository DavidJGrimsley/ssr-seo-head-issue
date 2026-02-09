/**
 * MCP List Page - Minimal SSR loader example
 */
import { Link, useLoaderData } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

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

export async function loader(request?: { url?: string }): Promise<LoaderData> {
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

export default function MCPListPage() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Workaround for Expo Router loader data key mismatch bug
  useEffect(() => {
    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }

    const store = (globalThis as unknown as { __EXPO_ROUTER_LOADER_DATA__?: Record<string, LoaderData> })
      .__EXPO_ROUTER_LOADER_DATA__;

    // If data already exists under /index, we're good
    if (store?.['/index']) {
      setReady(true);
      return;
    }

    // Find the data under the correct key and copy it
    const matchKey = store && Object.keys(store).find(
      (key) => key === '/mcp' || key === '/mcp/index' || key.includes('mcp')
    );

    if (store && matchKey) {
      console.log('[WORKAROUND] Copying loader data from', matchKey, 'to /index');
      store['/index'] = store[matchKey];
      setReady(true);
      return;
    }

    // Fallback: manually fetch
    console.log('[WORKAROUND] No loader data found, fetching manually');
    fetch('/api/registry?type=mcp')
      .then((res) => res.json())
      .then((data) => {
        const servers = data.data?.servers ?? [];
        const target = (globalThis as unknown as { __EXPO_ROUTER_LOADER_DATA__?: Record<string, LoaderData> })
          .__EXPO_ROUTER_LOADER_DATA__ ||= {};
        target['/index'] = servers;
        setReady(true);
      })
      .catch((err) => {
        setError(err.message);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.subtitle}>Loading MCP Servers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.subtitle}>{error}</Text>
      </View>
    );
  }

  return <MCPList />;
}

function MCPList() {
  const servers = useLoaderData<typeof loader>();
  const count = Array.isArray(servers) ? servers.length : 0;

  return (
    <>
      <Head>
        <title>{`${count} MCP Servers`}</title>
        <meta name="description" content={`List of ${count} MCP servers available.`} />
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
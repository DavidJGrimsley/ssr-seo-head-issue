import { useLoaderData, useLocalSearchParams, type ErrorBoundaryProps } from 'expo-router';
import Head from 'expo-router/head';
import { type LoaderFunction } from 'expo-router/server';
import { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MCPServer {
  id: string;
  name: string;
  description: string;
}

type PortfolioResponse = {
  success?: boolean;
  data?: {
    portfolio?: {
      mcp?: MCPServer;
      server?: MCPServer;
    };
    registryEntry?: {
      id?: string;
    };
  };
};

function getRequestOrigin(request?: { url?: string }): string {
  if (!request?.url) return 'http://localhost:8081';
  try {
    return new URL(request.url).origin;
  } catch {
    return 'http://localhost:8081';
  }
}

export const loader: LoaderFunction<MCPServer | null> = async (request, params) => {
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const origin = getRequestOrigin(request);

  if (!id) {
    return null;
  }

  try {
    const response = await fetch(`${origin}/api/portfolio/${id}`, {
      headers: {
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch MCP server: ${response.status}`);
      return null;
    }

    const payload: PortfolioResponse = await response.json();
    const portfolio = payload?.data?.portfolio;
    const mcp = portfolio?.mcp ?? portfolio?.server;

    if (!mcp) {
      console.error('Missing MCP payload for:', id);
      return null;
    }

    return {
      id: mcp.id ?? id,
      name: mcp.name ?? id,
      description: mcp.description ?? 'No description available.'
    };
  } catch (error) {
    console.error('Failed to fetch MCP server:', error);
    return null;
  }
}

function MCPDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useLoaderData<typeof loader>();
  const instructions = "Right click this page and click 'view page source', not 'inspect'. The raw HTML contains the meta tags for this MCP server.";

  const title = id ? `${id} - MCP Server` : 'MCP Server';

  if (!data) {
    console.log('MCP server not found for:', id);
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="This MCP server does not exist." />
        </Head>
        <View style={styles.container}>
          <Text style={styles.title}>MCP Server Not Found</Text>
          <Text style={styles.body}>This MCP server doesn&apos;t exist</Text>
          <Text style={styles.body}>{instructions}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <View style={styles.container}>
        <Text style={styles.title}>The purpose of this page is to demonstrate server-side rendering with dynamic routes.</Text>
        <Text style={styles.body}>{instructions}</Text>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.body}>{data.description}</Text>
      </View>
    </>
  )
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Failed to load MCP server</Text>
      <Text style={styles.body}>{error.message}</Text>
      <Text style={styles.retry} onPress={retry}>Try again</Text>
    </View>
  );
}

export default function MCPDetailPage() {
  return (
    <Suspense fallback={<Text style={styles.loading}>Loading MCP server...</Text>}>
      <MCPDetailContent />
    </Suspense>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { color: '#333' },
  retry: { color: '#0066cc', fontWeight: '600', marginTop: 8 },
  loading: { padding: 16, color: '#666' },
});
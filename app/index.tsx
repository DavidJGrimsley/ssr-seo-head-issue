/**
 * Home Page - Links to MCP list
 */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Head from 'expo-router/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>SSR Data Loader Test</title>
        <meta name="description" content="Testing SSR with data loaders in nested routes" />
      </Head>
      
      <View style={styles.container}>
        <Text style={styles.title}>SSR Data Loader Test</Text>
        <Text style={styles.description}>
          This tests whether useLoaderData() works correctly with SSR
          when routes are nested under a folder.
        </Text>

        <Link href="/mcp" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to MCP Servers →</Text>
          </Pressable>
        </Link>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Expected Behavior:</Text>
          <Text style={styles.infoText}>• /mcp/mrdj-fne-mcp should SSR with title "mrdj-fne-mcp | MCP Server"</Text>
          <Text style={styles.infoText}>• The loader data should be embedded in HTML</Text>
          <Text style={styles.infoText}>• Content should render (not loading fallback)</Text>
        </View>

        <View style={styles.bugBox}>
          <Text style={styles.bugTitle}>Actual Behavior (Bug):</Text>
          <Text style={styles.bugText}>• SSR shows empty &lt;title&gt;</Text>
          <Text style={styles.bugText}>• Loading fallback is rendered instead of content</Text>
          <Text style={styles.bugText}>• useLoaderData() doesn't resolve during SSR</Text>
        </View>
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
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2e7d32',
  },
  infoText: {
    fontSize: 14,
    color: '#1b5e20',
    marginBottom: 4,
  },
  bugBox: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
  },
  bugTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#c62828',
  },
  bugText: {
    fontSize: 14,
    color: '#b71c1c',
    marginBottom: 4,
  },
});

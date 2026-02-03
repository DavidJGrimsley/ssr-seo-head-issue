import { useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { Text } from 'react-native'

export async function loader() {
  const response = await fetch('/')
}

export default function MCPDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Head>
        <title>{id} - MCP Server</title>
        <meta name="description" content={`Details for MCP server: ${id}`} />
      </Head>
      <Text>MCP Detail Page for {id}</Text>
    </>
  )
}
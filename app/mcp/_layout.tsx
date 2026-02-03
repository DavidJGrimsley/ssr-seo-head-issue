/**
 * MCP Layout - Simple Stack
 */
import { Stack } from 'expo-router';

export default function MCPLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
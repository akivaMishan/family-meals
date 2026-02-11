import { Redirect } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/src/constants/colors';

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(parent)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}

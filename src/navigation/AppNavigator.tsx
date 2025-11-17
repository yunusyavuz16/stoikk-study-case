import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthRTK} from '@hooks/useAuthRTK';
import {LoadingScreen} from '@components/LoadingScreen/LoadingScreen';
import type {RootStackParamList} from './types';
import {LoginScreen} from '@screens/Login/LoginScreen';
import {FeedScreen} from '@screens/Feed/FeedScreen';
import {SearchScreen} from '@screens/Search/SearchScreen';
import {ProfileScreen} from '@screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator with auth-based routing
 */
export const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuthRTK();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Feed' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{title: 'Feed'}}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{title: 'Search'}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: 'Profile'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


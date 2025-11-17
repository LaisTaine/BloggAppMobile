import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppRoutes } from './src/routes/app.routes';

import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './src/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from './src/store/authSlice';

import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      async function loadCredentials() { 
        try {

          const token = await AsyncStorage.getItem('@BlogApp:token');
          const userString = await AsyncStorage.getItem('@BlogApp:user');
          
          if (token && userString) {

            const user = JSON.parse(userString);
            dispatch(setCredentials({ token: token, user: user }));
          }
        } catch (e) {
          console.warn('Falha ao carregar credenciais', e);
        } finally {
          setLoading(false);
        }
      }
      loadCredentials();
    }, [dispatch]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
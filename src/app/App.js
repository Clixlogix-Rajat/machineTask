import React from 'react';
import PageStack from '../navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <PageStack />
  </SafeAreaProvider> 
  )
}

export default App;

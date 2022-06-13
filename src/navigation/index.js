import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CategoryCreationPage, DetailsPage, ListingPage } from '../screens'
const { Navigator, Screen } = createStackNavigator();
const PageStack = () => {
    return (
        <NavigationContainer>
            <Navigator 
            screenOptions={{headerShown: true, headerLeftLabelVisible: false, headerTitleStyle:{ fontSize: 18 }}} 
            initialRouteName='ListingScreen'
            >
                <Screen name="Listing Screen" component={ListingPage} />
                <Screen name="Category Creation Screen" component={CategoryCreationPage} />
                <Screen name="Details Screen" component={DetailsPage} />
            </Navigator>
        </NavigationContainer>
    )
}
export default PageStack;
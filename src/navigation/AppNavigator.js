import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { colors, typography } from "../theme";

import HomeScreen from "../screens/HomeScreen";
import SeasonPickerScreen from "../screens/SeasonPickerScreen";
import SeasonGuideScreen from "../screens/SeasonGuideScreen";
import ColorCheckerScreen from "../screens/ColorCheckerScreen";
import FaceAnalysisScreen from "../screens/FaceAnalysisScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.bg,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    ...typography.subheading,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.bg,
  },
};

function TabIcon({ label, focused }) {
  const icons = {
    Home: focused ? "●" : "○",
    Colors: focused ? "◆" : "◇",
    Analyze: focused ? "◉" : "◎",
    Profile: focused ? "■" : "□",
  };
  return (
    <Text style={{ fontSize: 18, color: focused ? colors.accent : colors.textTertiary }}>
      {icons[label] || "○"}
    </Text>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.border,
          height: 85,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ColorCheckerTab"
        component={ColorCheckerScreen}
        options={{
          tabBarLabel: "Colors",
          tabBarIcon: ({ focused }) => <TabIcon label="Colors" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AnalyzeTab"
        component={FaceAnalysisScreen}
        options={{
          tabBarLabel: "Analyze",
          tabBarIcon: ({ focused }) => <TabIcon label="Analyze" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeasonPicker"
          component={SeasonPickerScreen}
          options={{ title: "Choose Season" }}
        />
        <Stack.Screen
          name="SeasonGuide"
          component={SeasonGuideScreen}
          options={{ title: "Season Guide" }}
        />
        <Stack.Screen
          name="ColorChecker"
          component={ColorCheckerScreen}
          options={{ title: "Color Checker" }}
        />
        <Stack.Screen
          name="FaceAnalysis"
          component={FaceAnalysisScreen}
          options={{ title: "Face Analysis" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

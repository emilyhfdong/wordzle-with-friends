import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as React from "react"

import { theme } from "../constants"
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types"
import LinkingConfiguration from "./LinkingConfiguration"
import {
  AddFriend,
  TodaysWord,
  HeaderStreak,
  Feed,
  AverageChart,
  ResetUser,
  AddFriendHeader,
  Seasons,
} from "../features"

export default function Navigation({}: {}) {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group
        screenOptions={{ presentation: "modal", headerShown: false }}
      >
        <Stack.Screen name="AddFriend" component={AddFriend} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{ presentation: "modal", headerShown: false }}
      >
        <Stack.Screen name="ResetUser" component={ResetUser} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Today"
      screenOptions={{
        tabBarActiveTintColor: theme.light.green,
      }}
    >
      <BottomTab.Screen
        name="Today"
        component={TodaysWord}
        options={({ navigation }: RootTabScreenProps<"Today">) => ({
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"home-outline"} size={20} color={color} />
          ),
          headerRight: () => <HeaderStreak />,
          headerStyle: { backgroundColor: theme.light.background },
        })}
      />
      <BottomTab.Screen
        name="Feed"
        component={Feed}
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"calendar-outline"} size={20} color={color} />
          ),
          headerRight: () => <HeaderStreak />,
          headerStyle: { backgroundColor: theme.light.background },
        }}
      />
      <BottomTab.Screen
        name="Friends"
        component={AverageChart}
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"people-outline"} size={20} color={color} />
          ),
          headerRight: () => <HeaderStreak />,
          headerStyle: { backgroundColor: theme.light.background },
          headerLeft: () => <AddFriendHeader />,
        }}
      />
      <BottomTab.Screen
        name="Seasons"
        component={Seasons}
        options={{
          title: "Seasons",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"trophy-outline"} size={20} color={color} />
          ),
          headerRight: () => <HeaderStreak />,
          headerStyle: { backgroundColor: theme.light.background },
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  NotFound: undefined
  AddFriend: undefined
  ResetUser: undefined
  Wrapped: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>

export type RootTabParamList = {
  Today: undefined
  Calendar: undefined
  Feed: undefined
  Friends: undefined
  Seasons: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export type WrappedStackParamList = {
  Landing: undefined
  MostCommonWords: undefined
  MostCommonTime: undefined
  YellowMistakes: undefined
  ExistingWordMistakes: undefined
  Socks: undefined
  Traps: undefined
  InitiatedPings: undefined
  RecievedPings: undefined
  Closing: undefined
}

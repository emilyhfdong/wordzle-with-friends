import { DateTime } from "luxon"
import React from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useFeedRequest } from "../components/initializer.hooks"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { RootTabScreenProps } from "../types"
import { Streak } from "../components/streak"

interface IFriendsProps {}

export const Friends: React.FC<
  IFriendsProps & RootTabScreenProps<"Friends">
> = ({ navigation }) => {
  const friends = useAppSelector((state) =>
    state.feed.friends ? Object.values(state.feed.friends) : []
  )
  const { refetch, isLoading } = useFeedRequest()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {friends.map((friend, idx) => (
        <View
          key={idx}
          style={{
            marginVertical: 5,
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: 15,
            paddingHorizontal: 15,
            backgroundColor: theme.light.background,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold", color: friend.color }}>
              {friend.name}
            </Text>
            <Text
              style={{
                color: theme.light.grey,
                marginTop: 5,
                textAlign: "right",
                fontSize: 10,
                fontStyle: "italic",
              }}
            >
              Last played:{" "}
              {friend.lastEntryDate
                ? DateTime.fromISO(friend.lastEntryDate).toFormat(
                    "EEE, MMM d t"
                  )
                : "Never"}
            </Text>
          </View>
          <Streak currentStreak={friend.currentStreak} />
        </View>
      ))}
      <TouchableOpacity
        style={{
          marginVertical: 5,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: "#F8F8F8",
        }}
        onPress={() => navigation.navigate("AddFriend")}
      >
        <Text style={{ fontWeight: "bold", color: "black" }}>+ Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

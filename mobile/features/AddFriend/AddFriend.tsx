import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"

import { theme } from "../../constants"
import { useAppSelector } from "../../redux"
import CloseIcon from "../../assets/images/close-icon.svg"
import { queryClient, QueryKeys, useAddFriend } from "../../query"
import {
  Title,
  Keyboard,
  ENTER_KEY,
  BACKSPACE,
  FullScreenLoading,
  Tile,
} from "../../shared"
import { useNavigation } from "@react-navigation/native"

export const AddFriend: React.FC = () => {
  const id = useAppSelector((state) => state.user.id)
  const [friendCode, setFriendCode] = useState("")
  const { goBack } = useNavigation()

  const { mutate, isLoading, error } = useAddFriend({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.FRIENDS)
      queryClient.invalidateQueries(QueryKeys.FEED)
      goBack()
    },
  })

  const handleKeyboardPress = async (key: string) => {
    if (key === ENTER_KEY) {
      if (friendCode.length === 5) {
        mutate({ userId: id, friendId: friendCode })
      }
      return
    }

    if (key === BACKSPACE) {
      if (friendCode.length) {
        setFriendCode(friendCode.slice(0, -1))
      }
      return
    }
    if (friendCode.length < 5) {
      setFriendCode(friendCode + key)
    }
  }

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <View
      style={{
        backgroundColor: theme.light.background,
        flex: 1,
        paddingBottom: 40,
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
        onPress={() => goBack()}
      >
        <CloseIcon fill={theme.light.grey} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title text="Share your code with your friends:" />
        <View style={{ flexDirection: "row" }}>
          {id.split("").map((letter, idx) => (
            <Tile
              lockedColor={theme.light.green}
              key={idx}
              hasWon={false}
              index={idx}
              locked
              letter={letter}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            height: 50,
            width: "70%",
            marginVertical: 40,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 25,
              borderBottomColor: theme.light.lightGrey,
              borderBottomWidth: 1,
            }}
          />
          <View style={{ height: "100%", justifyContent: "center" }}>
            <Text
              style={{
                paddingHorizontal: 20,
                fontWeight: "bold",
                color: theme.light.grey,
              }}
            >
              or
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 25,
              borderBottomColor: theme.light.lightGrey,
              borderBottomWidth: 1,
            }}
          />
        </View>
        <Title text="Enter your friend's code:" />
        <View style={{ flexDirection: "row" }}>
          {new Array(5).fill(null).map((_, idx) => (
            <Tile
              key={idx}
              hasWon={false}
              index={idx}
              locked={false}
              letter={friendCode[idx] || null}
            />
          ))}
        </View>
        {error && (
          <Text style={{ marginTop: 30, color: "#e85a5a" }}>
            Something went wrong!
          </Text>
        )}
      </View>
      <Keyboard prevGuesses={[]} onKeyPress={handleKeyboardPress} />
      <Text
        style={{
          position: "absolute",
          bottom: 5,
          right: 30,
          fontSize: 10,
          color: theme.light.lightGrey,
        }}
      >
        05/12/2022
      </Text>
    </View>
  )
}
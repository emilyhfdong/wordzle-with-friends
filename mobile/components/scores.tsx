import React from "react"
import { View, Text } from "react-native"
import { theme } from "../constants/theme"
import FireIcon from "../assets/images/fire.svg"
import AverageIcon from "../assets/images/average-icon.svg"
import { useAppSelector } from "../redux/hooks"

interface IScoresProps {
  currentStreak: number
  lastPlayedDate: string
  averageAttemptsCount: number | null
}

export const Scores: React.FC<IScoresProps> = ({
  currentStreak,
  lastPlayedDate,
  averageAttemptsCount,
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: currentStreak && todaysDate !== lastPlayedDate ? 0.5 : 1,
      }}
    >
      {averageAttemptsCount !== null && (
        <>
          <Text
            style={{
              marginRight: 4,
              fontWeight: "bold",
              color: theme.light.blue,
              textAlignVertical: "center",
            }}
          >
            {averageAttemptsCount}
          </Text>
          <AverageIcon fill={theme.light.blue} />
        </>
      )}
      <Text
        style={{
          marginLeft: 10,
          marginRight: 4,
          fontWeight: "bold",
          color: currentStreak ? "#e85a5a" : theme.light.grey,
          textAlignVertical: "center",
        }}
      >
        {currentStreak}
      </Text>
      <FireIcon
        style={{ marginBottom: 5 }}
        fill={currentStreak ? "#e85a5a" : theme.light.grey}
      />
    </View>
  )
}
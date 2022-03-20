import React, { useContext, useState } from "react"
import { View, Text } from "react-native"
import { BACKSPACE, ENTER_KEY, Keyboard } from "../components/keyboard"
import { Row, SHAKE_DURATION_IN_S } from "../components/row"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { theme } from "../constants/theme"

import { WordContext } from "../context/word-context"
import { RootTabScreenProps } from "../types"

export const TodaysWordScreen: React.FC<RootTabScreenProps<"TabOne">> = ({
  navigation,
}) => {
  const [currentGuess, setCurrentGuess] = useState("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>([])
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)
  const word = useContext(WordContext)

  const handleKeyboardPress = (key: string) => {
    if (key === ENTER_KEY && currentGuess.length === 5) {
      if (currentGuess === "RRRRR") {
        setIsNotWord(true)
        setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
        return
      }
      if (word === currentGuess) {
        setTimeout(
          () => setWinToastIsVisible(true),
          TOTAL_WORD_FLIP_DURATION_IN_S * 1000
        )
      }
      setCurrentGuess("")
      setPrevGuesses([...prevGuesses, currentGuess])
      return
    }

    if (key === BACKSPACE && currentGuess.length <= 5) {
      setCurrentGuess(currentGuess.slice(0, -1))
      return
    }
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key)
    }
  }

  return word ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.light.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        {new Array(6).fill(0).map((_, idx) => (
          <Row
            key={idx}
            letters={
              idx === prevGuesses.length ? currentGuess : prevGuesses[idx]
            }
            locked={idx < prevGuesses.length}
            isNotWord={isNotWord && idx === prevGuesses.length}
          />
        ))}
      </View>
      <View style={{ width: "100%" }}>
        <Keyboard onKeyPress={handleKeyboardPress} prevGuesses={prevGuesses} />
      </View>
    </View>
  ) : null
}

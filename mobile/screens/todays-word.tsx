import React, { useState } from "react"
import { View } from "react-native"
import { BACKSPACE, ENTER_KEY, Keyboard } from "../components/keyboard"
import { Row, SHAKE_DURATION_IN_S } from "../components/row"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { Toast } from "../components/toast"
import { theme } from "../constants/theme"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { RootTabScreenProps } from "../types"
import { isValidWord } from "../utils/valid-words"
import { todaysWordActions } from "../redux/slices/todays-word"
import { SummaryModal } from "../components/summary-modal"
import { dayEntriesActions, IDayEntry } from "../redux/slices/day-entries.slice"
import { BackendService } from "../services/backend"
import { DateTime } from "luxon"

export const TodaysWordScreen: React.FC<RootTabScreenProps<"Today">> = ({
  navigation,
}) => {
  const { currentGuess, prevGuesses, word, date, number } = useAppSelector(
    (state) => state.todaysWord
  )
  const lastDayEntry = useAppSelector((state) => state.dayEntries[0])
  const userId = useAppSelector((state) => state.user.id)
  const [summaryModalIsOpen, setSummaryModalIsOpen] = useState(
    lastDayEntry?.word.date === date
  )
  const dispatch = useAppDispatch()
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)

  const handleKeyboardPress = (key: string) => {
    if (key === ENTER_KEY) {
      if (currentGuess.length === 5) {
        if (!isValidWord(currentGuess)) {
          setIsNotWord(true)
          setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
          return
        }
        if (word === currentGuess) {
          setTimeout(() => {
            const allAttempts = [...prevGuesses, currentGuess]
            setWinToastIsVisible(true)
            setTimeout(() => {
              setSummaryModalIsOpen(true)
              const dayEntry: IDayEntry = {
                attemptsCount: allAttempts.length,
                attemptsDetails: allAttempts.join(" "),
                word: { date, answer: word, number },
                createdAt: DateTime.now().toUTC().toISO(),
                userId,
              }
              dispatch(dayEntriesActions.addDayEntry(dayEntry))
              BackendService.createDayEntry(userId, dayEntry)
            }, 1000)
          }, TOTAL_WORD_FLIP_DURATION_IN_S * 1000)
        }
        dispatch(todaysWordActions.setCurrentGuess(""))
        dispatch(
          todaysWordActions.setPrevGuesses([...prevGuesses, currentGuess])
        )
      }
      return
    }

    if (key === BACKSPACE) {
      if (currentGuess) {
        dispatch(todaysWordActions.setCurrentGuess(currentGuess.slice(0, -1)))
      }
      return
    }
    if (currentGuess.length < 5) {
      dispatch(todaysWordActions.setCurrentGuess(currentGuess + key))
    }
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.light.background,
        position: "relative",
      }}
    >
      <SummaryModal
        isOpen={summaryModalIsOpen}
        closeModal={() => setSummaryModalIsOpen(false)}
      />
      <Toast isVisible={isNotWord}>Not in word list</Toast>
      <Toast isVisible={winToastIsVisible}>Impressive</Toast>
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
  )
}

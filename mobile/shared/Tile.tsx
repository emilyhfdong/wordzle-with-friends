import { useEffect, useRef, useState } from "react"
import { Animated, Text } from "react-native"
import { theme } from "../constants"
import { RH } from "../utils"

type TTileProps = {
  letter: string | null
  locked?: boolean
  index: number
  hasWon?: boolean
  lockedColor?: string
}

export const FLIP_DURATION_IN_S = 0.25
export const TOTAL_WORD_FLIP_DURATION_IN_S = FLIP_DURATION_IN_S * 6

export const Tile: React.FC<TTileProps> = ({
  letter,
  index,
  locked = false,
  hasWon = false,
  lockedColor,
}) => {
  const [currentLetter, setCurrentLetter] = useState(letter)
  const [backgroundColor, setBackgroundColor] = useState(
    locked ? lockedColor : theme.light.background
  )
  const [borderWidth, setBorderWidth] = useState(locked ? 0 : 2)
  const [textColor, setTextColor] = useState(
    locked ? theme.light.background : theme.light.default
  )

  const opacityAnim = useRef(new Animated.Value(1)).current
  const lockedAnim = useRef(new Animated.Value(locked ? 1 : 0)).current
  const winAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (letter) {
      opacityAnim.setValue(0)
      setCurrentLetter(letter)
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start()
    } else {
      setCurrentLetter(letter)
    }
  }, [letter])

  useEffect(() => {
    if (locked) {
      Animated.timing(lockedAnim, {
        toValue: 0.5,
        duration: FLIP_DURATION_IN_S * 1000,
        useNativeDriver: true,
        delay: FLIP_DURATION_IN_S * 1000 * index,
      }).start(() => {
        setBackgroundColor(lockedColor)
        setBorderWidth(0)
        setTextColor(theme.light.background)
        Animated.timing(lockedAnim, {
          toValue: 1,
          duration: FLIP_DURATION_IN_S * 1000,
          useNativeDriver: true,
        }).start()
      })
      if (hasWon) {
        Animated.timing(winAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          delay: TOTAL_WORD_FLIP_DURATION_IN_S * 1000 + index * 100,
        }).start()
      }
    }
  }, [locked])

  return (
    <Animated.View
      style={{
        height: RH(7),
        width: RH(7),
        borderWidth,
        borderColor: currentLetter ? theme.light.grey : theme.light.lightGrey,
        marginBottom: 6,
        marginLeft: index === 0 ? 0 : 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
        opacity: opacityAnim,
        transform: [
          {
            scale: opacityAnim.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0.8, 1.1, 1],
            }),
          },
          {
            rotateX: lockedAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ["0deg", "-90deg", "0deg"],
            }),
          },
          {
            translateY: winAnim.interpolate({
              inputRange: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
              outputRange: [0, 0, -30, 5, -15, 2, 0],
            }),
          },
        ],
      }}
    >
      <Text
        style={{
          fontSize: RH(3),
          fontWeight: "bold",
          color: textColor,
        }}
      >
        {currentLetter}
      </Text>
    </Animated.View>
  )
}

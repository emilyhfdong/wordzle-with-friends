import { useNavigation } from "@react-navigation/native"
import React, { PropsWithChildren, useEffect, useRef, useState } from "react"
import {
  Animated,
  Button,
  StyleProp,
  Text,
  TextStyle,
  View,
} from "react-native"
import { WrappedHeader } from ".."
import { theme } from "../../constants"
import { useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"
import { AnimatedTitle } from "../../shared/AnimatedTitle"
import { ModalContainer } from "../../shared/ModalContainer"
import { WrappedStackParamList } from "../../types"
import { RH, RW } from "../../utils"

type WrappedLayoutProps = {
  fullTitle: string
  title?: string
  nextScreen?: keyof WrappedStackParamList | "Root"
  noBack?: boolean
  accentColor?: keyof typeof theme.light
}

const getPartiallyStyledText = (
  text: string,
  partialStyle: StyleProp<TextStyle>,
  style: StyleProp<TextStyle>
) => {
  return text.split("**").map((phrase, phraseIndex) =>
    phrase.split(" ").map((word, wordIndex) => (
      <Text
        key={`${wordIndex}${phraseIndex}`}
        style={[style, Boolean(phraseIndex % 2) ? partialStyle : {}]}
      >
        {word}&nbsp;
      </Text>
    ))
  )
}

export const WrappedLayout: React.FC<PropsWithChildren<WrappedLayoutProps>> = ({
  title,
  children,
  nextScreen,
  fullTitle,
  noBack,
  accentColor: accentColorKey,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const { navigate } = useNavigation()
  const [isShowingFullTitle, setIsShowingFullTitle] = useState(true)

  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    const INITIAL_DELAY = 500
    const TITLE_DELAY = 2000
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
      delay: INITIAL_DELAY,
    }).start()
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,

      delay: INITIAL_DELAY,
    }).start()
    if (title) {
      setTimeout(() => {
        Animated.spring(opacity, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
        Animated.spring(translateY, {
          toValue: 1,
          useNativeDriver: true,
        }).start(() => setIsShowingFullTitle(false))
      }, INITIAL_DELAY + TITLE_DELAY)
    }
  }, [])

  if (!data) {
    return null
  }

  const color = accentColorKey ? theme.light[accentColorKey] : theme.light.green
  return (
    <ModalContainer
      header={<WrappedHeader color={color || theme.light.green} />}
      noBack={noBack}
      onClose={() => navigate("Root")}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: RW(2),
          justifyContent: "space-between",
        }}
      >
        {isShowingFullTitle || !title ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={{
                opacity,
                transform: [{ translateY }],
              }}
            >
              {fullTitle.split(/\r?\n/).map((line) => (
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {getPartiallyStyledText(
                    line,
                    { color },
                    {
                      fontSize: 40,
                      fontWeight: "bold",
                    }
                  )}
                </View>
              ))}
            </Animated.View>
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <AnimatedTitle text={title} />
            {children}
          </View>
        )}

        {nextScreen && (!isShowingFullTitle || !title) && (
          <Button
            onPress={() => navigate(nextScreen as any)}
            color={theme.light.green}
            title="Next"
          />
        )}
      </View>
    </ModalContainer>
  )
}

import { useNavigation } from "@react-navigation/native"
import React, { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Animated, Button, View } from "react-native"
import { theme } from "../../constants"
import { useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"
import { AnimatedTitle } from "../../shared/AnimatedTitle"
import { ModalContainer } from "../../shared/ModalContainer"
import { WrappedStackParamList } from "../../types"
import { RH, RW } from "../../utils"

type WrappedLayoutProps = {
  fullTitle: string
  title: string
  nextScreen?: keyof WrappedStackParamList
}

export const WrappedLayout: React.FC<PropsWithChildren<WrappedLayoutProps>> = ({
  title,
  children,
  nextScreen,
  fullTitle,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const { navigate } = useNavigation()
  const [isShowingFullTitle, setIsShowingFullTitle] = useState(true)

  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    const INITIAL_DELAY = 500
    const TITLE_DELAY = 3000
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
  }, [])

  if (!data) {
    return null
  }

  return (
    <ModalContainer>
      <View
        style={{
          flex: 1,
          paddingTop: RH(5),
          paddingHorizontal: RW(2),
          justifyContent: "space-between",
        }}
      >
        {isShowingFullTitle ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Animated.Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                opacity,
                transform: [{ translateY }],
              }}
            >
              {fullTitle}
            </Animated.Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <AnimatedTitle text={title} />
            {children}
          </View>
        )}

        {nextScreen && !isShowingFullTitle && (
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

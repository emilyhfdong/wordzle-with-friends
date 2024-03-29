import { IUserMetaDataItem, IUserStatsItem } from "@libs/database/types"

interface IFriendDetails {
  userId: string
  name: string
  currentStreak: number
  lastPlayed: string
  averageAttemptsCount: number
  pingStatus: "notifications_disabled" | "already_pinged" | "ready"
  color: string
  lastAverages: number[]
  averageChanges: IUserStatsItem["seasonAverageChanges"]
}

const COLORS = ["#78CFA0", "#7DBCE8", "#C6449F", "#457AF9"]

export const getFriendDetails = ({
  metadata,
  userPingedFriendIds,
  index,
  stats,
}: {
  metadata: IUserMetaDataItem
  userPingedFriendIds: string[]
  stats: IUserStatsItem
  index: number
}): IFriendDetails => {
  return {
    currentStreak: stats.currentStreak,
    lastPlayed: stats.lastPlayed,
    averageAttemptsCount: stats.averageAttemptsCount,
    name: metadata.name,
    userId: metadata.pk,
    pingStatus: !metadata.pushToken
      ? "notifications_disabled"
      : userPingedFriendIds.includes(metadata.pk)
      ? "already_pinged"
      : "ready",
    color: COLORS[index % COLORS.length],
    lastAverages: stats.seasonAverages.slice(-30),
    averageChanges: stats.seasonAverageChanges,
  }
}

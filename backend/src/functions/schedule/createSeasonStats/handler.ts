import { database } from "@libs/database"
import { ISeasonItem } from "@libs/database/types"
import { config } from "@libs/environment"
import { getAverageAttemptsForSeason } from "@libs/utils"
import { DateTime, Settings } from "luxon"

export const handler = async () => {
  Settings.defaultZone = config.timezone
  const hour = DateTime.now().hour

  if (hour !== 0) {
    console.log("its not midnight, returning early")
    return
  }

  const pastSeasons = (await database.getSeasons()).sort(
    (a, b) => Number(b.sk) - Number(a.sk)
  )

  const lastSeason = pastSeasons?.[0] || null

  const seasonNumber = lastSeason ? Number(lastSeason.sk) + 1 : 1

  const users = await database.getAllUsers()

  const userItems = await Promise.all(
    users.map((user) => database.getUserItems(user.pk))
  )

  const leaderboard: ISeasonItem["leaderboard"] = userItems
    .filter(
      (user) =>
        user.completedDayEntries.length > 0 &&
        !user.metadata.name.includes("dev")
    )
    .map((user) => ({
      average: getAverageAttemptsForSeason(
        user.completedDayEntries,
        DateTime.now().minus({ day: 1 }).toISODate()
      ),
      name: user.metadata.name,
      userId: user.metadata.pk,
    }))
    .sort((a, b) => a.average - b.average)

  await database.putSeason(
    leaderboard,
    DateTime.now().minus({ day: 1 }).startOf("quarter").toISODate(),
    DateTime.now().minus({ day: 1 }).endOf("quarter").toISODate(),
    seasonNumber.toString()
  )

  return
}

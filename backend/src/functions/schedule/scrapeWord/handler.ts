import * as AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient()
import { config } from "@libs/environment"
import { DateTime, Settings } from "luxon"
import { getBrowser } from "@libs/puppeteer"

const CLOSE_ICON_PATH = `document.querySelector("dialog > div > button")`
const ANSWER_TOAST_PATH = `document.querySelector("#ToastContainer-module_gameToaster__HPkaC > div")`
const PLAY_BUTTON_PATH = `document.querySelector("div.Welcome-module_buttonContainer__K4GEw > button:nth-child(3)")`

export const handler = async () => {
  Settings.defaultZone = config.timezone

  const hour = DateTime.now().hour

  if (hour !== 0) {
    console.log("its not midnight, returning early")
    return
  }

  const todaysDate = DateTime.now().toISODate()

  console.log("finding entry for", todaysDate)
  const todaysWord = await dynamodb
    .get({
      TableName: config.wordHistoryTableName,
      Key: { date: todaysDate },
    })
    .promise()

  if (todaysWord.Item) {
    console.log(`today's word "${todaysWord.Item.word}" already exists"`)
    return
  }

  const yesterdaysDate = DateTime.now().minus({ day: 1 }).toISODate()
  console.log(`getting yesterdays (${yesterdaysDate}) number`)
  const yesterdaysWord = await dynamodb
    .get({
      TableName: config.wordHistoryTableName,
      Key: { date: yesterdaysDate },
    })
    .promise()

  if (!yesterdaysWord.Item) {
    throw new Error("Missing yesterday's word")
  }
  const todaysNumber = yesterdaysWord.Item.number + 1
  console.log("todays wordle number is", todaysNumber)

  console.log("launching browser")
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.emulateTimezone(config.timezone)
  await page.goto("https://www.nytimes.com/games/wordle/index.html")

  const playButton = await page.evaluateHandle(PLAY_BUTTON_PATH)
  //@ts-expect-error
  await playButton.click()
  await page.waitForSelector("dialog")

  const closeIcon = await page.evaluateHandle(CLOSE_ICON_PATH)
  //@ts-expect-error
  await closeIcon.click()
  await page.waitForTimeout(3000)

  console.log("entering 6 nonsense words")
  for (let i = 0; i < 6; i++) {
    await page.keyboard.type("HELLO")
    await page.keyboard.press("Enter")
    await page.waitForTimeout(3000)
  }
  console.log("getting answer")
  const answerToastHandle = await page.evaluateHandle(ANSWER_TOAST_PATH)

  const answerInnerTextHandle = await answerToastHandle.getProperty("innerText")
  const answer = await answerInnerTextHandle.jsonValue()

  console.log(`storing answer "${answer}" in db`)
  await dynamodb
    .put({
      TableName: config.wordHistoryTableName,
      Item: { date: todaysDate, word: answer, number: todaysNumber },
    })
    .promise()
}

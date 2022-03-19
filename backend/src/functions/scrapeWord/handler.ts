import * as AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient()
import { config } from "@libs/environment"
import { DateTime, Settings } from "luxon"
import { getBrowser } from "@libs/puppeteer"

const CLOSE_ICON_PATH = `document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-modal").shadowRoot.querySelector("div > div > div")`
const ANSWER_TOAST_PATH = `document.querySelector("body > game-app").shadowRoot.querySelector("#game-toaster > game-toast").shadowRoot.querySelector("div")`

export const handler = async () => {
  Settings.defaultZone = config.timezone
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
  console.log("launching browser")
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.emulateTimezone(config.timezone)
  await page.goto("https://www.nytimes.com/games/wordle/index.html")
  const closeIcon = await page.evaluateHandle(CLOSE_ICON_PATH)
  //@ts-expect-error
  await closeIcon.click()

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
      Item: { date: todaysDate, word: answer },
    })
    .promise()
}

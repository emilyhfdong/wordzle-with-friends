import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

const generateRandomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  return new Array(5)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("")
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body)
  if (!body.name) {
    return createResponse({
      body: { message: "Missing `name` field" },
      statusCode: 400,
    })
  }

  let isUnique = false
  let id = ""

  while (!isUnique) {
    id = generateRandomId()
    const existingUser = await database.getUser(id)
    isUnique = !existingUser
  }

  const user = await database.putUser(id, { name: body.name, friendIds: [] })

  return createResponse({
    body: {
      user: {
        id: user.pk,
        name: user.name,
      },
    },
  })
}

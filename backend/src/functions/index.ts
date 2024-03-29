import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  // api
  addFriend: {
    handler: `src/functions/api/addFriend/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/friends" },
      },
    ],
  },
  createDayEntry: {
    handler: `src/functions/api/createDayEntry/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/day-entry" },
      },
    ],
  },
  createDayEntryAttempt: {
    handler: `src/functions/api/createDayEntryAttempt/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/day-entry-attempt" },
      },
    ],
  },
  createUser: {
    handler: `src/functions/api/createUser/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users" },
      },
    ],
  },
  getFriendsList: {
    handler: `src/functions/api/getFriendsList/handler.handler`,
    timeout: 10,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/friends" },
      },
    ],
  },
  getGroupedFeed: {
    handler: `src/functions/api/getGroupedFeed/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/grouped-feed" },
      },
    ],
  },
  getGroupedFeedV2: {
    handler: `src/functions/api/getGroupedFeedV2/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/v2/grouped-feed" },
      },
    ],
  },
  getFeed: {
    handler: `src/functions/api/getFeed/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/feed" },
      },
    ],
  },
  getSeasons: {
    handler: `src/functions/api/getSeasons/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/seasons" },
      },
    ],
  },
  getTodaysWord: {
    handler: `src/functions/api/getTodaysWord/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "today" },
      },
    ],
  },
  getUser: {
    handler: `src/functions/api/getUser/handler.handler`,
    timeout: 10,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}" },
      },
    ],
  },
  getWrappedStats: {
    handler: `src/functions/api/getWrappedStats/handler.handler`,
    timeout: 10,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/wrapped" },
      },
    ],
  },
  pingFriend: {
    handler: `src/functions/api/pingFriend/handler.handler`,
    events: [
      {
        http: {
          method: "POST",
          path: "/users/{userId}/friends/{friendId}/ping",
        },
      },
    ],
  },
  updateUser: {
    handler: `src/functions/api/updateUser/handler.handler`,
    events: [
      {
        http: { method: "PATCH", path: "/users/{userId}" },
      },
    ],
  },
  // dynamo stream
  sendFriendNotifications: {
    handler: `src/functions/dynamoStream/sendFriendNotifications/handler.handler`,
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: { "Fn::GetAtt": ["WordzleTable", "StreamArn"] },
        },
      },
    ],
  },
  updateStats: {
    handler: `src/functions/dynamoStream/updateStats/handler.handler`,
    timeout: 900,
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: { "Fn::GetAtt": ["WordzleTable", "StreamArn"] },
          maximumRetryAttempts: 3,
        },
      },
    ],
  },
  // schedule
  scrapeWord: {
    handler: `src/functions/schedule/scrapeWord/handler.handler`,
    timeout: 900,
    events: [
      {
        schedule: {
          // everyday at 4:01am UTC (12:01am EDT (summer) / 11:01pm EST (winter))
          rate: "cron(1 4 * * ? *)",
          enabled: true,
        },
      },
      {
        schedule: {
          // everyday at 5:01am UTC (1:01am EDT (summer) / 12:01am EST (winter))
          rate: "cron(1 5 * * ? *)",
          enabled: true,
        },
      },
    ],
  },
  createSeasonStats: {
    handler: `src/functions/schedule/createSeasonStats/handler.handler`,
    events: [
      {
        schedule: {
          // every 3 months on the 1st at 4:01am UTC (12:01am EDT / 11:01pm EST)
          rate: "cron(1 4 1 1/3 ? *)",
          enabled: true,
        },
      },
      {
        schedule: {
          // every 3 months on the 1st at 5:01am UTC (1:01am EDT / 12:01am EST)
          rate: "cron(1 5 1 1/3 ? *)",
          enabled: true,
        },
      },
    ],
  },
  createWrappedStats: {
    handler: `src/functions/schedule/createWrappedStats/handler.handler`,
    events: [
      {
        schedule: {
          // every 3 months on the 1st at 4:01am UTC (12:01am EDT / 11:01pm EST)
          rate: "cron(1 4 1 1/3 ? *)",
          enabled: true,
        },
      },
      {
        schedule: {
          // every 3 months on the 1st at 5:01am UTC (1:01am EDT / 12:01am EST)
          rate: "cron(1 5 1 1/3 ? *)",
          enabled: true,
        },
      },
    ],
  },
  sendSeasonEndNotifications: {
    handler: `src/functions/schedule/sendSeasonEndNotifications/handler.handler`,
    events: [
      {
        schedule: {
          // every 3 months on the 1st at 1:01pm UTC (9:01am EDT / 8:01 EST)
          rate: "cron(1 13 1 1/3 ? *)",
          enabled: true,
        },
      },
    ],
  },
  sendStreakWarningNotification: {
    handler: `src/functions/schedule/sendStreakWarningNotification/handler.handler`,
    events: [
      {
        schedule: {
          // everyday at 3:01am UTC (11:01am EDT / 10:01pm EST)
          rate: "cron(1 3 * * ? *)",
          enabled: true,
        },
      },
      {
        schedule: {
          // everyday at 4:01am UTC (12:01am EDT / 11:01pm EST)
          rate: "cron(1 4 * * ? *)",
          enabled: true,
        },
      },
    ],
  },
  //backfill
  backfillStats: {
    handler: `src/functions/backfill/backfillStats/handler.handler`,
    timeout: 900,
  },
}

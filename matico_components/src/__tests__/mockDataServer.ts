import { rest } from "msw"
import { setupServer } from "msw/node"
import fs from "fs"

const mockFiles = fs.readdirSync(__dirname + "/mockDatasets")

const handlers = mockFiles.map((fileName: string) => {
  return rest.get(`https://data.com/${fileName}`, (_, res, ctx) => {
    let file = fs.readFileSync(__dirname + "/mockDatasets/" + fileName);
    return res(ctx.status(200), ctx.body(file))
  })
})

export const server = setupServer(...handlers)

export default function() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterAll(() => server.close())
  afterEach(() => server.resetHandlers())
}

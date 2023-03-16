/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage, initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import 'setimmediate'

initTestHelpers()

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'title1',
            body: 'body1',
          },
          {
            userId: 2,
            id: 2,
            title: 'title2',
            body: 'body2',
          },
        ])
      )
    }
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

describe('Blog Page', () => {
  it('Should render blog page', async () => {
    const { page } = await getPage({
      route: '/blog-page',
    })
    //react testing libraryの、render関数を使ってHTML構造を取得する
    render(page)
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    expect(await screen.findByText('title1')).toBeInTheDocument()
    expect(await screen.findByText('title2')).toBeInTheDocument()
  })
})

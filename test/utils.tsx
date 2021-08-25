import { RouterContext, BlitzRouter, BlitzProvider, Ctx } from "blitz"
import { render as defaultRender } from "@testing-library/react"
import { renderHook as defaultRenderHook } from "@testing-library/react-hooks"
import { User } from "db"

export * from "@testing-library/react"

// --------------------------------------------------------------------------------
// This file customizes the render() and renderHook() test functions provided
// by React testing library. It adds a router context wrapper with a mocked router.
//
// You should always import `render` and `renderHook` from this file
//
// This is the place to add any other context providers you need while testing.
// --------------------------------------------------------------------------------

// --------------------------------------------------
// render()
// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
export function render(
  ui: RenderUI,
  { wrapper, router, dehydratedState, ...options }: RenderOptions = {}
) {
  if (!wrapper) {
    // Add a default context wrapper if one isn't supplied from the test
    wrapper = ({ children }) => (
      <BlitzProvider dehydratedState={dehydratedState}>
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          {children}
        </RouterContext.Provider>
      </BlitzProvider>
    )
  }
  return defaultRender(ui, { wrapper, ...options })
}

// --------------------------------------------------
// renderHook()
// --------------------------------------------------
// Override the default test renderHook with our own
//
// You can override the router mock like this:
//
// const result = renderHook(() => myHook(), {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
export function renderHook(
  hook: RenderHook,
  { wrapper, router, dehydratedState, ...options }: RenderHookOptions = {}
) {
  if (!wrapper) {
    // Add a default context wrapper if one isn't supplied from the test
    wrapper = ({ children }) => (
      <BlitzProvider dehydratedState={dehydratedState}>
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          {children}
        </RouterContext.Provider>
      </BlitzProvider>
    )
  }
  return defaultRenderHook(hook, { wrapper, ...options })
}

export const mockRouter: BlitzRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  params: {},
  query: {},
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
}

type DefaultParams = Parameters<typeof defaultRender>
type RenderUI = DefaultParams[0]
type RenderOptions = DefaultParams[1] & { router?: Partial<BlitzRouter>; dehydratedState?: unknown }

type DefaultHookParams = Parameters<typeof defaultRenderHook>
type RenderHook = DefaultHookParams[0]
type RenderHookOptions = DefaultHookParams[1] & {
  router?: Partial<BlitzRouter>
  dehydratedState?: unknown
}

export function getTestSession({
  user,
  orgId,
  ...rest
}: Partial<Ctx> & { user: User; orgId?: number }): Ctx {
  return {
    session: {
      $authorize: jest.fn(),
      $isAuthorized: jest.fn(() => true),
      userId: user?.id,
      roles: ["USER"],
      $getPrivateData: jest.fn(),
      $create: jest.fn(),
      $handle: null,
      $publicData: {
        roles: ["USER"],
        userId: user.id,
        orgId,
      },
      $revoke: jest.fn(),
      $revokeAll: jest.fn(),
      $setPrivateData: jest.fn(),
      $setPublicData: jest.fn(),
      orgId,

      ...rest.session,
    },
  }
}

export function getLoggedOutSession(): Ctx {
  return {
    session: {
      $authorize: jest.fn(),
      $isAuthorized: jest.fn(() => false),
      userId: null,
      roles: [],
      $getPrivateData: jest.fn(),
      $create: jest.fn(),
      $handle: null,
      $publicData: {},
      $revoke: jest.fn(),
      $revokeAll: jest.fn(),
      $setPrivateData: jest.fn(),
      $setPublicData: jest.fn(),
      orgId: null,
    },
  }
}

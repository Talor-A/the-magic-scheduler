import Sidebar from "./Sidebar"
import { render, screen } from "test/utils"

import { useLoggedInUser } from "app/users/hooks/useCurrentUser"
import { useCurrentOrg } from "app/organizations/hooks/useOrganization"

jest.mock("app/users/hooks/useCurrentUser")
const mockUseCurrentUser = useLoggedInUser as jest.MockedFunction<typeof useLoggedInUser>

jest.mock("app/organizations/hooks/useOrganization")
const mockUseCurrentOrg = useCurrentOrg as jest.MockedFunction<typeof useCurrentOrg>

describe("Sidebar", () => {
  mockUseCurrentUser.mockReturnValue({
    id: 1,
    name: "Hugh Neutron",
    email: "hugh@protonmail.com",
    role: "CUSTOMER",
  })
  mockUseCurrentOrg.mockReturnValue({
    id: 1,
    name: "Pizza Planet",
  })

  it("should render a header", () => {
    render(<Sidebar>children</Sidebar>)

    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("should show the logged in user and their organization name", () => {
    render(<Sidebar>children</Sidebar>)

    expect(screen.getByText("Hugh Neutron")).toBeInTheDocument()
    expect(screen.getByText("Pizza Planet")).toBeInTheDocument()
  })

  it("should handle no organization being set", () => {
    mockUseCurrentOrg.mockReturnValue(null)

    render(<Sidebar>children</Sidebar>)

    expect(screen.getByText("No Org")).toBeInTheDocument()
  })
})

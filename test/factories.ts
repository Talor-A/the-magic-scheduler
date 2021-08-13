import { User } from "db"
import faker from "faker"

export const getUserAttributes = (): Pick<User, "email" | "name" | "role"> => ({
  email: faker.internet.email(),
  name: faker.name.findName(),
  role: "CUSTOMER",
})

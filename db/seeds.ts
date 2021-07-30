// import db from "./index"

import { SecurePassword } from "blitz"
import db from "db"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  await db.$reset()

  // create superadmin user
  await db.user.create({
    data: {
      name: "Superman",
      email: "super_admin@test.com",
      hashedPassword: await SecurePassword.hash("superadmin123"),
      role: "SUPERADMIN",
    },
  })

  // create a few customer users
  for (let i = 0; i < 5; i++) {
    await db.user.create({
      data: {
        name: "Customer " + i,
        email: "customer" + i + "@test.com",
        hashedPassword: await SecurePassword.hash("customer123"),
        role: "CUSTOMER",
      },
    })
  }

  // create a new organization for a customer
  const firstOrg = await db.organization.create({
    data: {
      name: "Organization 1",
      membership: {
        create: [
          {
            role: "OWNER",
            user: {
              connect: {
                email: "customer0@test.com",
              },
            },
          },
        ],
      },
    },
  })

  // invite a customer to the organization
  await db.membership.create({
    data: {
      role: "USER",
      invitedEmail: "customer1@test.com",
      organizationId: firstOrg.id,
    },
  })
}

export default seed

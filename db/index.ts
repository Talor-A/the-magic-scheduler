import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { Tuplify } from "types/helpers"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export function zodEnum<U extends string, T extends { [k in U]: U }>(e: T) {
  return z.enum<U, Tuplify<U[]>>(Object.keys(e) as any)
}

export * from "@prisma/client"
export default new EnhancedPrisma()

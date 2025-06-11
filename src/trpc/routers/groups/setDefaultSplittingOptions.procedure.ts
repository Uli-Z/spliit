import { setGroupDefaultSplittingOptions } from '@/lib/api'
import { splittingOptionsSchema } from '@/lib/schemas'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const setDefaultSplittingOptionsProcedure = baseProcedure
  .input(
    z.object({
      groupId: z.string().min(1),
      splittingOptions: splittingOptionsSchema,
    }),
  )
  .mutation(async ({ input: { groupId, splittingOptions } }) => {
    await setGroupDefaultSplittingOptions(groupId, splittingOptions)
  })

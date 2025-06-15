'use client'

import { GroupForm } from '@/components/group-form'
import { DefaultSplittingForm } from '@/app/groups/[groupId]/edit/default-splitting-form'
import { SplittingOptions } from '@/lib/schemas'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const CreateGroup = () => {
  const { mutateAsync } = trpc.groups.create.useMutation()
  const { mutateAsync: setDefaultSplitting } =
    trpc.groups.setDefaultSplittingOptions.useMutation()
  const utils = trpc.useUtils()
  const router = useRouter()

  const [participants, setParticipants] = useState<
    { id?: string; name: string }[]
  >([])
  const [defaultOptions, setDefaultOptions] = useState<SplittingOptions | null>(
    null,
  )
  const [showDefault, setShowDefault] = useState(false)

  return (
    <>
      <GroupForm
        onParticipantsChange={setParticipants}
        onEditDefaultSplitting={() => setShowDefault((v) => !v)}
        onSubmit={async (groupFormValues) => {
          const { groupId } = await mutateAsync({ groupFormValues })
          await utils.groups.invalidate()
          if (defaultOptions) {
            const details = await utils.groups.getDetails.fetch({ groupId })
            await setDefaultSplitting({
              groupId,
              splittingOptions: {
                splitMode: defaultOptions.splitMode,
                paidFor: defaultOptions.paidFor?.map((pf, index) => ({
                  participant: details.group.participants[index].id,
                  shares: pf.shares,
                })) ?? null,
              },
            })
          }
          router.push(`/groups/${groupId}`)
        }}
      />
      {showDefault && (
        <DefaultSplittingForm
          participants={participants.map((p, i) => ({ id: String(i), name: p.name }))}
          defaultSplittingOptions={defaultOptions ?? undefined}
          onSave={async (opts) => setDefaultOptions(opts)}
        />
      )}
    </>
  )
}

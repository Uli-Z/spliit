'use client'

import { GroupForm } from '@/components/group-form'
import { trpc } from '@/trpc/client'
import { useCurrentGroup } from '../current-group-context'
import { DefaultSplittingForm } from './default-splitting-form'
import { SplittingOptions } from '@/lib/schemas'
import { useState } from 'react'

export const EditGroup = () => {
  const { groupId } = useCurrentGroup()
  const { data, isLoading } = trpc.groups.getDetails.useQuery({ groupId })
  const { mutateAsync } = trpc.groups.update.useMutation()
  const { mutateAsync: setDefaultSplitting } =
    trpc.groups.setDefaultSplittingOptions.useMutation()
  const utils = trpc.useUtils()
  const [showDefaultSplitting, setShowDefaultSplitting] = useState(false)

  if (isLoading) return <></>

  return (
    <>
      <GroupForm
        group={data?.group}
        onSubmit={async (groupFormValues, participantId) => {
          await mutateAsync({ groupId, participantId, groupFormValues })
          await utils.groups.invalidate()
        }}
        protectedParticipantIds={data?.participantsWithExpenses}
        onEditDefaultSplitting={() => setShowDefaultSplitting((v) => !v)}
      />
      {showDefaultSplitting && data?.group && (
        <DefaultSplittingForm
          participants={data.group.participants}
          defaultSplittingOptions={
            data.group.defaultSplittingOptions as SplittingOptions | null
          }
          onSave={async (opts) => {
            await setDefaultSplitting({ groupId, splittingOptions: opts })
            await utils.groups.invalidate()
          }}
        />
      )}
    </>
  )
}

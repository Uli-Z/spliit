'use client'

import { GroupForm } from '@/components/group-form'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'

export const CreateGroup = () => {
  const { mutateAsync } = trpc.groups.create.useMutation()
  const utils = trpc.useUtils()
  const router = useRouter()

  return (
    <GroupForm
      onSubmit={async (groupFormValues) => {
        const { groupId } = await mutateAsync({ groupFormValues })

        // Store the actual currency as default in localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('defaultCurrency', groupFormValues.currency)
        }

        await utils.groups.invalidate()
        router.push(`/groups/${groupId}`)
      }}
    />
  )
}

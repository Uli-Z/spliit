'use client'

import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SplittingOptions, splittingOptionsSchema } from '@/lib/schemas'
import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import type { getGroup } from '@/lib/api'

export function DefaultSplittingForm({
  group,
}: {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>
}) {
  const t = useTranslations('GroupForm')
  const tDefault = useTranslations('GroupForm.DefaultSplitting')
  const { mutateAsync } = trpc.groups.setDefaultSplittingOptions.useMutation()
  const utils = trpc.useUtils()

  const defaultValues: SplittingOptions = {
    splitMode: 'BY_SHARES',
    paidFor: group.participants.map((p) => {
      const existing =
        (group.defaultSplittingOptions as SplittingOptions | null)?.paidFor?.find(
          (pf) => pf.participant === p.id,
        )
      return { participant: p.id, shares: existing ? existing.shares : 1 }
    }),
  }

  const form = useForm<SplittingOptions>({
    resolver: zodResolver(splittingOptionsSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await mutateAsync({ groupId: group.id, splittingOptions: values })
          await utils.groups.invalidate()
        })}
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{tDefault('title')}</CardTitle>
            <CardDescription>{tDefault('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {group.participants.map((participant, index) => (
                <li key={participant.id} className="flex items-center gap-2">
                  <FormLabel className="flex-1">
                    {participant.name}
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name={`paidFor.${index}.shares` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-24"
                            placeholder={tDefault('factorLabel')}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input
                    type="hidden"
                    {...form.register(`paidFor.${index}.participant`)}
                    value={participant.id}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() =>
                form.setValue(
                  'paidFor',
                  form.getValues().paidFor?.map((pf) => ({
                    ...pf,
                    shares: 1,
                  })) ?? null,
                )
              }
            >
              {tDefault('reset')}
            </Button>
            <SubmitButton loadingContent={t('Settings.saving')}>
              {t('Settings.save')}
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

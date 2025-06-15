'use client'

import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SplittingOptions, splittingOptionsSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export function CreateDefaultSplittingForm({
  participants,
  defaultSplittingOptions,
  onSave,
}: {
  participants: { id: string; name: string }[]
  defaultSplittingOptions?: SplittingOptions | null
  onSave: (values: SplittingOptions) => Promise<void>
}) {
  const t = useTranslations('GroupForm')
  const tDefault = useTranslations('GroupForm.DefaultSplitting')

  const defaultValues: SplittingOptions = {
    splitMode: 'BY_SHARES',
    paidFor: participants.map((p) => {
      const existing = defaultSplittingOptions?.paidFor?.find(
        (pf) => pf.participant === p.id,
      )
      return { participant: p.id, shares: existing ? existing.shares : 1 }
    }),
  }

  const form = useForm<SplittingOptions>({
    resolver: zodResolver(splittingOptionsSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [participants, defaultSplittingOptions])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSave(values)
        })}
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{tDefault('title')}</CardTitle>
            <CardDescription>{tDefault('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {participants.map((participant, index) => (
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
                            min={1}
                            step={1}
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

import { derived, get, writable } from 'svelte/store'
import * as v from 'valibot'

type FormActionProps<TSchema extends v.GenericSchema> = {
  schema: TSchema
  defaultValues?: Partial<v.InferOutput<TSchema>>
  onSubmit?: ({
    value,
    reset
  }: {
    value: v.InferOutput<TSchema>
    reset: () => void
  }) => Promise<void>
}

export function useForm<
  TSchema extends v.GenericSchema,
  TFields extends string = keyof v.InferInput<TSchema> & string
>({ defaultValues = {}, ...opts }: FormActionProps<TSchema>) {
  const values = writable<v.InferOutput<TSchema>>({ ...defaultValues })
  const errors = writable<Partial<Record<TFields, string>>>({})
  const isSubmitting = writable(false)
  const isValid = derived(errors, $errors => Object.keys($errors).length === 0)

  function validate() {
    const parseResult = v.safeParse(opts.schema, get(values))
    if (parseResult.success) {
      errors.set({})
      return true
    }

    const flatErrors = v.flatten(parseResult.issues)
    const newErrors = Object.entries(flatErrors.nested!).reduce(
      (errors, [field, messages]) => {
        if (messages) {
          errors[field] = messages.join('. ')
        }
        return errors
      },
      {} as Record<string, string>
    )

    errors.set(newErrors)
    return false
  }

  function reset() {
    values.set(defaultValues)
    errors.set({})
  }

  async function handleSubmit() {
    if (validate()) {
      isSubmitting.set(true)
      try {
        await opts.onSubmit?.({
          reset,
          value: get(values)
        })
        isSubmitting.set(false)
      } catch (error) {
        isSubmitting.set(false)
        throw error
      }
    }
  }

  return {
    values,
    errors,
    reset,
    handleSubmit,
    isValid,
    isSubmitting
  }
}

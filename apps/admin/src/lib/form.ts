import { derived, get, writable } from "svelte/store"
import * as v from "valibot"

type FormActionProps<T extends v.GenericSchema> = {
  schema: T
  defaultValues?: Partial<v.InferOutput<T>>
  onSubmit?: ({ value, reset }: { value: v.InferOutput<T>, reset: () => void }) => Promise<void>
}

export function useForm<
  Schema extends v.GenericSchema,
  Fields extends string = keyof v.InferInput<Schema> & string
>({ defaultValues = {}, ...opts }: FormActionProps<Schema>) {
  const values = writable<v.InferOutput<Schema>>({ ...defaultValues })
  const errors = writable<Partial<Record<Fields, string>>>({})
  const isSubmitting = writable(false)
  const isValid = derived(errors, $errors => Object.keys($errors).length === 0)

  function validate() {
    const parseResult = v.safeParse(opts.schema, get(values))
    if (parseResult.success) {
      errors.set({})
      return true
    }

    const flatErrors = v.flatten(parseResult.issues)
    const newErrors = Object.entries(flatErrors.nested!).reduce((errors, [field, messages]) => {
      if (messages) {
        errors[field] = messages.join('. ')
      }
      return errors
    }, {} as Record<string, string>)

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

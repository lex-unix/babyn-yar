import { unpack, type MaybeGetter } from './runes'

type UseIntersectOptions = Omit<IntersectionObserverInit, 'root'> & {
  root?: MaybeGetter<HTMLElement | null | undefined>
}

export function useIntersect(
  node: MaybeGetter<HTMLElement | null | undefined>,
  callback: VoidFunction,
  options: UseIntersectOptions = {}
) {
  const { root, rootMargin = '0px', threshold = 0.1 } = options
  let observer: IntersectionObserver | undefined

  const unsub = $effect.root(() => {
    $effect(() => {
      const target = unpack(node)
      if (!target) return
      observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            callback()
          }
        },
        {
          root: unpack(root),
          threshold,
          rootMargin
        }
      )

      observer.observe(target)

      return () => {
        observer?.disconnect()
      }
    })
  })

  $effect(() => {
    return () => {
      unsub()
    }
  })
}

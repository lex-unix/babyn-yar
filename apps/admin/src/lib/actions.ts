type ClickOutsideParams = {
  cb: () => void
}
export function clickOutside(node: HTMLElement, { cb }: ClickOutsideParams) {
  function handleClick(e: MouseEvent) {
    if (node && !node.contains(e.target as Node) && !e.defaultPrevented) {
      cb()
    }
  }

  window.addEventListener('click', handleClick)

  return {
    destroy() {
      window.removeEventListener('click', handleClick)
    }
  }
}

type InfiniteScrollParams = {
  root?: HTMLElement
  rootMargin?: string
  threshold?: number
  onIntersect?: () => void
}

export function infiniteScroll(
  node: HTMLElement,
  params: InfiniteScrollParams
) {
  let observer: IntersectionObserver
  const setupObserver = () => {
    if (observer) {
      observer.disconnect()
    }
    observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (params.onIntersect) {
            params.onIntersect()
          }
        }
      },
      {
        root: params.root,
        rootMargin: params.rootMargin || '0px 0px 300px 0px',
        threshold: params.threshold || 0.1
      }
    )
    observer.observe(node)
  }

  setupObserver()

  return {
    update() {
      setupObserver()
    },

    destroy() {
      if (observer) {
        observer.disconnect()
      }
    }
  }
}

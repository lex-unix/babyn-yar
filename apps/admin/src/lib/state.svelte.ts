function createMobileDrawerState() {
  let open = $state(false)

  return {
    get isOpen() {
      return open
    },
    set isOpen(v: boolean) {
      open = v
    },
    open() {
      open = true
    },
    close() {
      open = false
    }
  }
}

export const mobileDrawer = createMobileDrawerState()

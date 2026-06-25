export function useLoadingDelay(defaultMs = 700, startLoading = false) {
  // startLoading defaults to false so callers explicitly trigger loading when desired.
  const isLoading = ref(startLoading)
  let timer: ReturnType<typeof setTimeout>

  function trigger(ms = defaultMs) {
    clearTimeout(timer)
    isLoading.value = true
    timer = setTimeout(() => { isLoading.value = false }, ms)
  }

  onUnmounted(() => clearTimeout(timer))

  return { isLoading, trigger }
}

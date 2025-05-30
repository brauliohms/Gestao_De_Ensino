export async function fakeSendSuccess(message?: string | unknown, timeout?: number) {
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      console.info('fakeSendSuccess', message)
      resolve()
    }, timeout),
  )
}

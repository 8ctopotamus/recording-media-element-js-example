let intervalId 

let shouldKeepWaiting = true

const waitInterval = (maxDuration) => new Promise((resolve, reject) => {
  let countdown = maxDuration / 1000
  
  intervalId = setInterval(() => {
    if (countdown <= 0 || !shouldKeepWaiting) {
      resolve()
    }
    countdown--
  }, 1000)
})

;(async () => {
  const intervalDone = await waitInterval(10000)
  
  console.log(intervalDone)

  process.exit(0)
})()




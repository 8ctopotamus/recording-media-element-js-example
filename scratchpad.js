let intervalId 

let shouldKeepWaiting = true

const waitInterval = (maxDuration) => new Promise((resolve, reject) => {
  let countdown = maxDuration / 1000
  
  intervalId = setInterval(() => {
    if (countdown <= 0 || !shouldKeepWaiting) {
      clearInterval(intervalId)
			resolve()
    }
		console.log(countdown, shouldKeepWaiting)
    countdown--
  }, 1000)
})

waitInterval(10000).then(() => {
	console.log('Interval done.') 
	process.exit(0)
})

setInterval(() => {
	shouldKeepWaiting = false
}, 2000)



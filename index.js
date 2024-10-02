const preview = document.getElementById('preview')
const recording = document.getElementById('recording')
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const downloadButton = document.getElementById('downloadButton')
const logElement = document.getElementById('log')

const recordingTimeMS = 5000
let countdown = 5
let intervalId

function log(msg) {
  logElement.innerText += `${msg}\n`
}

function wait(delayInMs) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}

function timer() {
  countdown = 5
  clearTimeout(intervalId)
  intervalId = setInterval(() => {
    countdown--
    log(`${countdown}s`)
    if (countdown <= 0) {
      clearTimeout(intervalId)
    }
  }, 1000)
}

function startRecording(stream, lengthTimeMS) {
  // play preview in video el
  recording.srcObject = stream
  recording.load()
  recording.play()


  // record
  const recorder = new MediaRecorder(stream)
  const data = []

  recorder.ondataavailable = (event) => data.push(event.data)
  recorder.start()
  log(`${recorder.state} for ${lengthTimeMS / 1000} seconds...`)
  timer()

  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve
    recorder.onerror = event => reject(event.name)
  })

  const recorded = wait(lengthTimeMS).then(() => {
    if (recorder.state === 'recording') {
      recorder.stop()
    }
  })

  return Promise.all([stopped, recorded]).then(() => data)
}

function stop(stream) {
  stream?.getTracks()?.forEach(track => track.stop())
}

const handleStartButtonClick = () => 
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(stream => startRecording(stream, recordingTimeMS))
    .then(recordedChunks => {
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' })
      recording.src = URL.createObjectURL(recordedBlob)
      downloadButton.href = recording.src
      downloadButton.download = 'recorded-video.webm'
      log(`Successfully recorded ${recordedBlob.size} bytes ${recordedBlob.type} media.`)
    })
    .catch(error => {
      if (error.name === 'NotFoundError') {
        log('Camera or microphone not found. Can\'t record.')
      } else {
        log(error)
      }
    })

const handleStopButtonClick = () => stop(preview.srcObject)

startButton.addEventListener('click', handleStartButtonClick, false)
stopButton.addEventListener('click', handleStopButtonClick, false)
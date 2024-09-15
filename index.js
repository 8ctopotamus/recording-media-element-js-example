const preview = document.getElementById("preview");
const recording = document.getElementById("recording");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const downloadButton = document.getElementById("downloadButton");
const logElement = document.getElementById("log");

const lengthTimeMS = 5000;
const recordingTimeMS = 5000;

function log(msg) {
  logElement.innerText += `${msg}\n`
}

function wait(delayInMs) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}

function startRecording(stream, lengthTimeMS) {
  const recorder = new MediaRecorder(stream)
  const data = []

  recorder.ondataavailable = (event) => data.push(event.data)
  recorder.start()
  log(`${recorder.state} for ${lengthTimeMS / 1000} seconds...`)

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
  stream.getTracks().forEach(track => track.stop())
}
const videoEl = document.querySelector('#video');
const constraints = { video: { facingMode: 'environment' } };
const detector = new Detector(canvas, { fastModel: true, debug: true });

detector.detect(videoEl);

window.navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    window.stream = stream;
    videoEl.srcObject = stream;
  })
  .catch(console.error);

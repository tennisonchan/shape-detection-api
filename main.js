const videoEl = document.querySelector('#video');
const constraints = { video: { facingMode: 'environment' } };
const detector = new Detector(canvas, { fastModel: true, debug: true });

function greyscale(imageData) {
  let { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    let avg = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  return imageData;
}

function imageDataToCanvas(imageData) {
  let c = document.createElement('canvas');
  c.width = imageData.width;
  c.height = imageData.height;
  ctx = c.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  return c;
}

detector.detect(videoEl).processFace((faces, context, source) => {
  faces.forEach(({ boundingBox, landmarks }) => {
    let { x, y, width, height } = boundingBox;
    context.drawImage(source, 0, 0, source.videoWidth, source.videoHeight);
    let faceImageData = greyscale(context.getImageData(x, y, width, height));
    context.drawImage(imageDataToCanvas(faceImageData), 0, 0, faceImageData.width, faceImageData.height, 0, 0, 50, 50);
  });
});

window.navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    window.stream = stream;
    videoEl.srcObject = stream;
  })
  .catch(console.error);

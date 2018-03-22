// imgSource
// <video/>

class Detector {
  constructor(canvas, options) {
    if (window.FaceDetector == undefined) {
      console.error('Face Detection not supported on this platform');
      return null;
    }
    const { fastMode, maxDetectedFaces, debug } = options;
    this.debug = debug;
    this.faceDetector = new FaceDetector({ fastMode, maxDetectedFaces });
    this.view = new DetectorView(canvas);
  }

  detect(imgSource) {
    if (this.debug) {
      this.faceDetectionHandler = this.view.processFace.bind(this.view, imgSource);
    }
    this.connectTo(imgSource, this.view.context);

    return this;
  }

  processFace(fn) {
    this.faceDetectionHandler = fn;
  }

  connectTo(video, context) {
    video.onloadedmetadata = () => {
      context.canvas.width = video.videoWidth;
      context.canvas.height = video.videoHeight;
    };

    video.onplay = () => {
      requestAnimationFrame(this.renderCanvas.bind(this, video, context));
    };
  }

  renderCanvas(source, context) {
    this.faceDetector
      .detect(source)
      .catch(console.error)
      .then(detectedFaces => {
        if (typeof this.faceDetectionHandler === 'function') {
          this.faceDetectionHandler(detectedFaces, context);
        }
      });

    requestAnimationFrame(this.renderCanvas.bind(this, source, context));
  }
}

class DetectorView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  processFace(source, detectedFaces, context) {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    detectedFaces.forEach(({ boundingBox, landmarks }) => {
      let { x, y, width, height } = boundingBox;
      this.context.drawImage(source, 0, 0, source.videoWidth, source.videoHeight);
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.rect(x, y, width, height);
      this.context.stroke();

      landmarks.forEach(({ location: { x, y }, type }) => {
        this.context.beginPath();
        this.context.font = '14px arial,sans-serif';
        this.context.fillStyle = 'red';
        this.context.arc(x, y, 3, 0, 2 * Math.PI);
        this.context.fillText(type, x + 5, y - 10);
        this.context.fill();
      });
    });
  }
}

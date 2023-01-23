export const isValidUrl = value => {
  const urlregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  return urlregex.test(value)
}

export const getRandomInt = max => Math.floor(Math.random() * max)

export const getImageDimensions = file => new Promise(resolve => {
  const dataURL = window ? window.URL.createObjectURL(file) : null
  const img = new Image()
  img.onload = () => {
    resolve({
      height: img.height,
      width: img.width
    })
  }
  img.src = dataURL
})

export const getResizedImage = ({ file, imageMaxSize }) =>
  resizeImage({ file, width: imageMaxSize, height: imageMaxSize })

export const resizeImage = ({ file, width, height }) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = function() {
      var image = new Image();
          image.src = reader.result;

      image.onload = function() {
        var maxWidth = width,
            maxHeight = height,
            imageWidth = image.width,
            imageHeight = image.height;

        if (imageWidth > imageHeight) {
          if (imageWidth > maxWidth) {
            imageHeight *= maxWidth / imageWidth;
            imageWidth = maxWidth;
          }
        }
        else {
          if (imageHeight > maxHeight) {
            imageWidth *= maxHeight / imageHeight;
            imageHeight = maxHeight;
          }
        }

        var canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

        resolve(canvas.toDataURL())
      }
    }

    reader.readAsDataURL(file)
  })

// Load the pre-trained ResNet50 model
const model = await tf.loadLayersModel('model.json');

// Function to preprocess the image and make predictions
async function classifyImage() {
  const inputElement = document.getElementById('image-upload');
  const file = inputElement.files[0];

  const img = new Image();
  const reader = new FileReader();

  reader.onload = function(e) {
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 224, 224);
      const imageData = ctx.getImageData(0, 0, 224, 224);

      const tensor = tf.browser.fromPixels(imageData).expandDims();
      const processedTensor = tf.keras.applications.resnet50.preprocessInput(tensor);

      const preds = model.predict(processedTensor);
      const decodedPreds = tf.keras.applications.resnet50.decodePredictions(preds)[0];

      // Display the predictions
      const predictionDisplay = document.getElementById('predictions');
      predictionDisplay.innerHTML = '';

      decodedPreds.forEach((item) => {
        const label = item[1];
        const probability = item[2] * 100;
        const prediction = document.createElement('p');
        prediction.innerHTML = `${label}: ${probability.toFixed(2)}%`;
        predictionDisplay.appendChild(prediction);
      });
    }

    img.src = e.target.result;
  }

  reader.readAsDataURL(file);
}

// Handle image upload
const imageUpload = document.getElementById('image-upload');
imageUpload.addEventListener('change', classifyImage);

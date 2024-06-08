document.addEventListener("DOMContentLoaded", () => {
  const selectButton = document.querySelector(".select-button");
  const dragAndDropDiv = document.querySelector(".drag-and-drop");
  let uploadedImageFile;
  let canvas, fabricImage;

  selectButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        uploadedImageFile = file;
        displayImage(file);
      }
    };
    input.click();
  });

  dragAndDropDiv.addEventListener("dragenter", preventDefault);
  dragAndDropDiv.addEventListener("dragover", preventDefault);
  dragAndDropDiv.addEventListener("dragleave", preventDefault);
  dragAndDropDiv.addEventListener("drop", handleDrop);

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadedImageFile = file;
      displayImage(file);
    }
  }

  function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Uploaded Image";
      img.className = "uploaded-image";

      const dragAndDropDiv = document.querySelector(".drag-and-drop");

      dragAndDropDiv.innerHTML = "";

      dragAndDropDiv.appendChild(img);

      const submitButton = document.createElement("button");
      submitButton.innerHTML = "Submit";
      submitButton.className = "submit-button";
      dragAndDropDiv.appendChild(submitButton);

      submitButton.addEventListener("click", () => {
        removeBackground(uploadedImageFile);
      });
    };
    reader.readAsDataURL(file);
  }

  function removeBackground(file) {
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "2hc1BbMQjgW4H6qTjD8CLjc9",
      },
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        displayEditedImage(url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function displayEditedImage(url) {
    const dragAndDropDiv = document.querySelector(".drag-and-drop");
    dragAndDropDiv.innerHTML = "";

    const editedImg = document.createElement("img");
    editedImg.src = url;
    editedImg.alt = "Edited Image";
    editedImg.className = "uploaded-image";

    dragAndDropDiv.appendChild(editedImg);

    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = "";
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "500px";
    dragAndDropDiv.appendChild(buttonContainer);

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "canvas-button";
    buttonContainer.appendChild(editButton);

    const downloadButton = document.createElement("a");
    downloadButton.href = url;
    downloadButton.download = "edited-image.png";
    downloadButton.innerHTML = "Download";
    downloadButton.className = "canvas-button";
    downloadButton.style.textDecoration = "none";
    buttonContainer.appendChild(downloadButton);

    editButton.addEventListener("click", () => createCanvas(url));
  }

  function createCanvas(imageUrl) {
    const dragAndDropDiv = document.querySelector(".drag-and-drop");
    dragAndDropDiv.innerHTML = "";

    const canvasElement = document.createElement("canvas");
    canvasElement.width = dragAndDropDiv.clientWidth;
    canvasElement.height = dragAndDropDiv.clientHeight;
    canvasElement.id = "canvas";

    dragAndDropDiv.appendChild(canvasElement);

    canvas = new fabric.Canvas("canvas");

    fabric.Image.fromURL(imageUrl, (img) => {
      fabricImage = img;
      fabricImage.scaleToWidth(canvas.width);
      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
    });

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "white";
    canvas.freeDrawingBrush.width = 50;

    const brushControls = document.createElement("div");
    brushControls.style.display = "flex";
    brushControls.style.gap = "10px";
    dragAndDropDiv.appendChild(brushControls);

    const testContainer = document.querySelector(".text");

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "172px";
    buttonContainer.style.marginLeft = "720px";
    testContainer.appendChild(buttonContainer);

    const clearButton = document.createElement("button");
    clearButton.innerHTML = "Clear";
    clearButton.className = "canvas-button";
    buttonContainer.appendChild(clearButton);

    clearButton.addEventListener("click", () => {
      canvas.clear();
      fabric.Image.fromURL(imageUrl, (img) => {
        fabricImage = img;
        fabricImage.scaleToWidth(canvas.width);
        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
      });
    });

    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save";
    saveButton.className = "canvas-button";
    buttonContainer.appendChild(saveButton);

    saveButton.addEventListener("click", () => {
      buttonContainer.innerHTML = "";
      const editedImageUrl = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      fetch(editedImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const formData = new FormData();
          formData.append("image_file", blob, "edited-image.png");
          formData.append("size", "auto");

          fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "X-Api-Key": "2hc1BbMQjgW4H6qTjD8CLjc9",
            },
            body: formData,
          })
            .then((response) => response.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              displayEditedImage(url);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
    });
  }
});

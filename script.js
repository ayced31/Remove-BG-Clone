document.addEventListener("DOMContentLoaded", () => {
  const selectButton = document.querySelector(".select-button");
  const dragAndDropDiv = document.querySelector(".drag-and-drop");
  let uploadedImageFile;

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
        "X-Api-Key": "WSy6pEi4HpVZQr72k6fiE5wj",
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

    const downloadButton = document.createElement("a");
    downloadButton.href = url;
    downloadButton.download = "edited-image.png";
    downloadButton.innerHTML = "Download";
    downloadButton.className = "submit-button";
    downloadButton.style.textDecoration = "none";
    dragAndDropDiv.appendChild(downloadButton);
  }
});

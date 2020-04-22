import createNewElement from './createNewElement.js';
import createFileCard from './createFileCard.js';
import createRequest from './createRequest.js';

const bodyEl = document.querySelector('body');

const mainContainer = createNewElement('div', 'main-container');
const dndContainer = createNewElement('form', 'dnd-container', '<p>Drag and Drop files here or Click to Select</p>');
dndContainer.enctype = 'multipart/form-data';
dndContainer.action = '/upload';
dndContainer.method = 'POST';
const filesContainer = createNewElement('div', 'files-container');
const inputFiles = createNewElement('input', 'files-input');
inputFiles.type = 'file';
inputFiles.accept = 'image/*';
inputFiles.multiple = true;

dndContainer.appendChild(inputFiles);
mainContainer.appendChild(dndContainer);
mainContainer.appendChild(filesContainer);

bodyEl.insertBefore(mainContainer, bodyEl.firstChild);

async function reloadSavedImages() {
  const savedImagesJson = await createRequest('', 'GET');
  const savedImages = JSON.parse(savedImagesJson);
  if (savedImages.length > 0) {
    savedImages.forEach((imgName) => {
      const newFileCard = createFileCard(imgName);
      filesContainer.appendChild(newFileCard);
    });
  }
}
reloadSavedImages();

inputFiles.addEventListener('change', (event) => {
  const files = Array.from(event.currentTarget.files);
  async function addImgPreview() {
    const imgsSrcsJson = await createRequest(files, 'POST');
    const imgsSrcs = JSON.parse(imgsSrcsJson);
    if (imgsSrcs.length > 0) {
      imgsSrcs.forEach((imgSrc) => {
        const newFileCard = createFileCard(imgSrc);
        filesContainer.appendChild(newFileCard);
      });
    }
  }
  addImgPreview();
  inputFiles.value = '';
});

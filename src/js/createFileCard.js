import createNewElement from './createNewElement.js';
import createRequest from './createRequest.js';

export default function createFileCard(src) {
  const fileCard = createNewElement('div', 'file');
  const fileImg = createNewElement('img', 'file-img preview');
  const fileCardDeleteBtn = createNewElement('div', 'file-delete-btn', '&times');

  fileImg.src = `https://ahj-homework-7-3.herokuapp.com/${src}`;

  fileCard.appendChild(fileImg);
  fileCard.appendChild(fileCardDeleteBtn);

  fileCardDeleteBtn.addEventListener('click', () => {
    async function deletePreview() {
      const isDeleted = await createRequest(src, 'DELETE');
      if (isDeleted === 'deleted') {
        fileCard.remove();
      }
    }
    deletePreview();
  });
  return fileCard;
}

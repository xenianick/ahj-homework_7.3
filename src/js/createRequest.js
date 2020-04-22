export default async function createRequest(images, method) {
  const formData = new FormData();
  let url = 'https://ahj-homework-7-3.herokuapp.com/images';
  if (method === 'DELETE') {
    url = `https://ahj-homework-7-3.herokuapp.com/images/?${images}`;
  }
  let listener = 'readystatechange';
  if (method === 'POST') {
    images.forEach((image) => {
      formData.append('file', image);
    });
    listener = 'load';
  }
  const request = new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.addEventListener(listener, () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      }
    });
    if (method === 'GET' || method === 'DELETE') {
      xhr.send();
    } else {
      xhr.send(formData);
    }
  });
  const response = await request;
  return response;
}

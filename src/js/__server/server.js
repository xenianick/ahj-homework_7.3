const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const publicDir = path.join(__dirname, '/public');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));
app.use(koaStatic(publicDir));

const imagesSrcs = [];

function generateIds(images) {
  const isAllRenamed = [];
  images.forEach((image) => {
    const id = uuidv4();
    const extension = image.name.match(/(?<=\.).+$/).toString();
    const newName = `${id}.${extension}`;
    const renamed = new Promise((res) => {
      fs.copyFile(image.path, `${publicDir}/images/${newName}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(image.path);
          console.log(`${publicDir}/images/${newName}`);
          console.log('Was added');
          imagesSrcs.push(newName);
          res(newName);
        }
      });
    });
    isAllRenamed.push(renamed);
  });
  return Promise.all(isAllRenamed);
}

app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    let images = [];
    if (ctx.request.files.file.length >= 2) {
      images = Array.from(ctx.request.files.file);
    } else {
      images.push(ctx.request.files.file);
    }
    const justAddedImgs = await generateIds(images);
    ctx.response.body = justAddedImgs;
  }
  if (ctx.request.method === 'GET') {
    ctx.response.body = imagesSrcs;
  }
  if (ctx.request.method === 'DELETE') {
    const imgToDel = ctx.request.url.match(/(?<=\?).+$/).toString();
    const index = imagesSrcs.findIndex((item) => item === imgToDel);
    imagesSrcs.splice(index, 1);
    fs.unlink(`${publicDir}/images/${imgToDel}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Was deleted');
      }
    });
    ctx.response.body = 'deleted';
  }
  const origin = ctx.request.get('Origin');
  if (!origin) {
    await next();
    return;
  }
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      await next();
      return;
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);

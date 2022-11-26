const ws = require('ws');
const { 
  login, 
  registration, 
  getSchedule,
  createApplications,
  getUserApplications,
  getApplicationInfo,
  removeApplications,
  getApplications,
  changeData
} = require('./database.js');


const port = process.env.PORT || 3000;
const wss = new ws.Server({
  port,
}, () => console.log(`Server started on ${port}\n`));

let users = {};

wss.on('connection', (ws) => {
  ws.onmessage = async req => {
    let resp = '';
    const data = JSON.parse(req.data);

    if(data.func === 'login') {
      resp = await login(data.login, data.password, users, ws);
    }
    if(data.func === 'registration') {
      resp = await registration(data.login, data.password);
    }
    if(data.func === 'getSchedule') {
      resp = await getSchedule();
    }
    if(data.func === 'createApplications') {
      resp = await createApplications(data.login, data.surname, data.name, data.patronymic, data.code, data.date, data.time);
    }
    if(data.func === 'getUserApplications') {
      resp = await getUserApplications(data.login);
    }
    if(data.func === 'getApplicationInfo') {
      resp = await getApplicationInfo(data.date, data.time);
    }
    if(data.func === 'removeApplications') {
      resp = await removeApplications(data.login, data.date, data.time);
    }
    if(data.func === 'getApplications') {
      resp = await getApplications();
    }
    if(data.func === 'changeData') {
      resp = await changeData(data.password, data.oldPassword);
    }
    

    console.log(output(data)); 
    console.log(`Respond:\n${resp.trim()}\n`);
    ws.send(resp);
  };

  ws.onclose = () => {
    const login = getLogin(users, ws);
    if(login) {
      delete users[login];
      if(login === 'admin') {
        console.log(`Admin is disconnected.\n`);
      }
      else {
        console.log(`User ${login} is disconnected.\n`);
      }
    }
  }
});

function output(data) {
  console.log('New request:');
  for(let key in data) {
    if(!data[key]) delete data[key]
  }
  return data;
}

function getLogin(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

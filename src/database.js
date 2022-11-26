const { getData, setData, removeData } = require('./firebase');


async function login(login, password, users, ws) {
    if(Object.keys(users).includes(login)) return 'user_logined';
    let response = '';
    const data = await getData(`Users/${login}`);
    if(data) {
        if(data.password === password) {
            users[login] = ws;
            if(login === 'admin') {
                console.log(`Admin is connected.\n`);
                response = 'admin';
            }
            else {
                console.log(`User ${login} is connected.\n`);
                response = 'true';
            }
        }
        else {
            response = 'wrong_password'
        }
    } 
    else {
      response = 'missing_login';
    }
    return response;
}
  
async function registration(login, password) {
    let response = '';
    if(await getData(`Users/${login}`)) {
        response = 'login_exists';
    }
    else {
        let updates = {};
        updates[`Users/${login}`] = { password };
        await setData(updates);
        response = 'true';
    }
    return response;
}

async function getSchedule() {
    let response = '';
    const data = await getData(`Applications`);
    for(let key in data) {
        Object.keys(data[key]).forEach(time => response += `${key} ${time}\n`);
    }
    return response.trim();
}

async function createApplications(login, surname, name, patronymic, code, date, time) {
    surname = surname[0].toUpperCase() + surname.slice(1).toLowerCase();
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    patronymic = patronymic[0].toUpperCase() + patronymic.slice(1).toLowerCase();
    const keyDate = +date.split('.').reverse().join('');
    const keyTime = +time.split(':')[0];
    let updates = {};
    updates[`Applications/${keyDate}/${keyTime}`] = { surname, name, patronymic, code, date, time };
    await setData(updates);

    updates = {};
    const id = new Date().getTime();
    updates[`Users/${login}/Applications/${id}`] = { date, time };
    await setData(updates);
    return 'true';
}

async function getUserApplications(login) {
    let response = '';
    const data = await getData(`Users/${login}/Applications`);
    Object.values(data).reverse().forEach(item => {
        response += `${item.date} ${item.time}\n`;
    });
    return response.trim();
}

async function getApplicationInfo(date, time) {
    let response = '';
    const keyDate = date.split('.').reverse().join('');
    const keyTime = time.split(':')[0];
    const data = await getData(`Applications/${keyDate}/${keyTime}`);
    const { surname, name, patronymic, code } = data;
    response += `Прізвище: ${surname}\n`;
    response += `Ім'я: ${name}\n`;
    response += `По батькові: ${patronymic}\n`;
    response += `ІПН: ${code}\n`;
    response += `Дата: ${date}\n`;
    response += `Час: ${time}`;
    return response;
}

async function removeApplications(login, date, time) {
    const keyDate = +date.split('.').reverse().join('');
    const keyTime = +time.split(':')[0];
    await removeData(`Applications/${keyDate}/${keyTime}`);

    let id = '';
    const data = await getData(`Users/${login}/Applications`);
    for(let key in data) {
        if(data[key].date === date && data[key].time === time) id = key;
        break;
    } 
    await removeData(`Users/${login}/Applications/${id}`);
    return 'true';
}

async function getApplications() {
    let response = '';
    const data = await getData(`Applications`);
    Object.values(data).reverse().forEach(keyDate => {
        Object.values(keyDate).forEach(keyTime => response += `${keyTime.date} ${keyTime.time}\n`);    
    });
    return response.trim();
}

async function changeData(password, oldPassword) {
    let response = '';
    const data = await getData(`Users/admin`);
    if(data.password === oldPassword) {
        if(data.password !== password) {
            let updates = {};
            updates[`Users/admin`] = { password };
            await setData(updates);
            response = 'true';
        }
        else {
            response = 'Новий пароль не може співпадати із старим!';
        }
    }
    else {
        response = 'Неправильний старий пароль!';
    }
    return response;
}

module.exports = {
    login, 
    registration,
    getSchedule,
    createApplications,
    getUserApplications,
    getApplicationInfo,
    removeApplications,
    getApplications,
    changeData
};

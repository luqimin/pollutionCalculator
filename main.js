const {
    app,
    BrowserWindow,
    ipcMain,
} = require('electron');
const path = require('path');
const url = require('url');

const cityData = require('./data/area.json');

/**
 * 获取所有城市
 */
const __CITIES__ = [];
cityData.forEach(({
    value,
    areas
}) => {
    areas.forEach(({
        name,
        cities
    }) => {
        const areaCityName = name;
        cities.forEach(({
            name,
            cat
        }) => {
            __CITIES__.push({
                name,
                area: value,
                areaCityName,
                cat,
            });
        });
    });
});

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    // 然后加载应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, './public/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打开开发者工具。
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null;
    });
}

ipcMain.on('city:search', (event, arg) => {
    console.log(arg);
    console.log(cityData);
    let city;
    __CITIES__.forEach((_city) => {
        if (_city.name === arg) {
            city = _city;
            return;
        }
    });

    event.sender.send('city:result', city);
});

// 城市初始化完成
ipcMain.on('city:init', (event) => {
    event.sender.send('city:initResult', __CITIES__);
});

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow();
    }
});

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
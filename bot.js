// 注意, 运行 node bot.js 之前需要增加环境变量:  export WECHATY_PUPPET=wechaty-puppet-wechat

import { WechatyBuilder } from "wechaty";
import { QRCodeTerminal } from "wechaty-plugin-contrib";

const bot = WechatyBuilder.build({ name: "wechaty-demo" }); // get a Wechaty instance

function onScan(qrcode, status) {
  console.log(
    `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
      qrcode
    )}`
  );
}

async function onLogin(user) {
  console.log("StarterBot", "%s login", user);
  updateInfomation();
}

function onLogout(user) {
  console.log("StarterBot", "%s logout", user);
}

async function onMessage(msg) {
  console.log("StarterBot", msg.toString());
  await currentRoom.sync();
  const memberList = await currentRoom.memberAll();
  if (memberList > 498) {
    currentRoom = await getCurrentRoom();
  }
  if (currentRoom != null) {
    if (currentRoom.has(msg.contact())) {
      // 已经在群里了
      await msg.say("请去群里和我聊天哦~");
    } else {
      await msg.say("请去群里和我聊天哦~");
      wait(1000);
      await currentRoom.add(msg.contact());
    }
  }
}

async function onFriendship(friendship) {
  let logMsg;
  const fileHelper = bot.Contact.load("filehelper");
  try {
    logMsg = "received `friend` event from " + friendship.contact().name();
    await fileHelper.say(logMsg);
    console.log(logMsg);
    switch (friendship.type()) {
      case bot.Friendship.Type.Receive:
        logMsg = "verify message is: " + friendship.hello();
        wait(Math.random() * 1000 + 1000);
        console.log("before accept");
        await friendship.accept();
        console.log("after accept");
        break;
      case bot.Friendship.Type.Confirm:
        logMsg = "friend ship confirmed with " + friendship.contact().name();
        break;
    }
  } catch (e) {
    logMsg = e.message;
  }
  console.log(logMsg);
  await fileHelper.say(logMsg);
}

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);
bot.on("friendship", onFriendship);
bot.use(QRCodeTerminal({ small: true }));
await bot.start();

const currentRoom = null;
const roomList = null;

setInterval(updateInfomation, 60 * 1000 * 60);

async function updateInfomation() {
  console.log("start update infomation.");
  roomList = await bot.Room.findAll();
  console.log("roomList: " + roomList.toString());
}

async function getCurrentRoom() {
  for (var i = 1; i < 100; i++) {
    const name = "SOLIDWORKS学习交流群" + i;
    console.log(name);
    for (const room in roomList) {
      if (room.topic() == name) {
        const memberList = await room.memberAll();
        if (memberList.length < 498) {
          return room;
        }
      }
    }
  }
}

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

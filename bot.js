import { WechatyBuilder } from "wechaty";
import { Friendship } from "wechaty-puppet/type";

const bot = WechatyBuilder.build({ name: "wechaty-aqi" }); // get a Wechaty instance

function onScan(qrcode, status) {
  console.log(
    `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
      qrcode
    )}`
  );
}

function onLogin(user) {
  console.log("StarterBot", "%s login", user);
}

function onLogout(user) {
  console.log("StarterBot", "%s logout", user);
}

async function onMessage(msg) {
  console.log("StarterBot", msg.toString());

  if (msg.text() === "ding") {
    await msg.say("dong");
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
      case Friendship.Type.Receive:
        if (friendship.hello() === "ding") {
          logMsg = 'accepted automatically because verify messsage is "ding"';
          wait(Math.random() * 100);
          console.log("before accept");
          await friendship.accept();
          console.log("after accept");
        } else {
          logMsg =
            "not auto accepted, because verify message is: " +
            friendship.hello();
        }
        break;
      case Friendship.Type.Confirm:
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

bot.start();

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

// 调用方法；
await wait(5000);

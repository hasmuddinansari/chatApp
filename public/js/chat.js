/** @format */

const socket = io();

//element
const $msgbox = document.getElementById("msgbox");
const $form = document.querySelector("form");
const $sendBtn = document.getElementById("sendBtn");

//template

const template = document.getElementById("template").innerHTML;

//all messsages render
const messageRender = document.getElementById("messageBox");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (messages) => {
  console.log(messages);
  const html = Mustache.render(template, {
    messages: messages.text,
    createdAt: moment(messages.createdAt).format("h:mm a"),
    username,
  });
  messageRender.insertAdjacentHTML("beforeend", html);
});

function sendMsg() {
  event.preventDefault();

  //disable
  $sendBtn.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", $msgbox.value, () => {
    $msgbox.value = "";
    $msgbox.focus();
    $sendBtn.removeAttribute("disabled");
    console.log("delivered");
  });
}

//join

socket.emit("join", { username, room });

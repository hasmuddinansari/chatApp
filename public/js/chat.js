/** @format */

const socket = io();

//element
const $msgbox = document.getElementById("msgbox");
const $form = document.querySelector("form");
const $sendBtn = document.getElementById("sendBtn");
const messageRender = document.getElementById("messageBox");

//template

const template = document.getElementById("template").innerHTML;

const sideBarTemplate = document.getElementById("side_bar_template").innerHTML;

//auto scroll

const autoscroll = () => {
  // New message element
  const $newMessage = messageRender.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messageRender.offsetHeight;

  // Height of messages container
  const containerHeight = messageRender.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messageRender.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messageRender.scrollTop = messageRender.scrollHeight;
  }
};

//all messsages render

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (messages) => {
  console.log(messages);
  const html = Mustache.render(template, {
    messages: messages.text,
    createdAt: moment(messages.createdAt).format("h:mm a"),
    username: messages.username,
  });
  messageRender.insertAdjacentHTML("beforeend", html);
  autoscroll();
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

socket.on("dataRoom", ({ users, room }) => {
  let html = Mustache.render(sideBarTemplate, {
    users,
    room,
  });
  document.getElementById("sidebar").innerHTML = html;
});

//join

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

var running = false;
function send() {
  if (running == true) return;
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  running = true;
  addMsg(msg);
  //DELEAY MESSAGE RESPOSE Echo
  window.setTimeout(function () {
    var response = generateResponse(msg);
    addResponseMsg(response);
  }, 1000);
  }
function addMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  //SEND MESSAGE TO API
  document.getElementById("message").value = "";
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
}
function generateResponse(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("hai") || msg.includes("hello")) {
    return "Halo juga! Ada yang bisa saya bantu?";
  } else if (msg.includes("siapa kamu")) {
    return "Saya Digi Ai, asisten virtual kamu!";
  } else if (msg.includes("apakah kamu memiliki kecerdasan")) {
    return "Saya memiliki kecerdasan tetapi saya belum memiliki otak!";
  } else if (msg.includes("terima kasih")) {
    return "Sama-sama!";
  } else {
    return "Maaf, saya belum ngerti maksudnya. 😅";
  }
}

function addResponseMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML = "<div class='chat-message-received'>" + msg + "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
  running = false;
}
document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
});
 document.getElementById("chatbot_toggle").onclick = function () {
    if (document.getElementById("chatbot").classList.contains("collapsed")) {
      document.getElementById("chatbot").classList.remove("collapsed")
      document.getElementById("chatbot_toggle").children[0].style.display = "none"
      document.getElementById("chatbot_toggle").children[1].style.display = ""
      setTimeout(addResponseMsg,1000,"Hi")
    }
    else {
      document.getElementById("chatbot").classList.add("collapsed")
      document.getElementById("chatbot_toggle").children[0].style.display = ""
      document.getElementById("chatbot_toggle").children[1].style.display = "none"
    }
  }

import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") element.textContent = "";
  }, 300);
}

function type(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else clearInterval(interval);
  }, 20);
}

function uniqueID() {
  const timeStamp = Date.now();
  const RandomNo = Math.random();
  const hexadecimalNumber = RandomNo.toString(16);

  return `id - ${timeStamp}-${hexadecimalNumber}`;
}

function Chat(isAI, value, ID) {
  return `
   <div class="wrapper ${isAI && "ai"}">
     <div class="chat">
       <div class="profile">
         <img src="${isAI ? bot : user}"
          alt = "${isAI ? "bot" : "user"}"
         />
       </div>
       <div class="message" id="${ID}">${value}</div>
     </div>
   </div>
   `;
}

const handelSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += Chat(false, data.get("prompt"));
  form.reset();

  const newID = uniqueID();
  console.log(newID);
  chatContainer.innerHTML += Chat(true, " ", newID);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(newID);
  console.log(messageDiv);
  loader(messageDiv);


 console.log(data.get("prompt"))
   
  const response = await fetch('https://black-gpt.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    type(messageDiv,parsedData);

  }else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
};

form.addEventListener("submit", handelSubmit)
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) handelSubmit(e);
})

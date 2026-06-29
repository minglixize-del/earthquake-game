// ===== 地図 =====
const map = L.map('map').setView([36.36, 138.33], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap'
}).addTo(map);

// ===== 状態 =====
let started = false;
let earthquakeStarted = false;
let life = 3;

// ライフ表示
const lifeBox = document.createElement("h2");
lifeBox.innerHTML = "❤️❤️❤️";
document.body.insertBefore(lifeBox, document.getElementById("map"));

function updateLife() {
lifeBox.innerHTML = "❤️".repeat(life) + "🤍".repeat(3 - life);

if (life <= 0) {
alert("💀 ゲームオーバー！");
location.reload();
}
}

function miss(message) {
life--;
updateLife();
alert(message);
}

// ===== 家 =====
const home = L.marker([36.36, 138.33]).addTo(map);
home.bindPopup("🏠 あなたの家");

home.on("click", function () {
if (started) return;

started = true;
alert("🏃 避難開始！『🚨地震発生』を押してください。");
});

// ===== 避難所 =====
const shelter = L.marker([36.37, 138.34]).addTo(map);
shelter.bindPopup("🏫 避難所");

shelter.on("click", function () {

if (!started) {
miss("🏠 まず家をクリックしてください！");
return;
}

if (!earthquakeStarted) {
miss("🚨 地震がまだ発生していません！");
return;
}

alert("🎉 避難成功！！");
});

// ===== ルート =====
let route = L.polyline([
[36.36,138.33],
[36.37,138.34]
],{
color:"blue",
weight:5
}).addTo(map);

// ===== 地震 =====
function earthquake(){

if(!started){
miss("🏠 まず家をクリックしてください！");
return;
}

if(earthquakeStarted){
return;
}

earthquakeStarted=true;

route.setStyle({
color:"red",
dashArray:"10"
});

const events=[
"🌉 橋が崩落しました！",
"🚧 道路が通行止めになりました！",
"⛰️ 土砂崩れが発生しました！"
];

const event=events[Math.floor(Math.random()*events.length)];

alert(event+"\n別ルートを考えてください！");
}
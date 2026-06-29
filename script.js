// 東御市を表示
const map = L.map('map').setView([36.36,138.33],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

// 家
const home=L.marker([36.36,138.33]).addTo(map);
home.bindPopup("🏠 あなたの家");

// 避難所
const shelter=L.marker([36.37,138.34]).addTo(map);
shelter.bindPopup("🏫 避難所");

// 避難ルート
let route=L.polyline([
[36.36,138.33],
[36.37,138.34]
],{
color:"blue",
weight:5
}).addTo(map);

// 地震
function earthquake(){

route.setStyle({
color:"red",
dashArray:"10"
});

const events=[
"橋が崩落しました！",
"道路が通行止めになりました！",
"土砂崩れが発生しました！"
];

const event=events[Math.floor(Math.random()*events.length)];

alert("🚨 "+event+"\n新しい避難ルートを考えてください！");
}
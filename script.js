// =========================
// 東御市 防災チャレンジ Ver.2
// 前半
// =========================

// 東御市中心
const map = L.map('map').setView([36.359, 138.330], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

// -----------------------
// ゲームデータ
// -----------------------

let homeMarker = null;
let life = 3;
let score = 0;
let gameStarted = false;
let dangerShelter = null;
let roadBlock = null;
// -----------------------
// 避難所
// （あとで本物の座標に変更）
// -----------------------

const shelters = [

{
name:"田中小学校",
lat:36.360,
lng:138.327
},

{
name:"和小学校",
lat:36.350,
lng:138.340
},

{
name:"東部中学校",
lat:36.366,
lng:138.347
},

{
name:"東御市ふれあい体育館",
lat:36.324,
lng:138.340
}

];

// -----------------------
// 避難所を表示
// -----------------------

shelters.forEach(shelter=>{

const marker=L.marker([shelter.lat,shelter.lng]).addTo(map);

marker.bindPopup("🏫 "+shelter.name);

marker.on("click",function(){

if(!gameStarted){

alert("まず地震を発生させてください！");

return;

}

chooseShelter(shelter);

});

});

// -----------------------
// 家を置く
// -----------------------

map.on("click",function(e){

if(homeMarker){

map.removeLayer(homeMarker);

}

homeMarker=L.marker(e.latlng).addTo(map);

homeMarker.bindPopup("🏠 あなたの家").openPopup();

document.getElementById("status").innerHTML="🏠 自宅を設定しました！";

document.getElementById("earthquakeBtn").disabled=false;

});

// -----------------------
// 地震発生
// -----------------------

function earthquake(){

gameStarted=true;

const random=Math.floor(Math.random()*shelters.length);

dangerShelter=shelters[random];

document.getElementById("message").innerHTML=

document.getElementById("message").innerHTML =
"🚨 地震発生！<br><br>" +
"道路の一部が通行止めになりました。<br><br>" +
"地図を確認し、安全な避難所を選択してください。";

// 古い通行止めを消す
if (roadBlock) {
map.removeLayer(roadBlock);
}

// ランダムな赤い通行止め
roadBlock = L.polyline(
[
[36.3575,138.3330],
[36.3605,138.3385]
],
{
color:"red",
weight:7
}
).addTo(map);
}
// -----------------------
// 避難所を選ぶ
// -----------------------
function chooseShelter(shelter){

if(shelter.name === dangerShelter.name){
life--;
document.getElementById("life").textContent = life;
document.getElementById("message").innerHTML =
"❌ " + shelter.name + "へ向かう道路は通行止めでした！<br><br>" +
"ライフが1減りました。";

if(life <= 0){
alert("ゲームオーバー！");
restartGame();
}

} else {
score += 100;
document.getElementById("score").textContent = score;
document.getElementById("message").innerHTML =
"🎉 避難成功！<br><br>" +
shelter.name +
"へ安全に避難できました！<br><br>" +
"💡 防災アドバイス：災害時は最寄りではなく、安全な避難所を選ぶことも大切です。";

gameStarted = false;
}
}

// -----------------------
// AIおすすめ避難所
// -----------------------
function recommendShelter(){
let candidates = shelters.filter(s => s.name !== dangerShelter.name);
let recommendation = candidates[0];

document.getElementById("message").innerHTML +=
"<hr>" +
"🤖 <b>AIおすすめ避難所</b><br>" +
recommendation.name +
"<br><br>" +
"理由<br>" +
"・通行止めを回避できます。<br>" +
"・安全に避難できる可能性が高いです。";
}

// -----------------------
// リスタート
// -----------------------
function restartGame(){
life = 3;
score = 0;
gameStarted = false;
dangerShelter = null;

document.getElementById("life").textContent = life;
document.getElementById("score").textContent = score;
document.getElementById("message").innerHTML = "";
document.getElementById("status").innerHTML = "📍 地図をクリックして、自宅を設定してください。";
document.getElementById("earthquakeBtn").disabled = true;

if(homeMarker){
map.removeLayer(homeMarker);
homeMarker = null;
}
}


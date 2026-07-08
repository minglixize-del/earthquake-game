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

let roadBlocks = [];
let blockedShelters = [];
let nearestShelter = null;
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

const roadPatterns = [

{
blockedShelter:"田中小学校",
lines:[
[[36.3590,138.3270],[36.3605,138.3300]],
[[36.3565,138.3340],[36.3585,138.3370]]
]
},

{
blockedShelter:"東部中学校",
lines:[
[[36.3615,138.3235],[36.3635,138.3275]],
[[36.3545,138.3395],[36.3575,138.3425]]
]
},

{
blockedShelter:"東御市ふれあい体育館",
lines:[
[[36.3600,138.3360],[36.3625,138.3395]],
[[36.3560,138.3265],[36.3580,138.3290]]
]
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

map.on("click", function(e){

if(homeMarker){
map.removeLayer(homeMarker);
}

homeMarker = L.marker(e.latlng).addTo(map);

homeMarker.bindPopup("🏠 あなたの家").openPopup();

document.getElementById("status").innerHTML = "🏠 自宅を設定しました！";

document.getElementById("earthquakeBtn").disabled = false;


// ===== 一番近い避難所を探す =====

let minDistance = Infinity;

nearestShelter = null;

shelters.forEach(function(shelter){

const distance = Math.sqrt(

Math.pow(e.latlng.lat - shelter.lat,2) +

Math.pow(e.latlng.lng - shelter.lng,2)

);

if(distance < minDistance){

minDistance = distance;

nearestShelter = shelter;

}

});

console.log("一番近い避難所:", nearestShelter.name);

});

// -----------------------
// 地震発生
// -----------------------

function earthquake(){

// 家が設定されているか確認
if(homeMarker == null){
alert("先に自宅を設定してください！");
return;
}

gameStarted = true;

document.getElementById("message").innerHTML =
"🚨 地震発生！<br><br>" +
"道路の一部が通行止めになりました。<br><br>" +
"地図を見て、安全な避難所を選んでください。";

// 今までの通行止めを消す
roadBlocks.forEach(block => map.removeLayer(block));
roadBlocks = [];

// 通行止め避難所をリセット
blockedShelters = [];

// 一番近い避難所は必ず通行止め
blockedShelters.push(nearestShelter.name);

// 残り3つからランダムで1つ選ぶ
const others = shelters.filter(
shelter => shelter.name !== nearestShelter.name
);

const randomShelter =
others[Math.floor(Math.random() * others.length)];

blockedShelters.push(randomShelter.name);

// 家の位置
const home = homeMarker.getLatLng();

// 通行止めを描画
blockedShelters.forEach(name => {

const shelter = shelters.find(
s => s.name === name
);

drawRoadBlock(home, shelter);

});

};

function drawRoadBlock(home, shelter){

// 家と避難所の中間地点
const midLat = (home.lat + shelter.lat) / 2;
const midLng = (home.lng + shelter.lng) / 2;

// 家→避難所の向き
const dx = shelter.lng - home.lng;
const dy = shelter.lat - home.lat;

// 長さ
const length = Math.sqrt(dx * dx + dy * dy);

// 長さが0なら終了
if(length === 0) return;

// ルートと垂直方向のベクトル
const px = -dy / length;
const py = dx / length;

// 赤線の長さ（あとで調整できる）
const size = 0.0006;

// 赤線の両端
const p1 = [
midLat + py * size,
midLng + px * size
];

const p2 = [
midLat - py * size,
midLng - px * size
];

const block = L.polyline(
[p1, p2],
{
color: "red",
weight: 7
}
).addTo(map);

roadBlocks.push(block);

}

// -----------------------
// 避難所を選ぶ
// -----------------------
function chooseShelter(shelter){

if(blockedShelters.includes(shelter.name)){

    life--;
    document.getElementById("life").textContent = life;

    document.getElementById("message").innerHTML =
    "❌ この避難経路は通行止めでした！<br><br>" +
    "別の避難所を探してください。<br><br>" +
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
    "💡 防災アドバイス：災害時は最寄りではなく、道路状況も確認して避難しましょう。";

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

blockedShelters = [];
nearestShelter = null;

document.getElementById("life").textContent = life;
document.getElementById("score").textContent = score;
document.getElementById("message").innerHTML = "";
document.getElementById("status").innerHTML = "📍 地図をクリックして、自宅を設定してください。";
document.getElementById("earthquakeBtn").disabled = true;

roadBlocks.forEach(block => map.removeLayer(block));
roadBlocks = [];

if(homeMarker){
map.removeLayer(homeMarker);
homeMarker = null;
}
}


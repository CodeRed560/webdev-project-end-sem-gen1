// const pages = document.querySelectorAll(".page");
// function showPage(id){
//   pages.forEach(p=>p.classList.remove("active"));
//   document.getElementById(id).classList.add("active");
// }

// /* =======================
//    GOALS + RADAR GRAPH
// ======================= */

// const goals = [];
// const goalList = document.getElementById("goalList");
// const canvas = document.getElementById("radar");
// const ctx = canvas.getContext("2d");

// function addGoal(){
//   const name = goalName.value.trim();
//   const target = Number(goalTarget.value);
//   if(!name || !target) return;
//   goals.push({ name, target, progress: 0 });
//   goalName.value = goalTarget.value = "";
//   renderGoals();
// }

// function renderGoals(){
//   goalList.innerHTML = "";
//   goals.forEach((g,i)=>{
//     const li = document.createElement("li");
//     li.innerHTML = `
//       ${i+1}. ${g.name} (${g.progress}/${g.target})
//       <button onclick="incGoal(${i})">+</button>
//     `;
//     goalList.appendChild(li);
//   });
//   drawRadar();
// }

// function incGoal(i){
//   goals[i].progress = Math.min(goals[i].progress+1, goals[i].target);
//   renderGoals();
// }

// /* ===== TRUE POLYGON RADAR ===== */
// function drawRadar(){
//   ctx.clearRect(0,0,360,360);
//   if(goals.length < 3) return;

//   const cx=180, cy=180, maxR=130;
//   const levels = 5;
//   const n = goals.length;
//   const angleStep = (Math.PI*2)/n;

//   ctx.strokeStyle="rgba(255,255,255,0.15)";

//   // concentric polygons
//   for(let l=1;l<=levels;l++){
//     ctx.beginPath();
//     for(let i=0;i<n;i++){
//       const a = angleStep*i - Math.PI/2;
//       const r = (maxR/levels)*l;
//       const x = cx + Math.cos(a)*r;
//       const y = cy + Math.sin(a)*r;
//       i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
//     }
//     ctx.closePath();
//     ctx.stroke();
//   }

//   // axes
//   goals.forEach((_,i)=>{
//     const a = angleStep*i - Math.PI/2;
//     ctx.beginPath();
//     ctx.moveTo(cx,cy);
//     ctx.lineTo(cx+Math.cos(a)*maxR, cy+Math.sin(a)*maxR);
//     ctx.stroke();
//   });

//   // data polygon
//   ctx.beginPath();
//   goals.forEach((g,i)=>{
//     const a = angleStep*i - Math.PI/2;
//     const ratio = g.progress/g.target;
//     const x = cx + Math.cos(a)*maxR*ratio;
//     const y = cy + Math.sin(a)*maxR*ratio;
//     i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
//   });
//   ctx.closePath();
//   ctx.fillStyle="rgba(236,72,153,0.35)";
//   ctx.strokeStyle="#ec4899";
//   ctx.fill();
//   ctx.stroke();
// }

// /* =======================
//    CALENDAR + DAY VIEW
// ======================= */

// const calendar=document.getElementById("calendar");
// const dailyLog={};

// for(let d=1;d<=30;d++){
//   const div=document.createElement("div");
//   div.className="day";
//   div.textContent=d;
//   div.onclick=()=>openDay(d);
//   calendar.appendChild(div);
// }

// function openDay(d){
//   dayTitle.textContent="Day "+d;
//   const data = dailyLog[d] || { goals: goals.length };
//   dayData.textContent=`Active goals: ${data.goals}`;
//   document.getElementById("dayView").classList.remove("hidden");
// }

// function closeDay(){
//   document.getElementById("dayView").classList.add("hidden");
// }

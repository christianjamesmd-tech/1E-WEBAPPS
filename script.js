// OMSU PORTAL - STUDENT + ADMIN JAVASCRIPT

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const defaultData = {
  announcements: [
    {id: 1, title: "Welcome to the OMSU Student Portal!", text: "Use this portal to easily access important school information, announcements, requirements, and dates.", date: "2026-10-03"},
    {id: 2, title: "Submission of Enrollment Requirements", text: "Students are reminded to submit their required documents before the announced deadline.", date: "2026-10-03"},
    {id: 3, title: "Student Portal Orientation", text: "An orientation will be conducted to introduce students to the portal and its features.", date: "2026-10-07"}
  ],
  requirements: [
    {id: 1, title: "School ID", text: "Valid student identification card.", status: "Required"},
    {id: 2, title: "Registration Form", text: "Current semester registration or enrollment form.", status: "Required"},
    {id: 3, title: "Certificate of Registration", text: "Official proof of current enrollment.", status: "Required"},
    {id: 4, title: "Statement of Billing", text: "Billing document when required for school transactions.", status: "Check Office"}
  ],
  dates: [
    {id: 1, title: "Requirements Submission", text: "Deadline for submitting required documents.", date: "2026-10-05"},
    {id: 2, title: "Portal Orientation", text: "Introduction to the student portal.", date: "2026-10-07"},
    {id: 3, title: "Academic Activity", text: "Check the official announcement for details.", date: "2026-10-15"}
  ]
};

function getData() {
  const saved = localStorage.getItem("omsuPortalData");
  if (!saved) {
    localStorage.setItem("omsuPortalData", JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
  return JSON.parse(saved);
}
function saveData(data) { localStorage.setItem("omsuPortalData", JSON.stringify(data)); }
function getUser() { return JSON.parse(localStorage.getItem("omsuUser") || "null"); }
function logout() {
  localStorage.removeItem("omsuLoggedIn");
  localStorage.removeItem("omsuAdmin");
  window.location.href = "login.html";
}
function isLoggedIn() { return localStorage.getItem("omsuLoggedIn") === "true" || localStorage.getItem("omsuAdmin") === "true"; }

// Redirect unauthenticated dashboard/admin users
if ((location.pathname.endsWith("index.html") || location.pathname.endsWith("admin.html") || location.pathname.endsWith("/"))
    && !isLoggedIn() && !location.pathname.endsWith("login.html") && !location.pathname.endsWith("signup.html")) {
  if (!location.pathname.endsWith("login.html")) window.location.href = "login.html";
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMessage");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("omsuAdmin", "true");
      localStorage.removeItem("omsuLoggedIn");
      window.location.href = "admin.html";
      return;
    }
    const user = getUser();
    if (user && username === user.username && password === user.password) {
      localStorage.setItem("omsuLoggedIn", "true");
      localStorage.removeItem("omsuAdmin");
      window.location.href = "index.html";
      return;
    }
    msg.textContent = "Incorrect username or password.";
    msg.style.color = "#dc2626";
  });
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;
    const msg = document.getElementById("signupMessage");

    if (username.toLowerCase() === ADMIN_USERNAME) {
      msg.textContent = "That username is reserved.";
      msg.style.color = "#dc2626";
      return;
    }
    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      msg.style.color = "#dc2626";
      return;
    }
    if (password.length < 4) {
      msg.textContent = "Password must be at least 4 characters.";
      msg.style.color = "#dc2626";
      return;
    }
    localStorage.setItem("omsuUser", JSON.stringify({name, username, password}));
    msg.textContent = "Account created! Redirecting to login...";
    msg.style.color = "#15803d";
    setTimeout(() => window.location.href = "login.html", 1000);
  });
}

// Student dashboard
const user = getUser();
if (user) {
  ["studentName","profileName"].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.name; });
  const u=document.getElementById("profileUsername"); if(u) u.textContent=user.username;
  const letter=user.name.charAt(0).toUpperCase();
  ["avatar","profileAvatar"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=letter;});
}

// Render student content
function formatDate(date) {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString("en-PH", {year:"numeric", month:"long", day:"numeric"});
}
function renderStudent() {
  const data = getData();

  const annList=document.getElementById("announcementList");
  if(annList) annList.innerHTML=data.announcements.map(a=>`
    <article class="content-card announcement-item">
      <span class="announcement-icon">📢</span><div><h3>${escapeHTML(a.title)}</h3>
      <p>${escapeHTML(a.text)}</p><small>${formatDate(a.date)}</small></div>
    </article>`).join("");

  const home=document.getElementById("homeAnnouncements");
  if(home) home.innerHTML=data.announcements.slice(0,2).map(a=>`
    <div class="announcement-item" style="margin-top:18px"><span class="announcement-icon">📣</span>
    <div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.text)}</p><small>${formatDate(a.date)}</small></div></div>`).join("");

  const req=document.getElementById("requirementList");
  if(req) req.innerHTML=data.requirements.map(r=>`
    <div class="content-card requirement-card"><div class="card-icon">📋</div>
    <h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.text)}</p><span class="status">${escapeHTML(r.status)}</span></div>`).join("");

  const dates=document.getElementById("dateList");
  if(dates) dates.innerHTML=data.dates.map(d=>{
    const dt=new Date(d.date+"T00:00:00");
    const day=String(dt.getDate()).padStart(2,"0");
    const month=dt.toLocaleDateString("en-US",{month:"short"}).toUpperCase();
    return `<div class="date-card"><div class="date-box"><strong>${day}</strong><span>${month}</span></div>
    <div><h3>${escapeHTML(d.title)}</h3><p>${escapeHTML(d.text)}</p></div></div>`;
  }).join("");
}
function escapeHTML(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
renderStudent();

// Student navigation
document.querySelectorAll(".nav-link").forEach(link=>{
  link.addEventListener("click",function(){
    document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));
    this.classList.add("active");
    const title=document.getElementById("pageTitle");
    if(title) title.textContent=this.textContent.replace(/^[^\w]+/,"").trim();
    document.getElementById("sidebar")?.classList.remove("open");
  });
});
function toggleSidebar(){document.getElementById("sidebar")?.classList.toggle("open");}

// ADMIN
let editingAnn = null, editingReq = null, editingDate = null;

function checkAdmin() {
  if (location.pathname.endsWith("admin.html") && localStorage.getItem("omsuAdmin") !== "true") {
    window.location.href = "login.html";
  }
}
checkAdmin();

function renderAdmin() {
  const data=getData();
  const ann=document.getElementById("adminAnnList");
  if(ann) ann.innerHTML=data.announcements.map(a=>`
    <div class="admin-item"><div><h3>📢 ${escapeHTML(a.title)}</h3><p>${escapeHTML(a.text)}</p><small>${formatDate(a.date)}</small></div>
    <div class="admin-actions"><button class="edit-btn" onclick="editAnnouncement(${a.id})">✏️ Edit</button><button class="delete-btn" onclick="deleteAnnouncement(${a.id})">🗑️ Delete</button></div></div>`).join("");

  const req=document.getElementById("adminReqList");
  if(req) req.innerHTML=data.requirements.map(r=>`
    <div class="admin-item"><div><h3>📋 ${escapeHTML(r.title)}</h3><p>${escapeHTML(r.text)}</p><span class="status">${escapeHTML(r.status)}</span></div>
    <div class="admin-actions"><button class="edit-btn" onclick="editRequirement(${r.id})">✏️ Edit</button><button class="delete-btn" onclick="deleteRequirement(${r.id})">🗑️ Delete</button></div></div>`).join("");

  const dates=document.getElementById("adminDateList");
  if(dates) dates.innerHTML=data.dates.map(d=>`
    <div class="admin-item"><div><h3>📅 ${escapeHTML(d.title)}</h3><p>${escapeHTML(d.text)}</p><small>${formatDate(d.date)}</small></div>
    <div class="admin-actions"><button class="edit-btn" onclick="editDate(${d.id})">✏️ Edit</button><button class="delete-btn" onclick="deleteDate(${d.id})">🗑️ Delete</button></div></div>`).join("");
}
function nextId(arr){return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;}

// Announcements
function saveAnnouncement(){
  const title=document.getElementById("annTitle").value.trim(), text=document.getElementById("annText").value.trim(), date=document.getElementById("annDate").value;
  if(!title||!text||!date){alert("Please complete all announcement fields.");return;}
  const data=getData();
  if(editingAnn!==null){
    const item=data.announcements.find(x=>x.id===editingAnn);
    Object.assign(item,{title,text,date});
    editingAnn=null; document.getElementById("cancelAnn").classList.add("hidden");
  }else data.announcements.unshift({id:nextId(data.announcements),title,text,date});
  saveData(data); clearAnn(); renderAdmin();
}
function editAnnouncement(id){
  const a=getData().announcements.find(x=>x.id===id); if(!a)return;
  document.getElementById("annTitle").value=a.title;document.getElementById("annText").value=a.text;document.getElementById("annDate").value=a.date;
  editingAnn=id;document.getElementById("cancelAnn").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});
}
function deleteAnnouncement(id){if(confirm("Delete this announcement?")){const d=getData();d.announcements=d.announcements.filter(x=>x.id!==id);saveData(d);renderAdmin();}}
function clearAnn(){["annTitle","annText","annDate"].forEach(id=>document.getElementById(id).value="");}
function cancelAnnouncement(){editingAnn=null;clearAnn();document.getElementById("cancelAnn").classList.add("hidden");}

// Requirements
function saveRequirement(){
  const title=document.getElementById("reqTitle").value.trim(), text=document.getElementById("reqText").value.trim(), status=document.getElementById("reqStatus").value;
  if(!title||!text){alert("Please complete the requirement fields.");return;}
  const data=getData();
  if(editingReq!==null){Object.assign(data.requirements.find(x=>x.id===editingReq),{title,text,status});editingReq=null;document.getElementById("cancelReq").classList.add("hidden");}
  else data.requirements.unshift({id:nextId(data.requirements),title,text,status});
  saveData(data);clearReq();renderAdmin();
}
function editRequirement(id){const r=getData().requirements.find(x=>x.id===id);if(!r)return;document.getElementById("reqTitle").value=r.title;document.getElementById("reqText").value=r.text;document.getElementById("reqStatus").value=r.status;editingReq=id;document.getElementById("cancelReq").classList.remove("hidden");}
function deleteRequirement(id){if(confirm("Delete this requirement?")){const d=getData();d.requirements=d.requirements.filter(x=>x.id!==id);saveData(d);renderAdmin();}}
function clearReq(){["reqTitle","reqText"].forEach(id=>document.getElementById(id).value="");document.getElementById("reqStatus").value="Required";}
function cancelRequirement(){editingReq=null;clearReq();document.getElementById("cancelReq").classList.add("hidden");}

// Dates
function saveDate(){
  const title=document.getElementById("dateTitle").value.trim(), text=document.getElementById("dateText").value.trim(), date=document.getElementById("dateValue").value;
  if(!title||!text||!date){alert("Please complete all date fields.");return;}
  const data=getData();
  if(editingDate!==null){Object.assign(data.dates.find(x=>x.id===editingDate),{title,text,date});editingDate=null;document.getElementById("cancelDate").classList.add("hidden");}
  else data.dates.unshift({id:nextId(data.dates),title,text,date});
  saveData(data);clearDate();renderAdmin();
}
function editDate(id){const d=getData().dates.find(x=>x.id===id);if(!d)return;document.getElementById("dateTitle").value=d.title;document.getElementById("dateText").value=d.text;document.getElementById("dateValue").value=d.date;editingDate=id;document.getElementById("cancelDate").classList.remove("hidden");}
function deleteDate(id){if(confirm("Delete this important date?")){const d=getData();d.dates=d.dates.filter(x=>x.id!==id);saveData(d);renderAdmin();}}
function clearDate(){["dateTitle","dateText","dateValue"].forEach(id=>document.getElementById(id).value="");}
function cancelDate(){editingDate=null;clearDate();document.getElementById("cancelDate").classList.add("hidden");}

renderAdmin();
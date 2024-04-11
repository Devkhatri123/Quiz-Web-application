import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
 } from "./firebase.js";
let option = document.getElementById("select");
let tbody = document.getElementById("tbody");
let value = option.value; 
 let Arra = [];

let data;
async function GetAllUsersQuizInfo(Value) {
 
  let UsersCollection = collection(db, "users");
  try {
    const UsersDocsSnapshot = await getDocs(UsersCollection);
    const UsersDocs = UsersDocsSnapshot.docs;
  tbody.innerHTML = "";

   Arra = [];
   const Promises =  UsersDocs.map(async (dOC) => {
      const DocsId = dOC.id;
      console.log( Value + "Questions")
      const UserDocRef = doc(UsersCollection, DocsId);
      const NestedCollection = collection(UserDocRef, Value + "Questions");
      const QuizDoc = doc(NestedCollection, DocsId);
      const QuizDocInfo = await getDoc(QuizDoc);

      if (QuizDocInfo.exists()) {
         data = QuizDocInfo.data();
         Arra.push(data);
      }
    })
    let html;
    tbody.innerHTML = `<div id="loader"></div>`;
   await Promise.all(Promises);
   tbody.innerHTML ="";
   if(Arra.length>0){
    console.log(Math.floor(Arra[1].TimeTaken%3600)/60);
     Arra.sort((a, b) => a.TimeTaken - b.TimeTaken);
     Arra.sort((a, b) => b.score - a.score);
   Arra.forEach((val, index) => {
    let time = 90-val.TimeTaken;
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
     console.log(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padEnd(2, '0')}`)
    html = ` 
  <tbody>
        <tr>
          <td id="winner">${index + 1}</td>
          <td><p>${val.name}</p></td>
          <td>${val.score}</td>
          <td>${minutes.toString().padStart(2, '0')}:${seconds.toString().padEnd(2, '0')}</td>
        </tr>
        </tbody>
      `;
      tbody.innerHTML += html;
    });
   }else{
    tbody.innerHTML = `<h1 style="text-align: center;
    position: absolute;
    left: 0;
    right: 0;">No data</h1>`;
    console.log(h1)
   }
  } catch (error) {
    console.error(error); 
  }
}

option.addEventListener("change",async()=>{
  value = option.value; 
  console.log(value)
 await GetAllUsersQuizInfo(value)

})
// console.log(value)
await GetAllUsersQuizInfo(value);



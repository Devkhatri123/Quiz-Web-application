import {
  app,
  db,
  auth,
  collection,
  doc,
  addDoc,
  getDoc,
  get,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  FieldValue,
  set,
  push,
  onSnapshot,
  update,
} from "./firebase.js";
let option = document.getElementById("select");
let tbody = document.getElementById("tbody");
let value = option.value;
let Arra = []; // Declare array outside the function for proper accumulation

async function GetAllUsersQuizInfo() {
  let UsersCollection = collection(db, "users");
  const UsersDocs = await getDocs(UsersCollection);

  try {
    UsersDocs.forEach(async (dOC) => {
      const DocsId = dOC.id;
      const UserDocRef = doc(UsersCollection, DocsId);
      const NestedCollection = collection(UserDocRef, value + "Questions");
      const QuizDoc = doc(NestedCollection, DocsId);
      const QuizDocInfo = await getDoc(QuizDoc);

      if (QuizDocInfo.exists()) {
        const data = QuizDocInfo.data();
        Arra.push(data);
      }
    });

    // Move tbody reference outside the loop for efficiency
    const tbody = document.getElementById("tbody"); // Adjust selector if needed

    Arra.sort((a, b) => a.TimeTaken - b.TimeTaken);
    Arra.forEach((val, index) => {
      tbody.innerHTML +=`
        <tr>
          <td id="winner">${index + 1}</td>
          <td><p> ${val.name}</p></td>
          <td>${val.score}</td>
          <td>${val.TimeTaken}</td>
        </tr>
      `;
    });
    console.log(Arra)
  } catch (error) {
    // Handle errors gracefully
    console.error(error); // Log the error for debugging
  }
}

GetAllUsersQuizInfo();

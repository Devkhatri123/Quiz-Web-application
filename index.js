let quiz = document.getElementsByClassName("quiz")[0];
let next_btn = document.getElementsByClassName("next_btn")[0];
let name = document.getElementById("name");
let email = document.getElementById("email");
let pass = document.getElementById("password");
let login_btn = document.getElementsByClassName("login_btn")[0];
let emaildisplay = document.getElementsByClassName("emaildisplay")[0];
let users_options = document.getElementById("users_options");
let main = document.querySelectorAll(".a");
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

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

console.log(db);
console.log(app);
console.log(auth);

let score = 0;
var second = 0;
var minute = 0;
var hour = 0;
let NumberOfAttempts = 0;
// console.log(database);

async function GetTag(button) {
  try {
    const user = auth.currentUser;
    // console.log(user)
    if (!user) {
      alert("You are not logged in");
      return;
    }

    const confirmAnswer = window.confirm("Are you sure you want to proceed?");
    console.log(confirmAnswer);

    if (confirmAnswer) {
      const att = button.getAttribute("data-value");
      const questions = button.getAttribute("data-questions");
      let number = button.getAttribute("data-number");
      number = parseInt(number);
      const userDocRef = doc(db, "users", user.uid);
      const nestedCollectionRef = collection(userDocRef, att + "Questions"); //att + "Questions"
      const customDocumentRef = doc(nestedCollectionRef, user.uid);

      const docSnapshot = await getDoc(customDocumentRef);
      console.log(docSnapshot.exists);
      NumberOfAttempts += 1;
      const data = {
        NumberofQuestion: questions,
        name: user.displayName,
        email: user.email,
        score: score,
        NumberOfAttempts: NumberOfAttempts,
        Quiz:att,
      };

      if (!docSnapshot.exists()) {
        await setDoc(customDocumentRef, data);
        console.log("Document successfully written with custom ID");
      }
      let userDocRefData = docSnapshot.data();
      if (docSnapshot.exists()) {
        console.log(docSnapshot.data());
        let UpdateNumberOfAttempts = userDocRefData.NumberOfAttempts;
        UpdateNumberOfAttempts += 1;
        await setDoc(
          customDocumentRef,
          { NumberOfAttempts: UpdateNumberOfAttempts },
          { merge: true }
        );
      }
        window.location.href = `phpQuestion.html?category=${number}&att=${att}`;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

var user;
var timer;

// SignUp functionality
if (login_btn) {
  login_btn.addEventListener("click", (e) => {
    name = name.value;
    email = email.value;
    pass = pass.value;
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCrendtails) => {
        let user = userCrendtails.user;
        updateProfile(user, {
          displayName: name,
        });

        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          name: name,
          email: email,
        });
        // window.location.href = "index.html";
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });

    name.value = "";
    email.value = "";
    pass.value = "";
  });
}

let redirected = false;
let listenerInitialized = false;
onAuthStateChanged(auth, (user) => {
  listenerInitialized = true;
  if (user && !redirected && listenerInitialized) {
    console.log("User is signed in:", user.email, user.uid);

    if (emaildisplay) emaildisplay.textContent = user.displayName;
    emaildisplay.addEventListener("click",()=>{
      if(users_options.style.display =="none"){
      users_options.style.display = "flex";
      console.log(users_options)
      }
    else  users_options.style.display = "none";
    })

    redirected = true;
  }
});
var index = 0;
async function getQuizQuestions(category) {
  let num = parseInt(category);
  console.log(num);
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${num}&difficulty=easy&type=multiple`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
}

const myApiKey = "IFzSbBbmq4QpXOxmYllcHYGSi6q4OE06uKSMzTou";
var NewPos;
var Temp;
var time = 90; 
async function GetData() {
 let url= new URLSearchParams(window.location.search);
 let category = url.get("category");
 console.log(category)
  try {
    const data = await getQuizQuestions(category);
    if (data) {
      
      console.log("Retrieved questions:", data);
      let Array = [data.results[index].correct_answer,...data.results[index].incorrect_answers];
      for(let i = Array.length - 1; i>0;i--){
         NewPos = Math.floor(Math.random() * (i+1));
        [Array[i],Array[NewPos]] = [Array[NewPos],Array[i]];
      }
     console.log(Array)
      quiz.innerHTML = `
                <div class="quiz_top">
                    <h1>${data.results[index].category} Questions</h1>
                    <p>Time Left : <span id="hr">${time}</span></p>
                </div>
                <div class="question">
                    <h3><span>${index + 1}.</span>${
        data.results[index].question
      }</h3>
                    <div class="answer_buttons">
                        <button class="option1" id="btn" value="${
                         Array[0]
                        }">${Array[0]}</button> 
                        <button class="option1" id="btn" value="${
                          Array[3]
                        }">${Array[3]}</button> 
                        <button class="option1" id="btn" value="${
                          Array[2]
                        }">${Array[2]}</button> 
                        <button class="option1" id="btn" value="${
                          Array[1]
                        }">${Array[1]}</button>
                    </div>
                </div>
                <div class="quiz_footer">
                    <p><span>${index + 1}</span> of <span>${
        data.results.length
      }</span> Questions</p>
                    <button class="next_btn" id="next" value="clicked">Next</button>
                </div>
                `;
                var time = 90;      
     var hr = document.getElementById("hr")
      let btn = document.querySelectorAll("#btn");
    
    
      const nextButton = document.getElementById("next");
      var clickedButtonValue;
      btn.forEach((button) => {
        button.addEventListener("click", (event) => {
          clickedButtonValue = event.target.value;
          
        });
      });
      nextButton.addEventListener("click", () => {
        //console.log(btn)
        Inc(data.results[index], clickedButtonValue, data);
        console.log(clickedButtonValue);
      });
    } else {
      console.error("Element with ID 'next' not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
 //let hr = document.getElementById("hr");
var currentPageUrl = window.location.href;
if(currentPageUrl == "http://localhost:5500/" ||currentPageUrl == "http://localhost:5500/#")
console.log(currentPageUrl);
document.addEventListener(("DOMContentLoaded"),()=>{
  GetData();
  try{
   timer = setInterval(() => {
    time--;
    hr.innerHTML = time;
   if(time<=0) time = 90; 
 
},1000)
    
}catch(err){
  console.log(err)
}
})
let TimeTaken; 
async function Inc(data, button, Data) {
  console.log(Data.results.length);

  let url = new URLSearchParams(window.location.search);
  let att = url.get("att");
  index++;
  console.log(att);
  let categoryName = url.get("att");
  onAuthStateChanged(auth, (user) => {
    console.log(user);
   
    const userCollectionRef = collection(db, "users");
    const userDocRef = doc(userCollectionRef, user.uid);
   
    let DATA = [
      {
        question: data.question,
        option1: data.incorrect_answers[0],
        option2: data.incorrect_answers[1],
        option3: data.incorrect_answers[2],
        option4: data.correct_answer,
        attemptmeted: button,
      },
    ];
    const Data = DATA;

    addNewCategoryToDocument(user.uid, Data, categoryName, index);

  });
  console.log(data);
  console.log("button-value : " + button);
let documentId = auth.currentUser.uid
  if (index < Data.results.length) {
    GetData();
  } else {
    const Id = auth.currentUser.uid
    const userCollectionRef = collection(db, "users");
    const userDocRef = doc(userCollectionRef, Id);
    const nestedCollectionRef = collection(
      userDocRef,
      categoryName + "Questions"
    );
    const customDocumentRef = doc(nestedCollectionRef, Id);
    TimeTaken = 90-time;
    console.log(TimeTaken)
    clearInterval(timer)
    await setDoc(customDocumentRef,{TimeTaken:TimeTaken},{merge:true});
    DisplayResult(att, Data);
  }
}

async function addNewCategoryToDocument(
  documentId,
  newCategory,
  categoryName,
  Index
) {
  try {
    // Construct the document reference
    const userDocRef = doc(db, "users", documentId);
    const nestedCollectionRef = collection(
      userDocRef,
      categoryName + "Questions"
    );
    const customDocumentRef = doc(nestedCollectionRef, documentId);

    // Retrieve the existing document
    const docSnapshot = await getDoc(customDocumentRef);

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const currentData = docSnapshot.data();
    console.log("Custom Document Reference:", currentData);

    // Find if the question already exists
    let foundQIndex = -1;
    if (currentData.NumberOfAttempts == 1) {
      if (currentData[categoryName]) {
        foundQIndex = currentData[categoryName].findIndex(
          (q) => q.question === newCategory[0].question
        );
      }

      if (foundQIndex !== -1) {
        // Update existing question
        currentData[foundQIndex] = [{ ...newCategory }];
        await setDoc(
          customDocumentRef,
          { [categoryName]: currentData[categoryName] },
          // {score:score},
          { merge: true }
        );
        console.log("Question updated successfully");
      } else {
        // Add new category
        score += 1;
        const currentCategory = currentData[categoryName] || [];
        const mergedCategory = [...currentCategory, ...newCategory];
        await setDoc(
          customDocumentRef,
          { [categoryName]: mergedCategory, score: score},
          { merge: true }
        );
        console.log("New category added successfully.");
      }
    } else {
      score += 1;
   
     let array1 = [];
    console.log("score : " + score);
    }
  } catch (error) {
    console.error("Error adding new category:", error);
  }
}



const buttons = document.querySelectorAll(".a");
buttons.forEach((button) => {
  button.addEventListener("click",()=>{
    GetTag(button)
    console.log(button)
  });
       
});



async function DisplayResult(att, Data) {
  let check = JSON.stringify(Data.results[0]);
  
  
  console.log("results :" + Data.results);
  let Quiz_Container = document.getElementsByClassName("Quiz_Container")[0];
  quiz.innerHTML = "";
  let div = document.createElement("div");
  div.className = "Quiz";
  const user = auth.currentUser;
  console.log(user);
  try {
   
    const userDocRef = doc(db, "users", user.uid);
    const nestedCollectionRef = collection(userDocRef, att + "Questions");
    const customDocumentRef = doc(nestedCollectionRef, user.uid);
    const docSnapshot = await  getDoc(customDocumentRef);
   if (docSnapshot.exists()) {
      let data = docSnapshot.data();
      let Questions = data[att];
      Object.values(Questions).map((question, index) => {
        Quiz_Container.innerHTML += `
        <div class="quiz" id="quiz">
        <div class="quiz_top">
            <h1>Sports Questions</h1>
        </div>
        <div class="question">
            <h3><span>${index + 1}.</span>${question.question}</h3>
            <div class="answer_buttons">
              ${
               question.attemptmeted == question.option4
                  ? `<button class="option1" id="btn" value="${question.attemptmeted}" style="border:2px solid green;" disabled>${question.attemptmeted}</button>`
                  : `<button class="option1" id="btn" value="${question.attemptmeted}" style="border:2px solid red;">${question.attemptmeted}</button>`
              }   
                <button class="option1" id="btn" value="${question.option1}">${
          question.option1
        }</button> 
                <button class="option1" id="btn" value="${question.option2}">${
          question.option2
        }</button> 
                <button class="option1" id="btn" value="${question.option3}">${
          question.option3
        }</button>
                <button class="option1" id="btn" value="${question.option4}">${
          question.option4
        }</button>
            </div>
        </div>
        </div>
        </div>
        `;
      });
      console.log(data);
    
    }
  } catch (error) {
    console.log(error);
  }

}
if (performance.navigation.type === 1) {
  console.log("Page has been refreshed");
} else {
  console.log("Page has not been refreshed");
}


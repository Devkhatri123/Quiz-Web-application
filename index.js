let quiz = document.getElementsByClassName("quiz")[0];
let next_btn = document.getElementsByClassName("next_btn")[0];
let name = document.getElementById("name");
let email = document.getElementById("email");
let pass = document.getElementById("password");
let login_btn = document.getElementsByClassName("login_btn")[0];
let emaildisplay = document.getElementsByClassName("emaildisplay")[0];
let users_options = document.getElementById("users_options");
let main = document.querySelectorAll(".a");
let menu = document.getElementById("menu");
let close = document.getElementById("close");
let logout = document.getElementsByClassName("logout")[0];

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
  signOut
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
  // console.log(user)
 onAuthStateChanged(auth,(user)=>{
  if (!user) {
    logout.style.display="none";
  }else{
    logout.style.display="block";
    logout.addEventListener("click",()=>{
      signOut(auth);
      window.location.reload();
    })
  }
})
async function GetTag(button) {
  try {
   let user = auth.currentUser;
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
        Quiz: att,
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
        let p = document.getElementById("error");
        p.style.display = "block"
        p.innerText = error
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

    if (emaildisplay && user){
       emaildisplay.textContent = user.displayName;
      emaildisplay.removeAttribute("href");
    }
    if(menu){
    menu.addEventListener("click", () => {
       users_options.style.display = "flex";
        console.log(users_options);
      
       
    });
    }
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
var min = Math.floor((time % 3600) / 60);
var sec =  Math.floor(time % 60);
async function GetData() {
  let url = new URLSearchParams(window.location.search);
  let category = url.get("category");
  console.log(category);
  try {
    const data = await getQuizQuestions(category);
    if (data) {
      console.log("Retrieved questions:", data);
      if (data.results.length > 0) {
        let Array = [
          data.results[index].correct_answer,
          ...data.results[index].incorrect_answers,
        ];
        for (let i = Array.length - 1; i > 0; i--) {
          NewPos = Math.floor(Math.random() * (i + 1));
          [Array[i], Array[NewPos]] = [Array[NewPos], Array[i]];
        }
        console.log(Array);

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
                        <button class="option1" id="btn" value="${Array[0]}"  disabled="true">${
          Array[0]
        }</button> 
                        <button class="option1" id="btn" value="${Array[3]}"  disabled="true">${
          Array[3]
        }</button> 
                        <button class="option1" id="btn" value="${Array[2]}"  disabled="true">${
          Array[2]
        }</button> 
                        <button class="option1" id="btn" value="${Array[1]}"  disabled="true">${
          Array[1]
        }</button>
                    </div>
                </div>
                <div class="quiz_footer">
                    <p><span>${index + 1}</span> of <span>${
          data.results.length
        }</span> Questions</p>
                    <button class="next_btn" id="next" value="clicked"  disabled="true">Next</button>
                </div>
                `;

        var hr = document.getElementById("hr");
        let btn = document.querySelectorAll("#btn");
        let Min = document.getElementById("min");
        // if (hr) {
        //   timer = setInterval(() => {
        //     time-=1;
        //     hr.innerHTML = time;
        //     if(time<=0){
        //       console.log("Timesup");
        //       DisplayResult(category)
        //       clearInterval(timer)
        //     }
        //   }, 1000);
        // }
        const nextButton = document.getElementById("next");
        setTimeout(()=>{
          nextButton.removeAttribute("disabled");
          nextButton.style.cursor="pointer";
          if (hr) {
            timer = setInterval(() => {
              time-=1;
            hr.textContent = time
              if(time<=0){
                console.log("Timesup");
                DisplayResult(category)
                clearInterval(timer)
              }
            }, 1000);
          }
          for (let i = 0; i < btn.length; i++) {
            btn[i].removeAttribute("disabled");
          }
         // btn.removeAttribute("disabled");
        },4000)
        var clickedButtonValue;
        btn.forEach((button) => {
          button.addEventListener("click", (event) => {
            clickedButtonValue = event.target.value;
          });
        });
        nextButton.addEventListener("click", () => {
          Inc(data.results[index], clickedButtonValue, data);
          console.log(clickedButtonValue);
          clearInterval(timer);
          console.log(time)
        });
      }
    } else {
      console.error("Element with ID 'next' not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
var hr = document.getElementById("hr");
document.addEventListener("DOMContentLoaded", () => {
  console.log(hr);
  GetData();
  try {
    //   if(hr){
    //  timer = setInterval(() => {
    //   time--;
    //   hr.innerHTML = time;
    //  if(time<=0) time=90;
    // },1000)
    //  }
  } catch (err) {
    console.log(err);
  }
});
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

    addNewCategoryToDocument(user.uid, Data, categoryName, index, data);
  });
  console.log(data);
  console.log("button-value : " + button);
  let documentId = auth.currentUser.uid;
  if (index < Data.results.length) {
    GetData();
  } else {
    const Id = auth.currentUser.uid;
    const userCollectionRef = collection(db, "users");
    const userDocRef = doc(userCollectionRef, Id);
    const nestedCollectionRef = collection(
      userDocRef,
      categoryName + "Questions"
    );
    const customDocumentRef = doc(nestedCollectionRef, Id);
    TimeTaken = 90 - time;
    clearInterval(timer);
    await setDoc(customDocumentRef, { TimeTaken: TimeTaken }, { merge: true });
    DisplayResult(att);
  }
}
let array = [];
async function addNewCategoryToDocument(
  documentId,
  newCategory,
  categoryName,
  Index,
  CurrentQuestion
) {
  try {
    console.log(newCategory);
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
      if (newCategory[0].attemptmeted == CurrentQuestion.correct_answer) {
          score += 1;
        }

array.push(...newCategory);
// let newarr = [...array,...newCategory];
console.log(array)
      //   const currentCategory = currentData[categoryName] || [];
      //   const mergedCategory = [...currentCategory, ...newCategory];
      // console.log(mergedCategory)
         const updatedData = {
             array, // Update the category with the merged category
            score: score // Update the score
          };
        await setDoc(
          customDocumentRef,
           {[categoryName]:array,score: score},
          { merge: true }
        );
        console.log("Question added successfully.");
       
      
  } catch (error) {
    console.error("Error adding new category:", error);
  }
}
const buttons = document.querySelectorAll(".a");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    GetTag(button);
    console.log(button);
  });
});

async function DisplayResult(att) {
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
    const docSnapshot = await getDoc(customDocumentRef);
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
    }else{
   quiz.innerHTML = `<h3 style="text-align:center;">No Questions were attempted</h3>`
    }
  } catch (error) {
    console.log(error);
  }
}


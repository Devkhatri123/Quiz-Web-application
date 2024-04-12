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
  let a = document.getElementById("a");
  let card = document.getElementById("card");
  console.log(a)
  let data_value = ["Sports","Celebrities","HTML"];
let User = null;
async function GetUserInformation(){
 
    try{
      card.innerHTML = "loading...";
    onAuthStateChanged(auth, async (user) => {
      if(!auth.currentUser)card.innerHTML = "no user";
    const userCollection = collection(db,"users");
    const userDocRef = doc(userCollection,user.uid);
  let NestedData = await GetNestedCollections(userDocRef,user.uid);
  card.innerHTML = "";
  const userDoc = await getDoc(userDocRef);
  PrintData(NestedData);
    })
}catch(error){
  if(card){
  card.innerText = error;
    console.log(error);
  }
}
}
 GetUserInformation()

async function GetNestedCollections(DocRef,id){
    const nestedCollectionsData = [];
  let promises =  data_value.map(async(value,index)=>{
        console.log(value);
        const nestedCollectionQuerySnapshot = collection(DocRef,value+"Questions");
        const nestedCollectionDoc = doc(nestedCollectionQuerySnapshot,id);
        const nestedDoc = await getDoc(nestedCollectionDoc);
        if(nestedDoc.exists()){
            console.log(nestedDoc.data())
         nestedCollectionsData.push(nestedDoc.data());
    }
     })
 await Promise.all(promises)
     return nestedCollectionsData.filter(item => item !== undefined);
     //console.log(Questions)
    
 }
 function PrintData(Data){
  try{
    console.log(Data)
    Object.values(Data).map((data)=>{
        console.log(data)
        if(card){
        card.innerHTML +=`  
        <div class="Quizes">
       
        </div>
        <div class="info">
        <h3>Quiz : ${data.Quiz}</h3>
        <p class="No_of_Question">No of Question : ${parseInt(data.NumberofQuestion)}</p>
        <div><button>View</button></div>
        </div>
       `
       }
    })
  }catch(err){
    console.log(err)
  }
 }
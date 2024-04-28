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
  let data_value = ["Sports","General Knowledge","Politics","History","Entertainment: Music","Animals","Art","Geography"];
let User = null;
async function GetUserInformation(){
 
    try{
      card.innerHTML = "fetching Data...";
    onAuthStateChanged(auth, async (user) => {
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
        const nestedCollectionQuerySnapshot = collection(DocRef,value+"Questions");
        const nestedCollectionDoc = doc(nestedCollectionQuerySnapshot,id);
        const nestedDoc = await getDoc(nestedCollectionDoc);
        if(nestedDoc.exists()){
          nestedCollectionsData.push(nestedDoc.data());
    }
     })
 await Promise.all(promises)
     return nestedCollectionsData.filter(item => item !== undefined);
 }
 function PrintData(Data){
  try{
    if(Data.length>0){
    Object.values(Data).map((data)=>{
        if(card){
        card.innerHTML +=`  
        <div class="Quizes">
       
        </div>
        <div class="info">
        <h3>Quiz : ${data.Quiz}</h3>
        <p class="No_of_Question">No of Question : ${parseInt(data.NumberofQuestion)}</p>
        <p class="No_of_Question">Score : ${data.score}</p>
        </div>
       `
       }
    })
  }else{
  card.innerHTML ="No Quiz were attempted";
  card.style.fontSize = "25px";
  card.style.minHeight = "50vh";
  card.style.display = "flex";
  card.style.justifyContent = "center";
  card.style.alignItems = "center";
  card.style.fontFamily = "Sans-serif";
  }
  }catch(err){
    console.log(err)
  }
 }
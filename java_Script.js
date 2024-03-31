const usertab =document.querySelector("#data-userweather")
const searchtab =document.querySelector("#data-searchweather")
const usercontainer =document.querySelector(".weather-container")
const grantacesscontainer =document.querySelector(".grant-location-container");

const searchform =document.querySelector("#data-searchForm")
const loadingscreen =document.querySelector(".loading-container")
const userinfocontainer =document.querySelector(".user-info-container")


let oldtab=usertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldtab.classList.add("current-tab")


function switchTab(newtab){
     if(newtab != oldtab){

        oldtab.classList.remove("current-tab");
        oldtab=newtab;
        oldtab.classList.add("current-tab")

       if(!searchform.classList.contains("active")){
              userinfocontainer.classList.remove("active");
              grantacesscontainer.classList.remove("active");
              searchform.classList.add("active");
       }
       else{
        // phele s serach wala par hu
        searchform.classList.remove("active");
        userinfocontainer.classList.remove("active");
        getfromSessionStorage();
       }
     }
     else{
        return 
     }
}

usertab.addEventListener("click",() => {
    switchTab(usertab);
})
searchtab.addEventListener("click",() => {
    switchTab(searchtab);
})





function renderweatherinfo(weatherinfo){
     const cityname=document.querySelector(" [data-cityname]");
     const countryicon=document.querySelector("[data-countryicon]");
     const desc=document.querySelector("[data-weatherdesc]");
     const weathericon=document.querySelector("[data-weathericon]");
     const temp=document.querySelector("[data-temprature]");
     const windspeed=document.querySelector("[datawind]");
     const humidity=document.querySelector("[data-humidity]");
     const cloudiness=document.querySelector("[data-cloudiness]");
     console.log(weatherinfo);

     cityname.innerText=weatherinfo?.name;
     countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText=weatherinfo?.weather?.[0]?.description;
     weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;

     temp.innerText=`${weatherinfo?.main?.temp}.C`;
     windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
     humidity.innerText=`${weatherinfo?.main?.humidity}%`;
     cloudiness.innerText=`${weatherinfo?.clouds?.all}`



}

 let btm=document.querySelector(".imgbtn");
 searchform.addEventListener("click", (e) =>{
    e.preventDefault();
    console.log("clicked")
    let cityinput=document.querySelector("#cityname").value;
    console.log(cityinput)
    if (cityinput === "")
    return;
   else{
    fetch_search_info(cityinput)
   }

 })


async function fetch_search_info(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantacesscontainer.classList.remove("active");
    try{
   const data= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
   loadingscreen.classList.remove("active");
   userinfocontainer.classList.add("active")
   const result=await data.json();
   console.log(result)
   renderweatherinfo(result);
    }
    catch{
        alert("not such ")

}
}
async function  fetch_user_info(coordinates){
    const {lat,lon}=coordinates;
    grantacesscontainer.classList.remove("active");
    loadingscreen.classList.add("active");
    
    // api call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            // `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
         
            );
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
            



    }
    catch(e){
       loadingscreen.classList.add("active");
    }
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geo location ")
    }
}

function showPosition(position){
    const usercordinate={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinates",JSON.stringify( usercordinate));
    fetch_user_info(usercordinate);

}getfromSessionStorage();

function getfromSessionStorage (){
    const localCoordinates=sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        grantacesscontainer.classList.add("active");
    }
    else{
        const coordinate=JSON.parse(localCoordinates);
        fetch_user_info(coordinate);
    }
}
const grantlocation=document.querySelector("#data-grantaccess");
grantlocation.addEventListener( "click",getlocation );
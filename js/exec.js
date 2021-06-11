
window.addEventListener('load',()=> loadPage(),false);


async  function loadPage() {
  var tabId = document.getElementById('mat-tab-label-0-1');
  tabId.click();
  var pincodeId = document.getElementById('mat-input-0');
  pincodeId.value =pincodevalue;
  var event = new Event('input');
  pincodeId.dispatchEvent(event);
  console.log('Hi '+pincodeId.value);
  let searchBtn = document.getElementsByClassName('pin-search-btn');

    searchBtn[0].click();
    await sleep(2000);
  chrome.storage.local.get(['vaccineType','age'],function(data){
    console.log(data);


      if(data.vaccineType=='COVISHIELD')
        document.getElementById('flexRadioDefault4').click();

      if(data.vaccineType=='COVAXIN' )
        document.getElementById('flexRadioDefault5').click();

        if(data.vaccineType=='Sputnik V' )
          document.getElementById('flexRadioDefault6').click();

        if(data.age=='18')
          document.getElementById('flexRadioDefault2').click();
        else{
          document.getElementById('flexRadioDefault3').click();
        }


  //  alert(data);
});


}
function sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

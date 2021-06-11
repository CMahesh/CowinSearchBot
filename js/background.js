// Initialize the demo on install
chrome.runtime.onInstalled.addListener((reason) => {

});


chrome.alarms.onAlarm.addListener(function(name) {
  if (name.name != 'cowinbotAlarm')
    return;
  console.log('alert sounded');
  chrome.storage.local.get(['stateId', 'districtId', 'dose', 'vaccineType', 'age', 'searchType', 'listOfPinCodes', 'startDate','noOfDays'], function(data) {
    console.log(data.stateId);
    console.log(data.districtId);

    let required_dose = 'available_capacity_dose1';
    let age = data['age'];
    let vaccineType = data.vaccineType;
    if (data.dose === 'dose2')
      required_dose = 'available_capacity_dose2';
    let self=this;
    let days = parseInt(data.noOfDays);
    for (var i = 0; i < days; i++) {
      let today = new Date(data.startDate.split('-')[2], data.startDate.split('-')[1] - 1, data.startDate.split('-')[0]);
      today.setDate(today.getDate() + i);
    //  let today = new Date(dvalue.getDate() + i);
      var dd = today.getDate();
      var mm = today.getMonth() + 1;

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      let todayFormat = dd + '/' + mm + '/' + yyyy;
      ////https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=294&date=31-05-2021
      let url = '';
      if (data.searchType == 'byDistrict') {

        for(var districtIndex = 0;districtIndex<data.districtId.length;districtIndex++){
        fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=' + data.districtId[districtIndex] + '&date=' + todayFormat,
              {
                method: 'GET',
                headers: {'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'}
              }
          )
          .then((resp) => resp.json())
          .then(function(result) {
            result = result.sessions.filter(x => x[required_dose] > 0 && (vaccineType == 'Any' || x.vaccine == vaccineType) && x.min_age_limit == age)
              .sort((x, y) => parseInt(y.pincode) - parseInt(x.pincode));

            for (var k = 0; k < result.length; k++) {
              self.createNotification(result[k], required_dose);
            }

            if(result.length==0)
              self.createNotification({id:Date.now(),message:"No vaccine found on "+todayFormat+" :("});
          });
        }
      } else {
        let pincodeValues = data.listOfPinCodes.split(",");

        for (var j = 0; j < pincodeValues.length; j++) {
          fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincodeValues[j] + '&date=' + todayFormat)
            .then((resp) => resp.json())
            .then(function(result) {
              result = result.sessions.filter(x => x[required_dose] > 0 && (vaccineType == 'Any' || x.vaccine == vaccineType) && x.min_age_limit == age)
                .sort((x, y) => parseInt(y.pincode) - parseInt(x.pincode));

                if(result.length==0)
                  self.createNotification({id:Date.now(),message:"No vaccine found on "+todayFormat+" :("});
              for (var k= 0; k < result.length; k++) {
                self.createNotification(result[k], required_dose);
              }
            });
        }
      }


    }
  });

  //    });
  const s = new Date()
  console.log(s.getHours() + ":" + s.getMinutes() + ":" + s.getSeconds());
});

function createNotification(center, required_dose) {

  if(!required_dose){
  //  chrome.notifications.create(center.id+"",{type:"basic",  iconUrl: 'icon.png', title:'Vaccine Not found ',message:center.message});
}
  else
  chrome.notifications.create(
    Date.now() + "_" + center.pincode+"_"+center.date+"_"+center.center_id, {
      type: "list",
      iconUrl: 'icon.png',
      title: center.vaccine + "-" + center.date + "-" + center.pincode,
      message: " Dose , " + center.fee,
      items: [{
        title: "AGE : " + center.min_age_limit + " Fee : " + (center.fee == '0' ? "Free" : "Rs. " + center.fee),
        message: center.name + " Doses: " + center[required_dose] + " of " + required_dose.replace('available_capacity_', '')
      }]
    },
    function(id) {
      console.log(id);
    });
}

//"https://www.cowin.gov.in/home"
chrome.notifications.onClicked.addListener(function selectNotification(notificationId) {
  let nId = notificationId.split('_')[1];
  //"https://web.umang.gov.in/web_new/department?url=cowin%2F&dept_id=355&dept_name=Co-WIN"
  chrome.tabs.create({
    url: "https://www.cowin.gov.in/home"
  }, function(tab) {
    console.log(tab);
    chrome.tabs.executeScript(tab.id, {
      code: "var pincodevalue='" + nId + "';"
    }, function(v) {
      chrome.tabs.executeScript(tab.id, {
        file: "js/exec.js"
      }, function(v) {
        console.log(v);
      });
    });
  });
});

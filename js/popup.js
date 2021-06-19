$(function() {

  $.get("https://cdn-api.co-vin.in/api/v2/admin/location/states", function(data) {
    var stateList = [];
    data = data.states;
    var stateNameListId = $("#stateNameListId");
    stateNameListId.empty();
    chrome.storage.local.set({'stateList': data });
    for (var i = 0; i < data.length; i++) {
      stateNameListId.append($("<option />").val(data[i].state_id).text(data[i].state_name));
    }


    chrome.storage.local.get(['stateId','districtId','dose','vaccineType','searchInterval','districtList','age','searchType','startDate','listOfPinCodes','noOfDays','searchType','paid'],function(data){
        console.log(data);
        var districtListId=$('#districtNameListId');
        if(data.districtList)
        for (var i = 0; i < data.districtList.length; i++) {
          districtListId.append($("<option />").val(data.districtList[i].district_id).text(data.districtList[i].district_name));
        }

        $('#stateNameListId').val(data.stateId).attr('selected', true);
        $('#districtNameListId').val(data.districtId).attr('selected', true);
        $('#doseId').val(data.dose).attr('selected', true);
        $('#ageId').val(data.age).attr('selected', true);
        $('#vaccineTypeId').val(data.vaccineType).attr('selected', true);
        $('#searchIntervalId').val(data.searchInterval).attr('selected', true);
        $('#startDateId').val(data.startDate);
        $('#noOfDaysId').val(data.noOfDays);
        $('#paidId').val(data.paid);
        if(data.searchType=='byDistrict'){
            $('#bywhatField').val('activeTab','districtTabLink');
            $('#districtTabLink').tab('show');
        }
        else {
            $('#bywhatField').val('activeTab','pincodeTabLink');
            $('#pincodeTabLink').tab('show');
        }

        //By Pincode Part
        $('#pincodeListId').val(data.listOfPinCodes);



    });




  });

  $('#stateNameListId').change(function() {
    var selectedText = $(this).find("option:selected").text();
    var selectedValue = $(this).val();

    // headers = {
    //   'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    // }
    $.get("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + selectedValue, function(data) {
      var districtList = [];
      data = data.districts;
      var districtNameListId = $("#districtNameListId");
      districtNameListId.empty();
      chrome.storage.local.set({'districtList': data});
      for (var i = 0; i < data.length; i++) {
        districtNameListId.append($("<option />").val(data[i].district_id).text(data[i].district_name));
      }
      districtNameListId.prop('selectedIndex', 0);

    });
  });

  $("#searchBtnId").click(function() {
    var selectedValue = $('#searchIntervalId').val();
    chrome.alarms.clear('cowinbotAlarm');
    var stateId = $('#stateNameListId').val();

  console.log($('#districtNameListId').val());
    //ByDistrict Part
    console.log($('#stateNameListId').find("option:selected").text());
    chrome.storage.local.set({'stateName': $('#stateNameListId').find("option:selected").text() });
    chrome.storage.local.set({'districtName': $('#districtNameListId').find("option:selected").text()});
    chrome.storage.local.set({'stateId': stateId });
    chrome.storage.local.set({'districtId': $('#districtNameListId').val()});

    //By Pincode Part
    chrome.storage.local.set({'listOfPinCodes':$('#pincodeListId').val()});


    //By Code part
    chrome.storage.local.set({'dose': $('#doseId').find("option:selected").val()});
    chrome.storage.local.set({'vaccineType':$('#vaccineTypeId').find("option:selected").val() });
    chrome.storage.local.set({'age':$('#ageId').find("option:selected").val()});
    chrome.storage.local.set({'searchInterval':$('#searchIntervalId').find("option:selected").val()});
    chrome.storage.local.set({'startDate': $('#startDateId').val() });
    chrome.storage.local.set({'noOfDays':$("#noOfDaysId").val()});
    chrome.storage.local.set({'paid':$('#paidId').val()});
    let val = $('#bywhatField').data('activeTab');
    if(val == undefined || val=='districtTabLink'){
      chrome.storage.local.set({'searchType':'byDistrict'});
    }
    else {
      chrome.storage.local.set({'searchType':'byPinCode'});
    }

    chrome.alarms.create('cowinbotAlarm', {delayInMinutes: 1,periodInMinutes: parseInt(selectedValue)});
    alert('Cowin Search Bot started. You will get notification once I see slot is free ');
  });

  $("#cancelBtnId").click(function() {
      console.log('clear notification');
      alert('Cowin Search Bot stopped!! Cya!!');
      chrome.alarms.clear('cowinbotAlarm');
  });

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
var currId = $(e.target).attr("id");
    console.log(currId);
  $('#bywhatField').data('activeTab', currId);
})

});

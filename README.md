# CowinSearchBot
I have created the chrome plugin. It will search for the vaccine using the Cowin API in the backend. There are two ways a search can be performed
1. By District
2. By Pincode
Other common parameters are
1. Dose 1 or 2
2. Start Date to search
3. Number of dates from the start date to search
4. Vaccine Type(COVISHIELD, COVAXIN)
5. Age (18+ or 45+)
6. Added the option to select Free, Paid or Any for vaccination fee.

##By District
More than one District can be selected from the dropdown.


Once the information is provided. The extension will query in the backend after every X interval for checking the vaccine chosen type. Once there is a vaccine available. It will send a chrome-based notification with the information of the pin code, address, number of doses, date of availability, etc. Upon clicking on the notification, it will redirect you to the cowin page.

Chrome Extension zip(Cowin Search Bot): https://drive.google.com/file/d/1pBYKRNU7rdL30ct-ToXRph6wz3gsthQD/view

Way to add the extension to Chrome(Add Extension to chrome): https://www.cnet.com/how-to/how-to-install-chrome-extensions-manually/#:~:text=Locate%20the%20ZIP%20file%20on,your%20extension%20to%20install%20it

For MAC Users(Enable notifications) :
https://stackoverflow.com/questions/22059071/chrome-notifications-not-appearing-from-chrome-extension-background-page


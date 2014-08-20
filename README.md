Web Profiler
===========

This is a website, that build your best CV (resume) consuming your own accounts on Linkedin,Twitter and Github.
*What does it means?*
Means that you will always have updated info about your github repositories,and user info.
Your last 10 tweets, updated.
All your linkedin profile data (because of LinkedIn API you will need to update this info with some clicks)

##How to use it
First thing is configure your accounts (Github, Twitter and Linkedin).
Don't worry because all permision this code have are "read", never will be able to modify or delete nothing on your accounts.

**Github**
Will use the public api with a limit of 60 request per IP.
Only need your Github username

**Twitter**
You will need to give read acces to my twitter app.This will give a you a pin, that you will use to certificate the access.
After that the token will be allways the same, then you only need to make it once.

**Linkedin**
You will need to give read acces to my LinkedIn app. 
Then you daa will be loaded on screen. 
because is not a permanent LinkeIn login, you will need do this each time you want to update your Linkedin data on your web profile.




##Run the project

install all node modules with

  npm install

run the site with

  grunt server
  
  
##Go to congifuration site

First fill all data you already know on this file /configfile/profile.json

Them go to
http://localhost:9000/#/config

and follow the instruccion to each API, to fill complytelly the  /configfile/profile.json file.
also copy all the linekdin data to the /configfile/linkedin.json file.

DONE!

Now copy everything to your hosting at will work :)

##Customization

Welcome.html page is an angular tempalte, fell free to coustomize it for you,and your css and html changes.
all data will be on $rootScope.apiProfile


*This code is Made by Alex Trebolle under http://opensource.org/licenses/MIT*


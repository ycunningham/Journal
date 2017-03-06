# Student Journal

##Prerequisites:
* MySQL server running on **localhost** with **Root** user having **no password** (the default with XAMPP)
* Nodejs (Project was built on version 6.10.0)
* Shell  that supports **npm**, Git Bash recommended (npm version 3.10.10)

---
##Setup:
* Clone the Journal repository, **git clone https://github.com/ycunningham/Journal.git journal**
* Enter the *Journal* directory on your local machine and issue command:
  **npm install**
* Enter *Client* directory and issue command:
  **npm install**
* Import **setup_db.sql** into phpMyAdmin to create the DB ( or use your preferred method )
* Run the node server (app.js), **node app.js**

---
##Technologies:
* Nodejs Sever
* Expressjs handels Routing
* Angular2 Platform used for Client side SPA after user authentication 

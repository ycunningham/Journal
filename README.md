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
* Application home **http://localhost:3000**

---
##Technologies:
* Nodejs Server
* Expressjs handles Routing
* Angular2 Platform used for Client side SPA after user authentication 

![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/login.jpg?raw=true "Login Screen")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/register.jpg?raw=true "Create user")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/Toggle_Student.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/made_teacher.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/create_class.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/create_topic.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/student_post_to_topic.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/teacher_add_topic_to_class.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/student_enroll.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/teacher_confirm_enrollment.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/admin_logged_in.jpg?raw=true "")
![Alt text](https://raw.githubusercontent.com/ycunningham/Journal/master/shots/admin_after_teacher_has_class.jpg?raw=true "")

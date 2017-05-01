import { Component, Output, Input, EventEmitter, Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { TopicsService } from './topics.service'

@Injectable()
export class SharedService {
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }
}

@Component({
  selector: 'enrollment',
  template: `<table>
                <tr>
                   <td colspan="4">
                       <b>Students requested enrollment or enrolled</b>
                   </td>
                <tr>
                <tr>
                    <td>User Name</td>
                    <td>User id</td>
                    <td>Confirm Enrollment</td>
                    <td>Delete</td>
                </tr>
                <tr *ngFor='let register of registered'>
                      <td> {{ register.firstName }} &nbsp; {{ register.lastName }}  </td>   
                      <td> {{ register.user_id }} </td>
                      <td *ngIf="!register.enrolled">
                          <span class="btn btn-primary" (click)="confirmEnrollment( register.class_id, register.user_id );false"> Confirm </span> 
                      </td>
                      <td *ngIf="register.enrolled">
                          Enrolled
                      </td>  
                      <td>
                          <a href="#" (click)='delete(register.class_id, register.user_id); false'><div title="Remove Student" class="delete glyphicon glyphicon-remove"></div></a>       
                      </td>
                </tr>
            </table>`
})
export class EnrollmentComponent implements OnInit {

  registered: Object = []

  class_id: string;

  constructor(route: ActivatedRoute, private _topicsService: TopicsService) {

    this.class_id = route.snapshot.params['class_id'];

  }

  getAllRegistered() {

    //this._topicsService.getAllRegistered(this.class_id).subscribe(arg => this.registered = arg);
    var that = this;
    this._topicsService.getAllRegistered(this.class_id).subscribe(
      function (result) {
        that.registered = result;
      }
    );
  }

  confirmEnrollment(class_id: string, user_id: string) {
    this._topicsService.setConfirmEnroll(class_id, user_id).subscribe(() => this.getAllRegistered());
  }

  delete(class_id: string, user_id: string) {
    this._topicsService.deleteEnrolled(class_id, user_id).subscribe(() => this.getAllRegistered());
  }

  ngOnInit() {
    this.getAllRegistered();
  }

}





@Component({
  selector: 'createclass',
  template: `<label>Class Title:</label>
             <input type="text" [(ngModel)]="data.title">
             <br>
             <label>Description:</label>
             <textarea id="cctextarea" [(ngModel)]="data.description"></textarea><br>
             <button id="ccsave" (click)='save()' type="button" class="btn btn-primary">Save class</button>
            `
})
export class CreateClassComponent implements OnInit, OnDestroy {

  @Input() data: Object = {};

  constructor(private _topicsService: TopicsService, private _sharedService: SharedService) { }

  save() {
    this._topicsService.setClass(this.data).subscribe();

    this._sharedService.emitChange('Data from child');

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}


@Component({
  selector: 'administrator',
  template: `
            <b>Roles: 1 = Administrator,&nbsp;2 = Teacher,&nbsp;3=Student</b>
            <table>
                <tr>  
                    <td> User id</td> 
                    <td> First Name </td>
                    <td> Last Name </td>
                    <td> Role </td>
                    <td> Email </td>
                    <td> Toggle Role Student/Teacher </td>
                    <td> Remove User </td>
                </tr>
                <tr *ngFor='let user of users'>  
                    <td> {{ user.user_id }} </td> 
                    <td> {{ user.firstName }} </td>
                    <td> {{ user.lastName }} </td>
                    <td class="roleCell"> {{ user.role }} </td>
                    <td> {{ user.email }} </td>
                    <td>
                        <a *ngIf="(user.role != '1') && !user.hasClass" href='#' (click)='setRole(user.user_id);false'> Toggle Role</a>
                        <span *ngIf="user.hasClass">Has Class(es)</span>
                    </td>
                </tr>
            </table>
            <br>
            <table>
                <tr>
                    <td> Creator User id </td>
                    <td> Class id </td>
                    <td> Delete Class</td>
                </tr>
                <tr *ngFor='let class of classes'>
                    <td> {{ class.user_id  }} </td>
                    <td> {{ class.class_id }} </td>
                    <td>  <a href="#" (click)='deleteClass(class.class_id); false'><div title="deleteClass" class="delete glyphicon glyphicon-remove"></div></a>   </td>
                </tr>
            </table>
            `
})
export class AdministratorComponent implements OnInit {

  users: Object = [];
  classes: Object = []
  
  constructor(private _topicsService: TopicsService, private _sharedService: SharedService) { }

  ngOnInit() {
    this.getAllusers();
    this.getClasses();
  }

  getClasses() {
    this._topicsService.getClasses().subscribe(arg => this.classes = arg);
  }
   
  getAllusers() {

    this._topicsService.administrator().subscribe(arg => this.users = arg)

  }
  
  setRole(user_id: string) {
    this._topicsService.setRole(user_id).subscribe(() => this.getAllusers());
  }

  deleteClass( class_id: string ) {
      this._topicsService.deleteClass(class_id).subscribe(() => this.ngOnInit())
  }

}



@Component({
  selector: 'teacheradmin',
  template: `<span class="btn btn-primary" [routerLink]="['createclass']"> Create Class </span>  
              <div>
                  <div class="left">
                      <h4> Your classes: </h4>
                      <h6>( Manage Enrollment )</h6>
                      <ul class="nav nav-pills">
                          <li *ngFor='let class of myClasses' role="presentation" >   
                                  <a href="#" [routerLink]="['enrollment', class.class_id ]">{{ class.title }}</a>
                          </li>
                      </ul>
                  </div>
                  <div class="right">    
                      <router-outlet></router-outlet>
                  </div>
             </div>`
})
export class TeacherAdminComponent implements OnInit {

  myClasses: Object = [];

  constructor(private _topicsService: TopicsService, private _sharedService: SharedService) {

    _sharedService.changeEmitted$.subscribe(() => this.getClassesByCreator()); //event from sub-route

  }

  ngOnInit() {

    this.getClassesByCreator();

  }

  getClassesByCreator() {
    //Get the classes created by this teacher, the server knows who the user is and it's more secure than passing it to the server.
    this._topicsService.getClassesByCreator().subscribe(arg => this.myClasses = arg);

  }

}


@Component({
  selector: 'class',
  template: `<div>

                <div *ngIf="!register && !cancel" class="title"> <h3> <a class="viewpostlink" [routerLink]="['/topics', class.class_id ]"> {{ class.title }} </a>  </h3> </div>
                <div *ngIf="register || cancel" class="title"> <h3> <a class="viewpostlink" (click)="alert()"> {{ class.title }} </a>  </h3> </div>

                <p class="description"> {{ class.description }} </p>
                <div class="createdby"><b>Instructor&nbsp;:&nbsp;{{creator.firstName}}&nbsp;{{creator.lastName}}</b></div>

             </div>
             <span *ngIf="register" class="enrolltext"> You are not enrolled.
                 <a href="#" class="enroll" (click)='enroll();false'>Enroll ?</a>
             </span>
             <span *ngIf="cancel" class="enrolltext">
                 <a href="#" class="enroll">Cancel enrollment request?</a>
             </span>
             `,
  providers: [TopicsService]
})
export class ClassComponent implements OnInit {

  @Input() class: Object;

  constructor(private _topicsService: TopicsService) { }

  register: Boolean = false
  cancel: Boolean = false

  creator: Object = {}

  registered() {
    //reset values
    this.register = false
    this.cancel = false

    var that = this;

    let fn = function (arg: any) {

      if (arg != null) {
        if (arg['enrolled'] == false) { //requested but not confirmed
          that.cancel = true;
        }
      } else { // is a student and hasn't requested
        that.register = true;
      }
    }

    this._topicsService.getRegistered(this.class['class_id']).subscribe(fn);

  }

  creatorInfo() {
    this._topicsService.getUserById(this.class['user_id']).subscribe(arg => this.creator = arg);
  }

  enroll() { // request enrollment
    this._topicsService.setEnroll(this.class['class_id']).subscribe(() => this.registered());
  }

  alert() {
    alert("You must enroll and be confirmed before you can enter");
  }

  ngOnInit() {
    this.registered();
    this.creatorInfo();
  }



}


@Component({
  selector: 'classes',
  template: `<div id="classHeading">Classes</div>
             <div id="classes">
                 <div class="class" *ngFor='let class of classes'>
                     <class [class]="class" ></class>   
                 </div>
             </div>`,
  providers: [TopicsService]
})
export class ClassesComponent implements OnInit {

  constructor(private _topicsService: TopicsService) { }

  classes: Object = []
  student: Boolean = false

  getClasses() {
    this._topicsService.getClasses().subscribe(arg => this.classes = arg);
  }

  ngOnInit() {
    this.getClasses(); //bootstrap data
  }

  //x Get the role, if is a teacher or The admin don't show register request question
  //Get wether or not we have already requested
  //Get wether or not we are already registred


  //input from ...
  /*
  onNotify(data: any) {

    this._topicsService.setClass( data.title, data.description ).subscribe(arg => this.classes = arg);

  }*/

  //delete a topic
  /*
  delete(topic_id: string, user_id: string, event: any) {

    this._topicsService.deleteClass(class_id).subscribe( () => this.getClasses() );

  }*/

}

@Component({
  selector: 'topicview',
  template: `
            <div>
                <div class="buttonContainer">
                    <a *ngIf="!hasPosted" type="button" class="btn-custom btn btn-primary btn-lg" data-toggle="modal" data-target="#postModal">Post response</a>
                </div>
                <div>
                     <div class="class post" *ngFor='let post of posts'>
                            <div class="content"> 
                                 {{ post.content }}
                                 <span *ngIf="post.user_id==user.user_id">By Me</span>
                            </div>
                            <div class="by">Posted by&nbsp;{{ post.user }}</div>
                            <!-- <span class="creation">  {{ post.created }}</span>-->
                    </div> 
                </div>
                <createpost (notify)='onNotify( id , $event)'></createpost>
            </div>    
            `
})
export class TopicView implements OnInit {

  id: string; //Topic id

  posts: Object = []

  user: Object = { user_id: null }

  hasPosted: boolean = false

  constructor(route: ActivatedRoute, private _topicsService: TopicsService) {

    this.id = route.snapshot.params['id'];

  }

  ngOnInit() {
    //this.getTopicPosts()
    this.getUser()
  }

  //input from createPost
  onNotify(topic_id: string, data: any) { // will auto update posts
    this._topicsService.setPost(topic_id, data.content).subscribe(() => this.getUser());
  }

  /*
  getTopicPosts() {
    this._topicsService.getTopicPosts(this.id).subscribe(arg => this.posts = arg);
  }*/

  getUser() {
    
    var that = this;

    var fn_1 = function ( user: any ) {

        if (user) {

            that.user = user
            let _user_id = user.user_id
            
            var fn_2 = function ( posts: any ) {
               that.posts = posts
               
               for(let post of posts){
                   if (_user_id = post.user_id) {
                       that.hasPosted = true
                   }
               }

            }

            that._topicsService.getTopicPosts(that.id).subscribe(fn_2);
        }
    }

    this._topicsService.getRole().subscribe(fn_1)
  }

}


@Component({
  selector: 'createpost',
  template: `
            <!-- Modal -->
            <div class="modal fade" id="postModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 class="modal-title" id="myModalLabel">Post to Topic</h4>
                        </div>
                        <div class="modal-body">
                            <textarea id="cptextarea" #textarea></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button (click)='save(textarea.value)' type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
                        </div>
                   </div>
               </div>
            </div>
            `
})
export class CreatePost {
  @Output() notify: EventEmitter<any> = new EventEmitter<any>(); // Textarea contents

  //emit the event
  save(value: string) {
    this.notify.emit({ content: value });
  }
}


@Component({
  selector: 'createtopic',
  template: `
            <!-- Modal -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 class="modal-title" id="myModalLabel">Create Topic</h4>
                        </div>
                        <div class="modal-body">
                            <textarea id="cttextarea" #textarea></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button (click)='save(textarea.value)' type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
                        </div>
                   </div>
               </div>
            </div>
            `
})
export class CreateTopic {

  @Output() notify: EventEmitter<any> = new EventEmitter<any>(); // Textarea contents

  //emit the event
  save(value: string) {
    this.notify.emit({ heading: value });
  }
}


@Component({
  selector: 'topics',
  template: `
            <div>
              <div class="buttonContainer">
                  <div class="topics">Topics</div><br style="clear:both;display:inline;">
                  <a *ngIf="teacher" (click)="showCreateTopic='True'" type="button" class="btn-custom btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Add Topic</a>
              </div>
              <ul>
                  <li *ngFor='let topic of topics'>
                      <a [routerLink]="['/topic', topic.topic_id ]" class="heading">{{ topic.heading }}</a>
                      <!--
                      <div class="createdBy"> {{ topic.user_id }}</div>
                      <div class="creation"> {{ topic.created }}</div> -->
                      <!-- <a class="viewpostlink" [routerLink]="[ '/post:' + topic.topic_id ]">Post</a> -->

                      <a *ngIf="teacher" href="#" (click)='delete(topic.topic_id, topic.user_id, $event); false'><div title="Delete Topic" class="altdelete glyphicon glyphicon-remove"></div></a>
                  </li>
              </ul>
              <createtopic (notify)='onNotify($event)'></createtopic>
            </div>
            `,
  providers: [TopicsService],

})
export class TopicsComponent implements OnInit {

  class_id: string;

  topics: Object = []

  teacher: boolean = false;

  constructor(route: ActivatedRoute, private _topicsService: TopicsService) {

    this.class_id = route.snapshot.params['class_id'];
  }

  //show the textarea
  //showCreateTopic: boolean = false
  getTopics() {
    //this._topicsService.getTopics().subscribe(arg => this.topics = arg);
    this._topicsService.getTopicsByClass(this.class_id).subscribe(arg => this.topics = arg);
  }

  ngOnInit() {
    this.whatRole();
    this.getTopics(); //bootstrap data
  }

  //input from createTopic
  onNotify(data: any) {

    //this._topicsService.setTopic(data.heading).subscribe(arg => this.topics = arg); // need to pass the  class id
    this._topicsService.setTopic(data.heading, this.class_id).subscribe(() => this.getTopics());

    //this.showCreateTopic = false; //hide the textarea
  }


  whatRole() {
    var that = this;

    let fn = function (result: any) {
      if (result.role == "Teacher") {
        that.teacher = true;
      }
    };

    this._topicsService.getRole().subscribe(fn);
  }

  //delete a topic
  delete(topic_id: string, user_id: string, event: any) {

    this._topicsService.deleteTopic(topic_id).subscribe(() => this.getTopics());

  }

}

//should really be a menu bar?
@Component({
  selector: 'logout',
  template: `<a [routerLink]="['/classes']">View Classes</a>
             <div id="usernav">
                <span *ngIf="teacher">
                    <a [routerLink]="['/teacheradmin']">
                        Admin
                    </a>
                    <span>&nbsp;|&nbsp;</span>
                </span>
                <span *ngIf="administrator">
                    <a [routerLink]="['/administrator']">
                        Admin
                    </a>
                    <span>&nbsp;|&nbsp;</span>
                </span>
                <a id="logout" href="/logout">
                    Log Out    
                </a>
             <div>`,
})
export class LogOut implements OnInit {

  administrator: Boolean = false
  teacher: Boolean = false

  constructor(private _topicsService: TopicsService) { }

  whatRole() {
    var that = this;

    let fn = function (result: any) {

      if (result.role == "Administrator") {

        that.administrator = true;

      } else if (result.role == "Teacher") {

        that.teacher = true;
      }
    };

    this._topicsService.getRole().subscribe(fn);
  }

  ngOnInit() {
    this.whatRole()
  }

}



/* The Main "Bootstraped" component*/
@Component({
  selector: 'my-app',
  template: `<div id="container">
               <h1 class="center"> {{name}} </h1>
               <h5> Welcome {{ user.firstName }}&nbsp;{{ user.lastName}}, You are a <b>{{ user.role }}</b></h5>
               <div id="journal" class="paper">
               <logout></logout>
               <router-outlet></router-outlet>
               </div>
             </div>`,
})
export class AppComponent implements OnInit {
  name = 'Journal';

  user: Object = {}

  constructor(private _topicsService: TopicsService) { }

  ngOnInit() {
    this._topicsService.getRole().subscribe(arg => this.user = arg);
  }

}




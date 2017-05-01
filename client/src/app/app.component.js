"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var router_1 = require('@angular/router');
var topics_service_1 = require('./topics.service');
var SharedService = (function () {
    function SharedService() {
        // Observable string sources
        this.emitChangeSource = new Subject_1.Subject();
        // Observable string streams
        this.changeEmitted$ = this.emitChangeSource.asObservable();
    }
    // Service message commands
    SharedService.prototype.emitChange = function (change) {
        this.emitChangeSource.next(change);
    };
    SharedService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SharedService);
    return SharedService;
}());
exports.SharedService = SharedService;
var EnrollmentComponent = (function () {
    function EnrollmentComponent(route, _topicsService) {
        this._topicsService = _topicsService;
        this.registered = [];
        this.class_id = route.snapshot.params['class_id'];
    }
    EnrollmentComponent.prototype.getAllRegistered = function () {
        //this._topicsService.getAllRegistered(this.class_id).subscribe(arg => this.registered = arg);
        var that = this;
        this._topicsService.getAllRegistered(this.class_id).subscribe(function (result) {
            that.registered = result;
        });
    };
    EnrollmentComponent.prototype.confirmEnrollment = function (class_id, user_id) {
        var _this = this;
        this._topicsService.setConfirmEnroll(class_id, user_id).subscribe(function () { return _this.getAllRegistered(); });
    };
    EnrollmentComponent.prototype.delete = function (class_id, user_id) {
        var _this = this;
        this._topicsService.deleteEnrolled(class_id, user_id).subscribe(function () { return _this.getAllRegistered(); });
    };
    EnrollmentComponent.prototype.ngOnInit = function () {
        this.getAllRegistered();
    };
    EnrollmentComponent = __decorate([
        core_1.Component({
            selector: 'enrollment',
            template: "<table>\n                <tr>\n                   <td colspan=\"4\">\n                       <b>Students requested enrollment or enrolled</b>\n                   </td>\n                <tr>\n                <tr>\n                    <td>User Name</td>\n                    <td>User id</td>\n                    <td>Confirm Enrollment</td>\n                    <td>Delete</td>\n                </tr>\n                <tr *ngFor='let register of registered'>\n                      <td> {{ register.firstName }} &nbsp; {{ register.lastName }}  </td>   \n                      <td> {{ register.user_id }} </td>\n                      <td *ngIf=\"!register.enrolled\">\n                          <span class=\"btn btn-primary\" (click)=\"confirmEnrollment( register.class_id, register.user_id );false\"> Confirm </span> \n                      </td>\n                      <td *ngIf=\"register.enrolled\">\n                          Enrolled\n                      </td>  \n                      <td>\n                          <a href=\"#\" (click)='delete(register.class_id, register.user_id); false'><div title=\"Remove Student\" class=\"delete glyphicon glyphicon-remove\"></div></a>       \n                      </td>\n                </tr>\n            </table>"
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, topics_service_1.TopicsService])
    ], EnrollmentComponent);
    return EnrollmentComponent;
}());
exports.EnrollmentComponent = EnrollmentComponent;
var CreateClassComponent = (function () {
    function CreateClassComponent(_topicsService, _sharedService) {
        this._topicsService = _topicsService;
        this._sharedService = _sharedService;
        this.data = {};
    }
    CreateClassComponent.prototype.save = function () {
        this._topicsService.setClass(this.data).subscribe();
        this._sharedService.emitChange('Data from child');
    };
    CreateClassComponent.prototype.ngOnInit = function () {
    };
    CreateClassComponent.prototype.ngOnDestroy = function () {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CreateClassComponent.prototype, "data", void 0);
    CreateClassComponent = __decorate([
        core_1.Component({
            selector: 'createclass',
            template: "<label>Class Title:</label>\n             <input type=\"text\" [(ngModel)]=\"data.title\">\n             <br>\n             <label>Description:</label>\n             <textarea id=\"cctextarea\" [(ngModel)]=\"data.description\"></textarea><br>\n             <button id=\"ccsave\" (click)='save()' type=\"button\" class=\"btn btn-primary\">Save class</button>\n            "
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService, SharedService])
    ], CreateClassComponent);
    return CreateClassComponent;
}());
exports.CreateClassComponent = CreateClassComponent;
var AdministratorComponent = (function () {
    function AdministratorComponent(_topicsService, _sharedService) {
        this._topicsService = _topicsService;
        this._sharedService = _sharedService;
        this.users = [];
        this.classes = [];
    }
    AdministratorComponent.prototype.ngOnInit = function () {
        this.getAllusers();
        this.getClasses();
    };
    AdministratorComponent.prototype.getClasses = function () {
        var _this = this;
        this._topicsService.getClasses().subscribe(function (arg) { return _this.classes = arg; });
    };
    AdministratorComponent.prototype.getAllusers = function () {
        var _this = this;
        this._topicsService.administrator().subscribe(function (arg) { return _this.users = arg; });
    };
    AdministratorComponent.prototype.setRole = function (user_id) {
        var _this = this;
        this._topicsService.setRole(user_id).subscribe(function () { return _this.getAllusers(); });
    };
    AdministratorComponent.prototype.deleteClass = function (class_id) {
        var _this = this;
        this._topicsService.deleteClass(class_id).subscribe(function () { return _this.ngOnInit(); });
    };
    AdministratorComponent = __decorate([
        core_1.Component({
            selector: 'administrator',
            template: "\n            <b>Roles: 1 = Administrator,&nbsp;2 = Teacher,&nbsp;3=Student</b>\n            <table>\n                <tr>  \n                    <td> User id</td> \n                    <td> First Name </td>\n                    <td> Last Name </td>\n                    <td> Role </td>\n                    <td> Email </td>\n                    <td> Toggle Role Student/Teacher </td>\n                    <td> Remove User </td>\n                </tr>\n                <tr *ngFor='let user of users'>  \n                    <td> {{ user.user_id }} </td> \n                    <td> {{ user.firstName }} </td>\n                    <td> {{ user.lastName }} </td>\n                    <td class=\"roleCell\"> {{ user.role }} </td>\n                    <td> {{ user.email }} </td>\n                    <td>\n                        <a *ngIf=\"(user.role != '1') && !user.hasClass\" href='#' (click)='setRole(user.user_id);false'> Toggle Role</a>\n                        <span *ngIf=\"user.hasClass\">Has Class(es)</span>\n                    </td>\n                </tr>\n            </table>\n            <br>\n            <table>\n                <tr>\n                    <td> Creator User id </td>\n                    <td> Class id </td>\n                    <td> Delete Class</td>\n                </tr>\n                <tr *ngFor='let class of classes'>\n                    <td> {{ class.user_id  }} </td>\n                    <td> {{ class.class_id }} </td>\n                    <td>  <a href=\"#\" (click)='deleteClass(class.class_id); false'><div title=\"deleteClass\" class=\"delete glyphicon glyphicon-remove\"></div></a>   </td>\n                </tr>\n            </table>\n            "
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService, SharedService])
    ], AdministratorComponent);
    return AdministratorComponent;
}());
exports.AdministratorComponent = AdministratorComponent;
var TeacherAdminComponent = (function () {
    function TeacherAdminComponent(_topicsService, _sharedService) {
        var _this = this;
        this._topicsService = _topicsService;
        this._sharedService = _sharedService;
        this.myClasses = [];
        _sharedService.changeEmitted$.subscribe(function () { return _this.getClassesByCreator(); }); //event from sub-route
    }
    TeacherAdminComponent.prototype.ngOnInit = function () {
        this.getClassesByCreator();
    };
    TeacherAdminComponent.prototype.getClassesByCreator = function () {
        var _this = this;
        //Get the classes created by this teacher, the server knows who the user is and it's more secure than passing it to the server.
        this._topicsService.getClassesByCreator().subscribe(function (arg) { return _this.myClasses = arg; });
    };
    TeacherAdminComponent = __decorate([
        core_1.Component({
            selector: 'teacheradmin',
            template: "<span class=\"btn btn-primary\" [routerLink]=\"['createclass']\"> Create Class </span>  \n              <div>\n                  <div class=\"left\">\n                      <h4> Your classes: </h4>\n                      <h6>( Manage Enrollment )</h6>\n                      <ul class=\"nav nav-pills\">\n                          <li *ngFor='let class of myClasses' role=\"presentation\" >   \n                                  <a href=\"#\" [routerLink]=\"['enrollment', class.class_id ]\">{{ class.title }}</a>\n                          </li>\n                      </ul>\n                  </div>\n                  <div class=\"right\">    \n                      <router-outlet></router-outlet>\n                  </div>\n             </div>"
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService, SharedService])
    ], TeacherAdminComponent);
    return TeacherAdminComponent;
}());
exports.TeacherAdminComponent = TeacherAdminComponent;
var ClassComponent = (function () {
    function ClassComponent(_topicsService) {
        this._topicsService = _topicsService;
        this.register = false;
        this.cancel = false;
        this.creator = {};
    }
    ClassComponent.prototype.registered = function () {
        //reset values
        this.register = false;
        this.cancel = false;
        var that = this;
        var fn = function (arg) {
            if (arg != null) {
                if (arg['enrolled'] == false) {
                    that.cancel = true;
                }
            }
            else {
                that.register = true;
            }
        };
        this._topicsService.getRegistered(this.class['class_id']).subscribe(fn);
    };
    ClassComponent.prototype.creatorInfo = function () {
        var _this = this;
        this._topicsService.getUserById(this.class['user_id']).subscribe(function (arg) { return _this.creator = arg; });
    };
    ClassComponent.prototype.enroll = function () {
        var _this = this;
        this._topicsService.setEnroll(this.class['class_id']).subscribe(function () { return _this.registered(); });
    };
    ClassComponent.prototype.alert = function () {
        alert("You must enroll and be confirmed before you can enter");
    };
    ClassComponent.prototype.ngOnInit = function () {
        this.registered();
        this.creatorInfo();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ClassComponent.prototype, "class", void 0);
    ClassComponent = __decorate([
        core_1.Component({
            selector: 'class',
            template: "<div>\n\n                <div *ngIf=\"!register && !cancel\" class=\"title\"> <h3> <a class=\"viewpostlink\" [routerLink]=\"['/topics', class.class_id ]\"> {{ class.title }} </a>  </h3> </div>\n                <div *ngIf=\"register || cancel\" class=\"title\"> <h3> <a class=\"viewpostlink\" (click)=\"alert()\"> {{ class.title }} </a>  </h3> </div>\n\n                <p class=\"description\"> {{ class.description }} </p>\n                <div class=\"createdby\"><b>Instructor&nbsp;:&nbsp;{{creator.firstName}}&nbsp;{{creator.lastName}}</b></div>\n\n             </div>\n             <span *ngIf=\"register\" class=\"enrolltext\"> You are not enrolled.\n                 <a href=\"#\" class=\"enroll\" (click)='enroll();false'>Enroll ?</a>\n             </span>\n             <span *ngIf=\"cancel\" class=\"enrolltext\">\n                 <a href=\"#\" class=\"enroll\">Cancel enrollment request?</a>\n             </span>\n             ",
            providers: [topics_service_1.TopicsService]
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService])
    ], ClassComponent);
    return ClassComponent;
}());
exports.ClassComponent = ClassComponent;
var ClassesComponent = (function () {
    function ClassesComponent(_topicsService) {
        this._topicsService = _topicsService;
        this.classes = [];
        this.student = false;
    }
    ClassesComponent.prototype.getClasses = function () {
        var _this = this;
        this._topicsService.getClasses().subscribe(function (arg) { return _this.classes = arg; });
    };
    ClassesComponent.prototype.ngOnInit = function () {
        this.getClasses(); //bootstrap data
    };
    ClassesComponent = __decorate([
        core_1.Component({
            selector: 'classes',
            template: "<div id=\"classHeading\">Classes</div>\n             <div id=\"classes\">\n                 <div class=\"class\" *ngFor='let class of classes'>\n                     <class [class]=\"class\" ></class>   \n                 </div>\n             </div>",
            providers: [topics_service_1.TopicsService]
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService])
    ], ClassesComponent);
    return ClassesComponent;
}());
exports.ClassesComponent = ClassesComponent;
var TopicView = (function () {
    function TopicView(route, _topicsService) {
        this._topicsService = _topicsService;
        this.posts = [];
        this.user = { user_id: null };
        this.hasPosted = false;
        this.id = route.snapshot.params['id'];
    }
    TopicView.prototype.ngOnInit = function () {
        //this.getTopicPosts()
        this.getUser();
    };
    //input from createPost
    TopicView.prototype.onNotify = function (topic_id, data) {
        var _this = this;
        this._topicsService.setPost(topic_id, data.content).subscribe(function () { return _this.getUser(); });
    };
    /*
    getTopicPosts() {
      this._topicsService.getTopicPosts(this.id).subscribe(arg => this.posts = arg);
    }*/
    TopicView.prototype.getUser = function () {
        var that = this;
        var fn_1 = function (user) {
            if (user) {
                that.user = user;
                var _user_id_1 = user.user_id;
                var fn_2 = function (posts) {
                    that.posts = posts;
                    for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
                        var post = posts_1[_i];
                        if (_user_id_1 = post.user_id) {
                            that.hasPosted = true;
                        }
                    }
                };
                that._topicsService.getTopicPosts(that.id).subscribe(fn_2);
            }
        };
        this._topicsService.getRole().subscribe(fn_1);
    };
    TopicView = __decorate([
        core_1.Component({
            selector: 'topicview',
            template: "\n            <div>\n                <div class=\"buttonContainer\">\n                    <a *ngIf=\"!hasPosted\" type=\"button\" class=\"btn-custom btn btn-primary btn-lg\" data-toggle=\"modal\" data-target=\"#postModal\">Post response</a>\n                </div>\n                <div>\n                     <div class=\"class post\" *ngFor='let post of posts'>\n                            <div class=\"content\"> \n                                 {{ post.content }}\n                                 <span *ngIf=\"post.user_id==user.user_id\">By Me</span>\n                            </div>\n                            <div class=\"by\">Posted by&nbsp;{{ post.user }}</div>\n                            <!-- <span class=\"creation\">  {{ post.created }}</span>-->\n                    </div> \n                </div>\n                <createpost (notify)='onNotify( id , $event)'></createpost>\n            </div>    \n            "
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, topics_service_1.TopicsService])
    ], TopicView);
    return TopicView;
}());
exports.TopicView = TopicView;
var CreatePost = (function () {
    function CreatePost() {
        this.notify = new core_1.EventEmitter(); // Textarea contents
    }
    //emit the event
    CreatePost.prototype.save = function (value) {
        this.notify.emit({ content: value });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], CreatePost.prototype, "notify", void 0);
    CreatePost = __decorate([
        core_1.Component({
            selector: 'createpost',
            template: "\n            <!-- Modal -->\n            <div class=\"modal fade\" id=\"postModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n                <div class=\"modal-dialog\" role=\"document\">\n                    <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                          <h4 class=\"modal-title\" id=\"myModalLabel\">Post to Topic</h4>\n                        </div>\n                        <div class=\"modal-body\">\n                            <textarea id=\"cptextarea\" #textarea></textarea>\n                        </div>\n                        <div class=\"modal-footer\">\n                            <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n                            <button (click)='save(textarea.value)' type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Save changes</button>\n                        </div>\n                   </div>\n               </div>\n            </div>\n            "
        }), 
        __metadata('design:paramtypes', [])
    ], CreatePost);
    return CreatePost;
}());
exports.CreatePost = CreatePost;
var CreateTopic = (function () {
    function CreateTopic() {
        this.notify = new core_1.EventEmitter(); // Textarea contents
    }
    //emit the event
    CreateTopic.prototype.save = function (value) {
        this.notify.emit({ heading: value });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], CreateTopic.prototype, "notify", void 0);
    CreateTopic = __decorate([
        core_1.Component({
            selector: 'createtopic',
            template: "\n            <!-- Modal -->\n            <div class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n                <div class=\"modal-dialog\" role=\"document\">\n                    <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                          <h4 class=\"modal-title\" id=\"myModalLabel\">Create Topic</h4>\n                        </div>\n                        <div class=\"modal-body\">\n                            <textarea id=\"cttextarea\" #textarea></textarea>\n                        </div>\n                        <div class=\"modal-footer\">\n                            <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n                            <button (click)='save(textarea.value)' type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Save changes</button>\n                        </div>\n                   </div>\n               </div>\n            </div>\n            "
        }), 
        __metadata('design:paramtypes', [])
    ], CreateTopic);
    return CreateTopic;
}());
exports.CreateTopic = CreateTopic;
var TopicsComponent = (function () {
    function TopicsComponent(route, _topicsService) {
        this._topicsService = _topicsService;
        this.topics = [];
        this.teacher = false;
        this.class_id = route.snapshot.params['class_id'];
    }
    //show the textarea
    //showCreateTopic: boolean = false
    TopicsComponent.prototype.getTopics = function () {
        var _this = this;
        //this._topicsService.getTopics().subscribe(arg => this.topics = arg);
        this._topicsService.getTopicsByClass(this.class_id).subscribe(function (arg) { return _this.topics = arg; });
    };
    TopicsComponent.prototype.ngOnInit = function () {
        this.whatRole();
        this.getTopics(); //bootstrap data
    };
    //input from createTopic
    TopicsComponent.prototype.onNotify = function (data) {
        var _this = this;
        //this._topicsService.setTopic(data.heading).subscribe(arg => this.topics = arg); // need to pass the  class id
        this._topicsService.setTopic(data.heading, this.class_id).subscribe(function () { return _this.getTopics(); });
        //this.showCreateTopic = false; //hide the textarea
    };
    TopicsComponent.prototype.whatRole = function () {
        var that = this;
        var fn = function (result) {
            if (result.role == "Teacher") {
                that.teacher = true;
            }
        };
        this._topicsService.getRole().subscribe(fn);
    };
    //delete a topic
    TopicsComponent.prototype.delete = function (topic_id, user_id, event) {
        var _this = this;
        this._topicsService.deleteTopic(topic_id).subscribe(function () { return _this.getTopics(); });
    };
    TopicsComponent = __decorate([
        core_1.Component({
            selector: 'topics',
            template: "\n            <div>\n              <div class=\"buttonContainer\">\n                  <div class=\"topics\">Topics</div><br style=\"clear:both;display:inline;\">\n                  <a *ngIf=\"teacher\" (click)=\"showCreateTopic='True'\" type=\"button\" class=\"btn-custom btn btn-primary btn-lg\" data-toggle=\"modal\" data-target=\"#myModal\">Add Topic</a>\n              </div>\n              <ul>\n                  <li *ngFor='let topic of topics'>\n                      <a [routerLink]=\"['/topic', topic.topic_id ]\" class=\"heading\">{{ topic.heading }}</a>\n                      <!--\n                      <div class=\"createdBy\"> {{ topic.user_id }}</div>\n                      <div class=\"creation\"> {{ topic.created }}</div> -->\n                      <!-- <a class=\"viewpostlink\" [routerLink]=\"[ '/post:' + topic.topic_id ]\">Post</a> -->\n\n                      <a *ngIf=\"teacher\" href=\"#\" (click)='delete(topic.topic_id, topic.user_id, $event); false'><div title=\"Delete Topic\" class=\"altdelete glyphicon glyphicon-remove\"></div></a>\n                  </li>\n              </ul>\n              <createtopic (notify)='onNotify($event)'></createtopic>\n            </div>\n            ",
            providers: [topics_service_1.TopicsService],
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, topics_service_1.TopicsService])
    ], TopicsComponent);
    return TopicsComponent;
}());
exports.TopicsComponent = TopicsComponent;
//should really be a menu bar?
var LogOut = (function () {
    function LogOut(_topicsService) {
        this._topicsService = _topicsService;
        this.administrator = false;
        this.teacher = false;
    }
    LogOut.prototype.whatRole = function () {
        var that = this;
        var fn = function (result) {
            if (result.role == "Administrator") {
                that.administrator = true;
            }
            else if (result.role == "Teacher") {
                that.teacher = true;
            }
        };
        this._topicsService.getRole().subscribe(fn);
    };
    LogOut.prototype.ngOnInit = function () {
        this.whatRole();
    };
    LogOut = __decorate([
        core_1.Component({
            selector: 'logout',
            template: "<a [routerLink]=\"['/classes']\">View Classes</a>\n             <div id=\"usernav\">\n                <span *ngIf=\"teacher\">\n                    <a [routerLink]=\"['/teacheradmin']\">\n                        Admin\n                    </a>\n                    <span>&nbsp;|&nbsp;</span>\n                </span>\n                <span *ngIf=\"administrator\">\n                    <a [routerLink]=\"['/administrator']\">\n                        Admin\n                    </a>\n                    <span>&nbsp;|&nbsp;</span>\n                </span>\n                <a id=\"logout\" href=\"/logout\">\n                    Log Out    \n                </a>\n             <div>",
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService])
    ], LogOut);
    return LogOut;
}());
exports.LogOut = LogOut;
/* The Main "Bootstraped" component*/
var AppComponent = (function () {
    function AppComponent(_topicsService) {
        this._topicsService = _topicsService;
        this.name = 'Journal';
        this.user = {};
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._topicsService.getRole().subscribe(function (arg) { return _this.user = arg; });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<div id=\"container\">\n               <h1 class=\"center\"> {{name}} </h1>\n               <h5> Welcome {{ user.firstName }}&nbsp;{{ user.lastName}}, You are a <b>{{ user.role }}</b></h5>\n               <div id=\"journal\" class=\"paper\">\n               <logout></logout>\n               <router-outlet></router-outlet>\n               </div>\n             </div>",
        }), 
        __metadata('design:paramtypes', [topics_service_1.TopicsService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
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
var http_1 = require('@angular/http');
//import { Observable } from 'rxjs/Observable';
var Rx_1 = require('rxjs/Rx');
require('rxjs/add/operator/catch');
var core_1 = require('@angular/core');
require('rxjs/add/operator/map');
var TopicsService = (function () {
    //http: Http;
    //topics_Url: string = 'http://localhost:3000/topics'
    function TopicsService(http) {
        this.http = http;
        this.http = http;
    }
    TopicsService.prototype.setClass = function (data) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        console.log(data);
        return this.http.post('http://localhost:3000/api/classes', JSON.stringify(data), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.setTopic = function (heading, class_id) {
        var topic = {
            "class_id": class_id,
            "heading": heading
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        //return this.http.post('http://localhost:3000/topics', JSON.stringify(  [ { "name" : "will"} ] ) , { headers: headers }).map(this.extractData).catch(this.handleError);
        return this.http.post('http://localhost:3000/topics', JSON.stringify(topic), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.setPost = function (id, content) {
        var post = {
            "topic_id": id,
            "content": content
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/posts/' + id, JSON.stringify(post), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.setEnroll = function (class_id) {
        var _class = {
            "class_id": class_id,
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/enroll/', JSON.stringify(_class), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.setConfirmEnroll = function (class_id, user_id) {
        var enroll = {
            "class_id": class_id,
            "user_id": user_id
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/confirmenroll/', JSON.stringify(enroll), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.setRole = function (user_id) {
        var user = {
            "user_id": user_id,
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/setrole/', JSON.stringify(user), { headers: headers }).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getClasses = function () {
        return this.http.get('http://localhost:3000/api/classes').map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getClassesByCreator = function () {
        return this.http.get('http://localhost:3000/api/classesbycreator').map(function (res) { return res.json(); });
    };
    /*Used during development*/
    /*
    getTopics() {
        return this.http.get('http://localhost:3000/topics').map((res: Response) => { return res.json(); });
    }*/
    TopicsService.prototype.getTopicsByClass = function (class_id) {
        return this.http.get('http://localhost:3000/api/topics/' + class_id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getTopicPosts = function (id) {
        return this.http.get('http://localhost:3000/api/posts/' + id).map(function (res) { return res.json(); });
        //return this.http.get('http://localhost:3000/api/topic/' + id).map((res: Response) => { return res.json(); });
    };
    //more safe to not pass user id as it is known by the server.
    TopicsService.prototype.getRole = function () {
        return this.http.get('http://localhost:3000/api/role').map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getRegistered = function (class_id) {
        return this.http.get('http://localhost:3000/api/enrolled/' + class_id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getAllRegistered = function (class_id) {
        return this.http.get('http://localhost:3000/api/allenrolled/' + class_id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getAllusers = function () {
        return this.http.get('http://localhost:3000/api/allusers').map(function (res) { return res.json(); });
    };
    TopicsService.prototype.getUserById = function (user_id) {
        return this.http.get('http://localhost:3000/api/getuser/' + user_id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.deleteTopic = function (id) {
        return this.http.delete('http://localhost:3000/api/topic/' + id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.deleteEnrolled = function (class_id, user_id) {
        var enrolled = {
            "class_id": class_id,
            "user_id": user_id,
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/deleteenrolled/', JSON.stringify(enrolled), { headers: headers }).map(function (res) { return res.json(); });
    };
    //check if the user has classes
    TopicsService.prototype.hasClass = function (user_id) {
        return this.http.get('http://localhost:3000/api/hasClass/' + user_id).map(function (res) { return res.json(); });
    };
    TopicsService.prototype.administrator = function () {
        var _this = this;
        return this.http.get('http://localhost:3000/api/allusers/').map(function (res) { return res.json(); })
            .flatMap(function (users) {
            if (users.length > 0) {
                return Rx_1.Observable.forkJoin(users.map(function (user) {
                    return _this.http.get('http://localhost:3000/api/hasClass/' + user.user_id).map(function (res) {
                        var result = res.json();
                        user.hasClass = result.hasClass;
                        return user;
                    });
                }));
            }
            return Rx_1.Observable.of([]);
        });
    };
    //remove user
    TopicsService.prototype.deleteUser = function (user_id) {
        return this.http.delete('http://localhost:3000/api/user/' + user_id).map(function (res) { return res.json(); });
    };
    //remove class
    TopicsService.prototype.deleteClass = function (class_id) {
        return this.http.delete('http://localhost:3000/api/class/' + class_id).map(function (res) { return res.json(); });
    };
    TopicsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TopicsService);
    return TopicsService;
}());
exports.TopicsService = TopicsService;
//# sourceMappingURL=topics.service.js.map
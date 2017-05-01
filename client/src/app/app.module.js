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
var platform_browser_1 = require('@angular/platform-browser');
var app_component_1 = require('./app.component');
var app_component_2 = require('./app.component');
var app_component_3 = require('./app.component');
var http_1 = require('@angular/http');
var topics_service_1 = require('./topics.service');
var app_component_4 = require('./app.component');
var app_component_5 = require('./app.component');
var app_component_6 = require('./app.component');
var app_component_7 = require('./app.component');
var app_component_8 = require('./app.component');
var app_component_9 = require('./app.component');
var app_component_10 = require("./app.component");
var app_component_11 = require("./app.component");
var app_component_12 = require('./app.component');
var app_component_13 = require('./app.component');
var routing_1 = require('./routing');
var forms_1 = require('@angular/forms');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule,
                http_1.HttpModule,
                routing_1.routing,
                forms_1.FormsModule],
            declarations: [app_component_1.AppComponent,
                app_component_2.LogOut,
                app_component_5.TopicsComponent,
                app_component_3.CreateTopic,
                app_component_6.TopicView,
                app_component_7.CreatePost,
                app_component_8.ClassesComponent,
                app_component_9.ClassComponent,
                app_component_11.EnrollmentComponent,
                app_component_10.CreateClassComponent,
                app_component_12.TeacherAdminComponent,
                app_component_13.AdministratorComponent
            ],
            providers: [topics_service_1.TopicsService,
                app_component_4.SharedService],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
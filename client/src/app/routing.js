"use strict";
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
//import {LocationStrategy, HashLocationStrategy} from '@angular/common';
var app_component_2 = require("./app.component");
var app_component_3 = require("./app.component");
var app_component_4 = require("./app.component");
var app_component_5 = require("./app.component");
var app_component_6 = require("./app.component");
var app_component_7 = require("./app.component");
var APP_ROUTES = [
    //{ path:'dashboard', component: TopicsComponent, pathMatch: 'full' },
    { path: 'dashboard', component: app_component_3.ClassesComponent, pathMatch: 'full' },
    { path: 'topics/:class_id', component: app_component_1.TopicsComponent, pathMatch: 'full' },
    { path: 'topic/:id', component: app_component_2.TopicView, pathMatch: 'full' },
    { path: 'classes', component: app_component_3.ClassesComponent, pathMatch: 'full' },
    //{ path:'admin', component: AdminComponent, pathMatch: 'full'},
    { path: 'teacheradmin', component: app_component_6.TeacherAdminComponent,
        children: [
            { path: 'createclass', component: app_component_4.CreateClassComponent, pathMatch: 'full' },
            { path: 'enrollment/:class_id', component: app_component_5.EnrollmentComponent, pathMatch: 'full' }
        ]
    },
    { path: 'administrator', component: app_component_7.AdministratorComponent, pathMatch: 'full' }
];
exports.routing = router_1.RouterModule.forRoot(APP_ROUTES);
//# sourceMappingURL=routing.js.map
import { Routes, RouterModule } from "@angular/router";
import { TopicsComponent } from "./app.component";
//import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { TopicView } from "./app.component";
import { ClassesComponent } from "./app.component";
import { CreateClassComponent } from "./app.component";
import { EnrollmentComponent } from "./app.component";

import { TeacherAdminComponent } from "./app.component";
import { AdministratorComponent } from "./app.component";

const APP_ROUTES: Routes = [ 
                                 //{ path:'dashboard', component: TopicsComponent, pathMatch: 'full' },
                                 { path:'dashboard', component: ClassesComponent, pathMatch: 'full' },
                                 { path:'topics/:class_id', component: TopicsComponent, pathMatch: 'full' },
                                 { path:'topic/:id', component: TopicView, pathMatch: 'full' },
                                 { path:'classes', component: ClassesComponent, pathMatch: 'full'},
                                 //{ path:'admin', component: AdminComponent, pathMatch: 'full'},
                                 { path: 'teacheradmin', component: TeacherAdminComponent,
                                    children: [
                                                  { path: 'createclass',  component: CreateClassComponent, pathMatch: 'full' },
                                                  { path: 'enrollment/:class_id',  component: EnrollmentComponent, pathMatch: 'full' }
                                              ]
                                 },
                                 { path: 'administrator', component: AdministratorComponent, pathMatch: 'full'}

                            ];

export const routing = RouterModule.forRoot(APP_ROUTES);
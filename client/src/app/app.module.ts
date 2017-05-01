import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { LogOut } from './app.component';
import { CreateTopic } from './app.component';

import { HttpModule } from '@angular/http';
import { TopicsService } from './topics.service';
import { SharedService } from './app.component'
import { TopicsComponent } from './app.component';
import { TopicView } from './app.component';
import { CreatePost } from './app.component';
import { ClassesComponent } from './app.component';
import { ClassComponent } from './app.component';
import { CreateClassComponent } from "./app.component";
import { EnrollmentComponent } from "./app.component";

import { TeacherAdminComponent } from './app.component';
import { AdministratorComponent } from './app.component';

import { routing } from './routing'
import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule,
                  HttpModule,
                  routing,
                  FormsModule ],

  declarations: [ AppComponent,
                  LogOut,
                  TopicsComponent,
                  CreateTopic,
                  TopicView,
                  CreatePost,
                  ClassesComponent,
                  ClassComponent,
                  EnrollmentComponent,
                  CreateClassComponent,
                  TeacherAdminComponent,
                  AdministratorComponent
                 ],

  providers: [ TopicsService,
               SharedService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

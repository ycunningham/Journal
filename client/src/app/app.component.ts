import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div id="container">
               <h1 class="center"> {{name}} </h1>
               <div id="journal" class="paper"></div>
             </div>`,
})
export class AppComponent  { name = 'Journal'; }

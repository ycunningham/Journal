import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';

//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()

export class TopicsService {
    //http: Http;
    //topics_Url: string = 'http://localhost:3000/topics'

    constructor(public http: Http) {
        this.http = http;
    }
    
    setClass( data: Object) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        console.log(
             data
        );

        return this.http.post('http://localhost:3000/api/classes', JSON.stringify( data ), { headers: headers }).map((res: Response) => { return res.json(); });
    }

    setTopic(heading: string, class_id: string) {

        let topic = {
            "class_id": class_id,
            "heading": heading
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        //return this.http.post('http://localhost:3000/topics', JSON.stringify(  [ { "name" : "will"} ] ) , { headers: headers }).map(this.extractData).catch(this.handleError);
        return this.http.post('http://localhost:3000/topics', JSON.stringify( topic ), { headers: headers }).map((res: Response) => { return res.json(); });

    }


    setPost(id: string, content: string) {

        let post = {
            "topic_id": id,
            "content": content
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3000/api/posts/' + id, JSON.stringify(post), { headers: headers }).map((res: Response) => { return res.json(); });

    }

    setEnroll(class_id: string) {

        let _class = {
            "class_id": class_id,

        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3000/api/enroll/', JSON.stringify(_class), { headers: headers }).map((res: Response) => { return res.json(); });  
    }

     setConfirmEnroll(class_id: string, user_id: string) {

        let enroll = {
            "class_id": class_id,
            "user_id": user_id
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3000/api/confirmenroll/', JSON.stringify(enroll), { headers: headers }).map((res: Response) => { return res.json(); });  
    }

    setRole( user_id: string) {
        let user = {
            "user_id": user_id,

        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3000/api/setrole/', JSON.stringify(user), { headers: headers }).map((res: Response) => { return res.json(); }); 
    }

    getClasses() {
        return this.http.get('http://localhost:3000/api/classes').map((res: Response) => { return res.json(); });
    }
    
    getClassesByCreator() {
        return this.http.get('http://localhost:3000/api/classesbycreator').map((res: Response) => { return res.json(); });
    }

    /*Used during development*/
    /*
    getTopics() {
        return this.http.get('http://localhost:3000/topics').map((res: Response) => { return res.json(); });
    }*/

    getTopicsByClass(class_id: string) {
        return this.http.get('http://localhost:3000/api/topics/' + class_id).map((res: Response) => { return res.json(); });
    }

    getTopicPosts(id: string) { //id is a topic id
        return this.http.get('http://localhost:3000/api/posts/' + id).map((res: Response) => { return res.json(); });
        //return this.http.get('http://localhost:3000/api/topic/' + id).map((res: Response) => { return res.json(); });
    }
    

    //more safe to not pass user id as it is known by the server.
    getRole() {
         return this.http.get('http://localhost:3000/api/role').map((res: Response) => { return res.json(); });
    }

    getRegistered(class_id: string) {
        return this.http.get('http://localhost:3000/api/enrolled/' + class_id).map((res: Response) => { return res.json(); });
    }

    getAllRegistered(class_id: string) {
        return this.http.get('http://localhost:3000/api/allenrolled/' + class_id).map((res: Response) => { return res.json(); });
    }
    
    getAllusers() {
         return this.http.get('http://localhost:3000/api/allusers').map((res: Response) => { return res.json(); });
    }

    getUserById(user_id: string) {
         return this.http.get('http://localhost:3000/api/getuser/' + user_id).map((res: Response) => { return res.json(); });
    }

    deleteTopic( id: string ) {
       return this.http.delete('http://localhost:3000/api/topic/' + id).map((res: Response) => { return res.json(); });
    }

    deleteEnrolled( class_id: string, user_id: string ) {
        let enrolled = {
            "class_id": class_id,
            "user_id": user_id,
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3000/api/deleteenrolled/', JSON.stringify( enrolled ), { headers: headers }).map((res: Response) => { return res.json(); }); 
    }

    //check if the user has classes
    hasClass(user_id: string){
        return this.http.get('http://localhost:3000/api/hasClass/' + user_id).map((res: Response) => { return res.json(); });
    }

    administrator(): Observable<any[]> {
        return this.http.get('http://localhost:3000/api/allusers/').map((res: any) => res.json())
        .flatMap( (users: any[]) => {
          if (users.length > 0) {
          return Observable.forkJoin(
              users.map((user: any) => {

                  return this.http.get('http://localhost:3000/api/hasClass/' + user.user_id).map( (res: any) => {
                      let result: any = res.json();
                      user.hasClass = result.hasClass;
                      return user;
                     });
              })
         );
       }
       return Observable.of([]);
     });
    }

    //remove user
    deleteUser( user_id: string ) {       
        return this.http.delete('http://localhost:3000/api/user/' + user_id).map((res: Response) => { return res.json(); });
    }

    //remove class
    deleteClass( class_id: string ) {       
        return this.http.delete('http://localhost:3000/api/class/' + class_id).map((res: Response) => { return res.json(); });
    }



    /*
    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }*/

}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import { SocketService } from "./socket.service";
import { SocketEventName } from '@shared/socket-communication/SocketEventName';

export class Message{
    constructor(public title: string, public textbody: string) {} 
}
@Injectable({
    providedIn: 'root'
})
export class MessageService {

  message="";
  messagelist= new Array<Message>()
  observer: Observer<Message[]>;

  constructor(private socketService: SocketService) {}
  getAllMessages(): Observable<Message[]>{
      
      const obs= new Observable<Message[]>(observer => {
          this.observer = observer;
      
          //Modules  add
          this.socketService.getMessage(SocketEventName.ProductionModules_Added).subscribe(
              () => this.addAndDeleteMessage("Module","Module added"),  
              (err) => this.message="error during Module registration",
              null
          ),
          // Moduled change
          this.socketService.getMessage(SocketEventName.ProductionModules_Changed).subscribe(
              () => this.addAndDeleteMessage("Module","Module changed"),  
              (err) => this.message="error during Module changing",
              null
          ),
          // Modules delete
          this.socketService.getMessage(SocketEventName.ProductionModules_Deleted).subscribe(
              () => this.addAndDeleteMessage("Module","Module deleted"), 
              (err) => this.message="error during Module deletion",
              null
          ),
          //Skills  add
          this.socketService.getMessage(SocketEventName.Skills_Added).subscribe(
              () => this.addAndDeleteMessage("Skill","Skill added"), 
              (err) => this.message="error during Skill registration",
              null
          ), 
          // Skills change
          this.socketService.getMessage(SocketEventName.Skills_Changed).subscribe(
              () => this.addAndDeleteMessage("Skill","Skill changed"), 
              (err) => this.message="error during Skill changing",
              null
          ),
          // Skills delete
          this.socketService.getMessage(SocketEventName.Skills_Deleted).subscribe(
              () => this.addAndDeleteMessage("Skill","Skill deleted"), 
              (err) => this.message="error during Skill deletion",
              null
          ),
          //Capabilities  add
          this.socketService.getMessage(SocketEventName.Capabilities_Added).subscribe(
              () =>  this.addAndDeleteMessage("Capability","Capability added"),
              (err) => this.message="error during Capability registration",
              null  
          ), 
          // Capabilities change
          this.socketService.getMessage(SocketEventName.Skills_Changed).subscribe(
              () =>  this.addAndDeleteMessage("Capability","Capability changed"),
              (err) => this.message="error during Capability changing",
              null  
          ), 
          // Capabilities delete
          this.socketService.getMessage(SocketEventName.Skills_Deleted).subscribe(
              () => this.addAndDeleteMessage("Capability","Capability deleted"), 
              (err) => this.message="error during Capability deletion",
              null  
          );
          this.observer.next(this.messagelist);
      });
      return obs;
  }
  private addAndDeleteMessage(title: string, textbody: string){
      {this.messagelist.push(new Message(title, textbody));   
          this.observer.next(this.messagelist);
          setTimeout(() => {this.messagelist.splice(0,1); 
              this.observer.next(this.messagelist);},2000);
      }
  }
}

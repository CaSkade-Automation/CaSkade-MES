import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'module-management',
  templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {
  
  constructor(private httpClient: HttpClient, private socketService: SocketService) {}

  incomingmsg = [];
  modules = [];
  
  ngOnInit() {
    this.httpClient.get('/api/modules').subscribe((data:any) => this.modules = data);
    

    this.socketService
        .getMessage()
        .subscribe(msg => {
          console.log('Incoming msg', msg);
          this.modules.push(msg);
        });
  }

  sendMsg(msg) {
    console.log('sdsd', msg);
    this.socketService.sendMessage(msg);
 }
}
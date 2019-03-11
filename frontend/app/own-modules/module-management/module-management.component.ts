import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { SelfDescription } from './self-description';

@Component({
  selector: 'module-management',
  templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {
  
  constructor(private httpClient: HttpClient, private socketService: SocketService) {}

  incomingmsg = [];
  modules : SelfDescription[];
  
  ngOnInit() {
    this.httpClient.get('/api/modules').subscribe((data:SelfDescription[]) => this.modules = data);
    

    this.socketService
        .getMessage()
        .subscribe((data:SelfDescription) => {
          console.log('Incoming msg', data);
          this.modules.push(data);
        });
  }

  sendMsg(msg) {
    console.log('sdsd', msg);
    this.socketService.sendMessage(msg);
 }
}
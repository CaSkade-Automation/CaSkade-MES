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

  disconnectModule(moduleId) {
        // TODO: Post to API to really delete element
    this.httpClient.delete(`api/modules/${moduleId}`).subscribe(
      data => {this.removeModuleCard(moduleId)}),
      error => console.log('An error happened, module could not be disconnected'
    );    
  }

  removeModuleCard(moduleId) {
    // remove module with that id from the list
    for (let i = 0; i < this.modules.length; i++) {
      if (this.modules[i].header.id == moduleId) {
        this.modules.splice(i, 1);
        break;
      }      
    }
  }
}
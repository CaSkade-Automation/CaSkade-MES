import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketService } from "../../shared/services/socket.service";

@Component({
  selector: 'module-management',
  templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {

  modules = [];
  //modules = new Array<Module>();
  interval: any;
  socketMsg : string;

  constructor(private httpclient: HttpClient, private socketService: SocketService) { }

  ngOnInit(): void {
    this.initSocketConnection();
  }

  private sendMsg(){
    console.log("clicked button");
    this.socketService.send("asd");
  }

  private initSocketConnection() {
    this.socketService.initSocket();
    this.socketService.onMessage("module-registration")
      .subscribe((msg: any) => {
        console.log(JSON.stringify(msg))
        // let newModule;
        this.modules.push(msg);
        console.log(this.modules)
    });
  }

}

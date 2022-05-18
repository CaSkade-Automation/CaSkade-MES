import { Injectable } from '@angular/core';
import {Injector} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ServiceLocator {
    static injector: Injector;
}

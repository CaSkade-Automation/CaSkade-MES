import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { map, startWith, take, tap} from 'rxjs/operators';
import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { ModuleSocketService } from "./sockets/module-socket.service";
import { ProductionModule } from "../models/ProductionModule";
import { CapabilitySocketService } from "./sockets/capability-socket.service";
import { SkillSocketService } from "./sockets/skill-socket.service";
import { MessageService } from "./message.service";
import { Property } from "../models/Property";
import { PropertyDTO } from "../../../../shared/src/models/properties/PropertyDTO";
import { Capability } from "../models/Capability";

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    apiRoot = "/api";

    private propertySubject$ = new BehaviorSubject<Property[]>([]);


    // onModuleAdded$ = this.moduleSocket.onModulesAdded()
    // onModuleDeleted$ = this.moduleSocket.onModuleDeleted()

    onCapabilityAdded$ = this.capabilitySocket.onCapabilitiesAdded();
    onCapabilityDeleted$ = this.capabilitySocket.onCapabilityDeleted();
    // onSkillAdded$ = this.skillSocket.onSkillsAdded();
    // onSkillDeleted$ = this.skillSocket.onSkillDeleted();
    // onCapabilityOrSkillChanged$ = merge(this.onCapabilityAdded$, this.onCapabilityDeleted$, this.onSkillAdded$, this.onSkillDeleted$)

    constructor(
        private http: HttpClient,
        private capabilitySocket: CapabilitySocketService,
        private messageService: MessageService) {
        this.loadPropertiesAndSubscribe();
    }

    public loadPropertiesAndSubscribe(): void {
        this.loadProperties().subscribe(properties => {
            const initialProperties = properties;
            // when a capability is added, we get new properties
            this.onCapabilityAdded$.pipe(
                map((addedCapabilities: Capability[]) => addedCapabilities.reduce((acc, capability) => {
                    return acc.concat(capability.inputProperties).concat(capability.outputProperties);
                }, [])),
                startWith(initialProperties))
                .subscribe(addedProperties => {
                    console.log("initial props");
                    console.log(initialProperties);
                    console.log("prop subject");
                    console.log(this.propertySubject$.value);

                    console.log({addedProperties});


                    const allProperties = [...this.propertySubject$.value, ...addedProperties];
                    console.log("all props");
                    console.log(allProperties);


                    this.propertySubject$.next(allProperties);
                });
        });

        // on delete, we get the current modules, so update
        this.onCapabilityDeleted$.subscribe(capabilities => {
            const properties = (capabilities as Capability[]).reduce((acc, capability) => {
                return acc.concat(capability.inputProperties).concat(capability.outputProperties);
            }, []);
            this.propertySubject$.next(properties);
        });
    }

    public getProperties(): Observable<Property[]> {
        return this.propertySubject$.asObservable();
    }

    public reloadProperties(): void {
        this.loadProperties().subscribe(properties => this.propertySubject$.next(properties));
    }

    /**
     * Loads all modules from GraphDB with an HTTP Rest
     */
    private loadProperties(): Observable<Property[]> {
        const apiURL = `${this.apiRoot}/properties`;
        return this.http.get<PropertyDTO[]>(apiURL).pipe(
            take(1),
            map((propertyDtos: PropertyDTO[]) => propertyDtos.map(dto => new Property(dto))),
        );
    }

    addProperty(){
        // TODO: Implement
    }

    deleteProperty(){
        // TODO: Implement
    }
}

import { Module } from "@nestjs/common";
import { PropertyController } from "./property.controller";
import { PropertyService } from "./property.service";

@Module({
    imports: [],
    controllers: [PropertyController],
    providers: [PropertyService],
    exports: [PropertyService],
})
export class PropertyModule {}

import { Module } from '@nestjs/common';
import { ConstraintController } from './constraint.controller';
import { ConstraintService } from './constraint.service';

@Module({
    imports: [
    ],
    controllers: [ConstraintController],
    providers: [ConstraintService],
    exports: [ConstraintService],
    })
export class ConstraintModule {}

import { Directive, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
    selector: 'input[type=file]',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(()=> FileValueAccessor), multi: true }
    ]
})
export class FileValueAccessor implements ControlValueAccessor {
    @Input() disabled = false;
    @HostListener('change', ['$event.target.files']) onChange = (_: any) => {};
    @HostListener('blur') onTouched = () => {};

    writeValue(value: any) {}

    registerOnChange(fn: (_: any) => void) {
        console.log("register change");

        this.onChange = fn;
    }
    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    // Allows Angular to disable the input.
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}

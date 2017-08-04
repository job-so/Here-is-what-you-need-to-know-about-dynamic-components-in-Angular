import {NgModule} from "@angular/core";
import {CComponent} from "./c.component";

@NgModule({
    declarations: [CComponent],
    entryComponents: [CComponent],
    exports: [CComponent]
})

export class CModule {

}
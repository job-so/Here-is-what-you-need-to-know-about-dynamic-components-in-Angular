import {Compiler, Component, Injector, NgModule, NgModuleRef, ViewChild, ViewContainerRef, Input} from "@angular/core";

import { CModule } from "./c.module";
import { OTFModule } from "./otf.module";

@Component({
    moduleId: module.id,
    selector: 'otf-a-component',
    template: 'I am A component that inserts dynamic B component below: <div #vc></div>'
})

export class OTFAComponent {
    @Input() temp : string;
    @ViewChild('vc', {read: ViewContainerRef}) _container: ViewContainerRef;

    constructor(private _compiler: Compiler,
                private _injector: Injector,
                private _m: NgModuleRef<any>) {
    }

    ngAfterViewInit() {
        const template = '<span>I am {{name}}</span><br /><c-component></c-component>' + this.temp;
        
        const tmpCmp = Component({template: template})(class {
        });
        tmpCmp.prototype['name'] = 'B component';

        const tmpModule = NgModule({imports: [CModule, OTFModule], declarations: [tmpCmp], entryComponents: [tmpCmp]})(class {
        });

        this._compiler.compileModuleAsync(tmpModule)
            .then((moduleFactory) => {
                const resolver = moduleFactory.create(this._injector).componentFactoryResolver;
                const f = resolver.resolveComponentFactory(tmpCmp);
                const cmpRef = f.create(this._injector, [], null, this._m);
                //cmpRef.instance.name = 'B component';
                this._container.insert(cmpRef.hostView);
            })
    }
}
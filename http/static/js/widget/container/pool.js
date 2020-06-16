import {Container} from "./container.js"
import {Collapse} from "../collapse.js";
import {DataStoreApi} from "../../api/datastores.js";
import {PoolCtl} from "../../ctl/pool.js";


export class Pool extends Container {

    constructor(props) {
        super(props);
        this.default = props.default || 'volumes';
        this.uuid = props.uuid;
        this.current = "#datastores";

        this.render();
    }

    render() {

        new DataStoreApi({uuids: this.uuid}).get(this, (e) => {
            this.title(e.resp.name);
            this.view = $(this.template(e.resp));
            this.view.find('#header #refresh').on('click', (e) => {
                this.render();
            });
            $(this.parent).html(this.view);
            this.loading();
        });
    }

    loading() {
        // collapse
        $(this.id('#collapseOver')).fadeIn('slow');
        $(this.id('#collapseOver')).collapse();
        new Collapse({
            pages: [
                {id: this.id('#collapseVol'), name: 'volumes'},
            ],
            default: this.default,
            update: false,
        });

        new PoolCtl({
            id: this.id(),
            header: {id: this.id("#header")},
            volumes: {id: this.id("#volumes")},
        });

    }

    template(v) {
        return template.compile(`
        <div id="datastores" data="{{uuid}}" name="{{name}}">
        <div id="header" class="card">
            <div class="card-header">
                <div class="card-just-left">
                    <a id="refresh" class="none" href="javascript:void(0)">{{name}}</a>
                </div>
            </div>
            <!-- Overview -->
            <div id="collapseOver" class="collapse" aria-labelledby="headingOne" data-parent="#instance">
            <div class="card-body">
                <!-- Header buttons -->
                <div class="card-header-cnt">
                    <button id="refresh" type="button" class="btn btn-outline-dark btn-sm">Refresh</button>
                    <div id="btns-more" class="btn-group btn-group-sm" role="group">
                        <button id="btns-more" type="button" class="btn btn-outline-dark dropdown-toggle"
                                data-toggle="dropdown" aria-expanded="true" aria-expanded="false">
                            Actions
                        </button>
                        <div name="btn-more" class="dropdown-menu" aria-labelledby="btns-more">
                            <a id="edit" class="dropdown-item" href="javascript:void(0)">Edit</a>
                            <a id="destroy" class="dropdown-item" href="javascript:void(0)">Destroy</a>
                            <div class="dropdown-divider"></div>
                            <a id="remove" class="dropdown-item" href="javascript:void(0)">Remove</a>
                            <div class="dropdown-divider"></div>
                            <a id="dumpxml" class="dropdown-item" href="javascript:void(0)">Dump XML</a>
                        </div>
                    </div>
                </div>
                <dl class="dl-horizontal">
                    <dt>State:</dt>
                    <dd><span class="{{state}}">{{state}}</span></dd>
                    <dt>UUID:</dt>
                    <dd>{{uuid}}</dd>
                    <dt>Source:</dt>
                    <dd>{{source}}</dd>

                </dl>
            </div>
            </div>
        </div>
        <div id="collapse">
        <!-- Volume list-->
        <div id="volumes" class="card device">
            <div class="card-header">
                <button class="btn btn-link btn-block text-left btn-sm"
                        type="button" data-toggle="collapse"
                        data-target="#collapseLea" aria-expanded="true" aria-controls="collapseLea">
                    File Manager
                </button>
            </div>
            <div id="collapseVol" class="collapse" aria-labelledby="headingOne" data-parent="#collapse">
            <!-- volume actions button-->
            <div class="card-body">
                <div class="card-header-cnt">
                    <button id="create" type="button" class="btn btn-outline-dark btn-sm"
                            data-toggle="modal" data-target="#LeaseCreateModal">
                        New a Volume
                    </button>
                    <button id="edit" type="button" class="btn btn-outline-dark btn-sm">Edit</button>
                    <button id="remove" type="button" class="btn btn-outline-dark btn-sm">Remove</button>
                    <button id="refresh" type="button" class="btn btn-outline-dark btn-sm" >Refresh</button>
                </div>
                <div class="">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th><input id="on-all" type="checkbox"></th>
                            <th>type</th>
                            <th>name</th>
                            <th>pool</th>
                            <th>capacity</th>
                            <th>allocation</th>
                        </tr>
                        </thead>
                        <tbody id="display-table">
                        <!-- Loading... -->
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
        </div>`)(v);
    }
}
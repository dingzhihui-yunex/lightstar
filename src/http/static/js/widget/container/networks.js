import {Container} from "./container.js"
import {Network} from "./network.js";
import {Utils} from "../../lib/utils.js";
import {NetworksCtl} from "../../ctl/networks.js";
import {NATCreate} from "../network/create.js";
import {BridgeCreate} from "../network/bridge/create.js";
import {IsolatedCreate} from "../network/isolated/create.js";
import {I18N} from "../../lib/i18n.js";

export class Networks extends Container {
    // {
    //    parent: "#container",
    // }
    constructor(props) {
        super(props);
        this.current = '#index';

        this.render();
        this.loading();
    }

    loading() {
        this.title(I18N.i('network'));
        // loading network.
        let nCtl = new NetworksCtl({
            id: this.id('#networks'),
            onthis: (e) => {
                console.log("network.loading", e);
                new Network({
                    parent: this.parent,
                    uuid: e.uuid,
                });
            },
        });
        new NATCreate({id: '#createNatModal'})
            .onsubmit((e) => {
                nCtl.create(Utils.toJSON(e.form));
            });
        new BridgeCreate({id: '#createBridgeModal'})
            .onsubmit((e) => {
                nCtl.create(Utils.toJSON(e.form));
            });
        new IsolatedCreate({id: '#createIsolatedModal'})
            .onsubmit((e) => {
                nCtl.create(Utils.toJSON(e.form));
            });
    }

    template(v) {
        return this.compile(`
        <div id="index">
    
        <!-- Network -->
        <div id="networks" class="card card-main">
            <div class="card-header">
                <button class="btn btn-link btn-block text-left btn-sm" type="button">
                    {{'virtual networks' | i}}
                </button>
            </div>
            <div id="collapseNet">
                <div class="card-body">
                    <!-- Network buttons -->
                    <div class="card-body-hdl">
                        <div id="create-btns" class="btn-group btn-group-sm" role="group">
                            <button id="create" type="button" class="btn btn-outline-dark btn-sm"
                                    data-toggle="modal" data-target="#createNatModal">
                                {{'create network' | i}}
                            </button>
                            <button id="creates" type="button"
                                    class="btn btn-outline-dark dropdown-toggle dropdown-toggle-split"
                                    data-toggle="dropdown" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div id="create-more" class="dropdown-menu" aria-labelledby="creates">
                                <a id="create-isolated" class="dropdown-item" data-toggle="modal" data-target="#createIsolatedModal">
                                    {{'create isolated network' | i}}
                                </a>
                                <a id="create-bridge" class="dropdown-item" data-toggle="modal" data-target="#createBridgeModal">
                                    {{'create existing bridge' | i}}
                                </a>
                            </div>
                        </div>
                        <button id="edit" type="button" class="btn btn-outline-dark btn-sm">{{'edit' | i}}</button>
                        <button id="delete" type="button" class="btn btn-outline-dark btn-sm">{{'remove' | i}}</button>
                        <button id="refresh" type="button" class="btn btn-outline-dark btn-sm" >{{'refresh' | i}}</button>
                    </div>
    
                    <!-- Network display -->
                    <div class="card-body-tbl">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th><input id="on-all" type="checkbox"></th>
                                <th>{{'id' | i}}</th>
                                <th>{{'uuid' | i}}</th>
                                <th>{{'name' | i}}</th>
                                <th>{{'bridge' | i}}</th>
                                <th>{{'state' | i}}</th>
                            </tr>
                            </thead>
                            <tbody id="display-table">
                            <!-- Loading -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal -->
        <div id="modals">
            <!-- Create network modal -->
            <div id="createNatModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>
            <div id="createBridgeModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>
            <div id="createIsolatedModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>        
        </div>
        </div>`)
    }
}

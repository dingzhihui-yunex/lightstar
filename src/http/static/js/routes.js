import {Location} from "./lib/location.js";
import {Home} from "./widget/container/home.js";
import {Guest} from "./widget/container/guest.js";
import {Network} from "./widget/container/network.js";
import {Pool} from "./widget/container/pool.js";
import {Instances} from "./widget/container/instances.js"
import {Networks} from "./widget/container/networks.js";
import {DataStores} from "./widget/container/datastores.js";

export class Routes {
    // {
    //   hyper: $,
    //   container: ''
    //   onchange: function(e) {}.
    // }
    constructor(props) {
        this.props = props;
        this.routes = [
            {
                prefix: "/guest/",
                function: (p) => {
                    let uuid = p.split('/', 3)[2];
                    new Guest({
                        parent: props.container,
                        uuid: uuid,
                    });
                },
            },
            {
                prefix: "/datastore/",
                function: (p) => {
                    let uuid = p.split('/', 3)[2];
                    new Pool({
                        parent: props.container,
                        uuid: uuid,
                    });
                },
            },
            {
                prefix: "/network/",
                function: (p) => {
                    let uuid = p.split('/', 3)[2];
                    new Network({
                        parent: props.container,
                        uuid: uuid,
                    });
                },
            },
            {
                prefix: "/instances",
                function: (p) => {
                    new Instances({
                        parent: props.container,
                        name: props.hyper.attr('name'),
                    });
                },
            },
            {
                prefix: "/datastores",
                function: (p) => {
                    new DataStores({
                        parent: props.container,
                        name: props.hyper.attr('name'),
                    });
                },
            },
            {
                prefix: "/networks",
                function: (p) => {
                    new Networks({
                        parent: props.container,
                        name: props.hyper.attr('name'),
                    });
                },
            },
            {
                prefix: "",
                function: (p) => {
                    new Home({
                        parent: props.container,
                        name: props.hyper.attr('name'),
                    });
                },
            },
        ];
        this.render();
        window.onhashchange = (e) => {
            if (this.props.onchange) {
                this.props.onchange(e);
            }
            console.log("onhashchange", e);
            this.render();
        };
    }

    render() {
        let cur = Location.get();
        for (let rte of this.routes) {
            if (cur.startsWith(rte.prefix)) {
                rte.function(cur);
                break;
            }
        }
    }
}

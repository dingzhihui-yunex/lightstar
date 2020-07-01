import {FormModal} from "../form/modal.js";
import {Option} from "../option.js";


export class NATCreate extends FormModal {
    //
    constructor (props) {
        super(props);

        this.render();
        this.loading();
    }

    render() {
        super.render();
        let prefix = {
            fresh: function() {
                this.selector.find('option').remove();
                for (let i = 26; i >= 8; i--) {
                    let alias = "/"+i;
                    this.selector.append(new Option(alias, i));
                }
                this.selector.find('option[value=24]').prop('selected', true);
            },
            selector: this.view.find("select[name='prefix']"),
        };
        prefix.fresh();
    }

    template() {
        return (`
        <div class="modal-dialog modal-dialog-centered model-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">Create NAT based network</h5>
            </div>
            <div class="modal-body form-body">
                <form>
                    <input type="text" class="d-none" name="mode" value="nat"/>
                    <input type="text" class="d-none" name="dhcp" value="yes"/>
                    <div class="form-group">
                        <label for="name" class=" ">Network name</label>
                        <div class="input-group">
                            <input type="text" class="form-control form-control-sm" name="name" value=""/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="">Interface Address</label>
                        <div class="input-group">
                            <input type="text" class="form-control form-control-sm"
                                   name="address" value="192.168.10.1"/>
                            <select class="select-unit-right" name="prefix">
                                <option value="24" selected>/24</option>
                            </select>
                         </div>
                    </div>
                    <div class="form-group">
                        <label for="range" class="col-form-label-sm">Address range</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control form-control-sm" 
                                name="range" rows="3">192.168.10.100,192.168.10.200</textarea>                                         
                        </div>
                    </div>
                </form>
            </div>
            <div id="" class="modal-footer">
                <button name="cancel-btn" class="btn btn-outline-dark btn-sm">Cancel</button>
                <button name="finish-btn" class="btn btn-outline-success btn-sm">Finish</button>
            </div>
        </div>
        </div>`);
    }
}

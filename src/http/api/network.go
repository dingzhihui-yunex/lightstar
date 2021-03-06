package api

import (
	"github.com/danieldin95/lightstar/src/libstar"
	"github.com/danieldin95/lightstar/src/network"
	"github.com/danieldin95/lightstar/src/network/libvirtn"
	"github.com/danieldin95/lightstar/src/schema"
	"github.com/gorilla/mux"
	"net"
	"net/http"
	"sort"
)

type Network struct {
}

func IsUniCast(address string) bool {
	addr := net.ParseIP(address)
	if addr == nil {
		return false
	}
	if addr.IsMulticast() || addr.IsLoopback() || addr.IsUnspecified() {
		return false
	}
	return true
}

func Network2XML(conf schema.Network) libvirtn.NetworkXML {
	xmlObj := libvirtn.NetworkXML{
		Name: conf.Name,
		Bridge: libvirtn.BridgeXML{
			Name: conf.Bridge,
		},
	}
	if conf.Mode != "" {
		xmlObj.Forward = &libvirtn.ForwardXML{
			Mode: conf.Mode,
		}
	}
	if conf.Mode == "nat" {
		xmlObj.Bridge.Stp = "on"
		xmlObj.Bridge.Delay = "0"
	}

	if conf.Address != "" {
		xmlObj.IPv4 = &libvirtn.IPv4XML{
			Address: conf.Address,
		}
		if conf.Prefix != "" {
			xmlObj.IPv4.Prefix = conf.Prefix
		}
		if conf.Netmask != "" {
			xmlObj.IPv4.Netmask = conf.Netmask
		}
		// DHCP address range
		xmlObj.IPv4.DHCP = &libvirtn.DHCPXML{
			Range: make([]libvirtn.DHCPRangeXML, 0, 32),
		}
		for _, addr := range conf.Range {
			xmlObj.IPv4.DHCP.Range = append(xmlObj.IPv4.DHCP.Range,
				libvirtn.DHCPRangeXML{
					Start: addr.Start,
					End:   addr.End,
				})
		}
	}
	return xmlObj
}

func (net Network) Router(router *mux.Router) {
	router.HandleFunc("/api/network", net.GET).Methods("GET")
	router.HandleFunc("/api/network/{id}", net.GET).Methods("GET")
	router.HandleFunc("/api/network", net.POST).Methods("POST")
	router.HandleFunc("/api/network/{id}", net.DELETE).Methods("DELETE")
}

func (net Network) GET(w http.ResponseWriter, r *http.Request) {
	uuid, ok := GetArg(r, "id")
	if !ok {
		// list all instances.
		list := schema.ListNetwork{
			Items: make([]schema.Network, 0, 32),
		}
		if ns, err := libvirtn.ListNetworks(); err == nil {
			for _, n := range ns {
				sn := network.NewNetwork(n)
				list.Items = append(list.Items, sn)
				_ = n.Free()
			}
			sort.SliceStable(list.Items, func(i, j int) bool {
				return list.Items[i].Name < list.Items[j].Name
			})
			list.Metadata.Size = len(list.Items)
			list.Metadata.Total = len(list.Items)
		}
		ResponseJson(w, list)
	} else {
		if n, err := libvirtn.LookupNetwork(uuid); err == nil {
			sn := network.NewNetwork(*n)
			_ = n.Free()
			ResponseJson(w, sn)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
	}
}

func (net Network) POST(w http.ResponseWriter, r *http.Request) {
	conf := schema.Network{}
	if err := GetData(r, &conf); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	xmlObj := Network2XML(conf)
	libstar.Debug("Network.POST %s", xmlObj.Encode())
	hyper, err := libvirtn.GetHyper()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	netVir, err := hyper.NetworkDefineXML(xmlObj.Encode())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer netVir.Free()
	if err := netVir.Create(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := netVir.SetAutostart(true); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ResponseMsg(w, 0, conf.Name+" success")
}

func (net Network) PUT(w http.ResponseWriter, r *http.Request) {
	ResponseMsg(w, 0, "")
}

func (net Network) DELETE(w http.ResponseWriter, r *http.Request) {
	uuid, _ := GetArg(r, "id")
	hyper, err := libvirtn.GetHyper()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	netvir, err := hyper.LookupNetwork(uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer netvir.Free()
	if err := netvir.Destroy(); err != nil {
		libstar.Warn("Network.DELETE %s", err)
	}
	if err := netvir.Undefine(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ResponseMsg(w, 0, "success")
}

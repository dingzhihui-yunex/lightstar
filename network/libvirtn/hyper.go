package libvirtn

import (
	"github.com/danieldin95/lightstar/libstar"
	"github.com/libvirt/libvirt-go"
)

type HyperListener struct {
	Opened func(Conn *libvirt.Connect) error
	Closed func(Conn *libvirt.Connect) error
}

type HyperVisor struct {
	Name     string
	Conn     *libvirt.Connect
	Listener []HyperListener
}

func (h *HyperVisor) AddListener(listen HyperListener) {
	h.Listener = append(h.Listener, listen)
}

func (h *HyperVisor) Open() error {
	if hyper.Conn != nil {
		if _, err := hyper.Conn.GetVersion(); err != nil {
			libstar.Error("HyperVisor.Open %s", err)
			hyper.Conn.Close()
			hyper.Conn = nil
		}
	}
	if hyper.Conn == nil {
		conn, err := libvirt.NewConnect(hyper.Name)
		if err != nil {
			return err
		}
		hyper.Conn = conn
		for _, listen := range h.Listener {
			if listen.Opened != nil {
				listen.Opened(h.Conn)
			}
		}
	}
	if hyper.Conn == nil {
		return libstar.NewErr("Not connect.")
	}
	return nil
}

func (h *HyperVisor) Close() {
	if h.Conn == nil {
		return
	}
	for _, listen := range h.Listener {
		if listen.Closed != nil {
			listen.Closed(h.Conn)
		}
	}
	h.Conn = nil
}

var hyper = HyperVisor{
	Name:     "qemu:///system",
	Listener: make([]HyperListener, 0, 32),
}

func GetHyper() (*HyperVisor, error) {
	return &hyper, hyper.Open()
}

func SetHyper(name string) (*HyperVisor, error) {
	if name == hyper.Name {
		return &hyper, nil
	}
	hyper.Close()
	hyper.Name = name
	return &hyper, hyper.Open()
}

func AddHyperListener(listen HyperListener) {
	hyper.AddListener(listen)
}
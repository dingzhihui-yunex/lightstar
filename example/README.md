 ### Panabit
 
    qemu-img create -f qcow2 /var/lib/libvirt/images/panabit.disk-0.img 10G
    virsh create panabit.xml
    virsh list --all
    virsh vncdisplay panabit-01


### Uefi

    virsh create uefi.xml

### Bios

    virsh create biso.xml
   


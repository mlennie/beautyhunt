# Vagrant should NOT be run as root (with sudo).
if Process.uid == 0 and !Vagrant::Util::Platform.windows?
  puts "No `sudo vagrant ...` please. Vagrant should be run as a regular user to avoid issues."
  exit
end

Vagrant.require_version ">= 1.6.3"

Vagrant.configure("2") do |config|
  config.vm.define "boot2docker"

  config.vm.box = "dduportal/boot2docker"
  config.vm.box_check_update = false

  ## Network ##

  # The default box private network IP is 192.168.10.10
  # Uncomment lines below to map additional IP addresses for use with multiple projects.
  # Project specific IP:port mapping for containers is done in via docker-compose (docker-compose.yml)
  #config.vm.network "private_network", ip: "192.168.10.11"
  #config.vm.network "private_network", ip: "192.168.10.12"
  #config.vm.network "private_network", ip: "192.168.10.13"


  # Vagrantfile location
  vagrant_root = File.dirname(__FILE__)
  # Trim Windows drive letters
  vagrant_mount = vagrant_root.gsub(/[a-zA-Z]:/, '')

 ####################################################################
 ## Synced folders configuration ##

  # Windows
  if Vagrant::Util::Platform.windows?
    # Uncomment for better performance on Windows (mount via SMB).
    # Requires Vagrant to be run with admin privileges.
    # Will also prompt for the Windows username and password to access the share.
    config.vm.synced_folder vagrant_root, vagrant_mount, type: "smb"
    
  # Mac
  else
    # Uncomment for better performance on Mac (mount via NFS).
    # See https://github.com/mitchellh/vagrant/issues/2304 for why NFS over TCP may be better than over UDP.
    #config.vm.synced_folder vagrant_root, vagrant_root, type: "nfs", mount_options: ["nolock", "vers=3", "udp"]
    config.vm.synced_folder vagrant_root, vagrant_mount, type: "nfs", mount_options: ["nolock", "vers=3", "tcp"]
    
    # This uses uid and gid of the user that started vagrant.
    config.nfs.map_uid = Process.uid
    config.nfs.map_gid = Process.gid
  end

  # Cross-platform: vboxfs
  # Uncomment for reliable, cross-platform and terribly slow performance (using vboxfs)
  #config.vm.synced_folder vagrant_root, vagrant_mount
  
  # Cross-platform: rsync
  # Uncomment for the best performance (using rsync). Run `vagrant rsync-auto` to start auto sync.
  #config.vm.synced_folder vagrant_root, vagrant_mount, type: "rsync", rsync__exclude: ".git/"
  
  ####################################################################

  # Make host SSH keys available to containers on /.ssh
  if File.directory?(File.expand_path("~/.ssh"))
    config.vm.synced_folder "~/.ssh", "/.ssh"
  end

  ## VirtualBox VM settings
  
  config.vm.provider "virtualbox" do |v|
    #v.gui = true  # Uncomment for debugging 
    v.name = File.basename(vagrant_root) + "_boot2docker"  # VirtualBox VM name
    v.cpus = 1  # CPU settings. VirtualBox works much better with a single CPU.
    v.memory = 2048  # Memory settings.
  end

  ## Provisioning scripts ##

  # Allow Mac OS X docker client to connect to Docker without TLS auth
  # https://github.com/deis/deis/issues/2230#issuecomment-72701992
  config.vm.provision "shell" do |s|
    s.inline = <<-SCRIPT
      echo 'DOCKER_TLS=no' >> /var/lib/boot2docker/profile
      /etc/init.d/docker restart
    SCRIPT
  end

  # Make docker-compose available inside boot2docker via a container.
  # https://github.com/docker/compose/issues/598#issuecomment-67762456
  config.vm.provision "shell", run: "always" do |s|
    s.inline = <<-SCRIPT
      echo 'docker run --rm -it \
          -v $(pwd):$(pwd) -v /var/run/docker.sock:/var/run/docker.sock \
          -e COMPOSE_PROJECT_NAME=$(basename $(pwd)) -w="$(pwd)" \
          blinkreaction/docker-compose $*' > /usr/local/bin/docker-compose
      chmod +x /usr/local/bin/docker-compose
      echo 'alias fig=docker-compose' >> /home/docker/.ashrc
    SCRIPT
  end

  # Pass vagrant_root variable to the VM and cd into the directory upon login.
  config.vm.provision "shell", run: "always" do |s|
    s.inline = <<-SCRIPT
      echo "export VAGRANT_ROOT=$1" >> /home/docker/.profile
      echo "cd $1" >> /home/docker/.ashrc
    SCRIPT
    s.args = "#{vagrant_mount}"
  end
  
  # dsh script lookup wrapper (Drude Shell)
  # https://github.com/blinkreaction/drude
  config.vm.provision "shell", run: "always" do |s|
    s.inline = <<-SCRIPT
      DSH_SCRIPT='
      #/bin/sh

      up="../"
      pathup="./"
      slashes=$(pwd | sed "s/[^\/]//g")
      found=1
      for i in $(seq 0 ${#slashes}) ; do 
        if [ -d "${pathup}.docker" ] ; then
          found=0
          break
        else
          pathup=$pathup$up
        fi
      done

      if [ $found -eq 0 ]; then
        ${pathup}.docker/bin/dsh $*
      else
        echo "error: drude bin utils (.docker/bin) directory was not found"
      fi
      '
      echo "$DSH_SCRIPT" > /usr/local/bin/dsh
      chmod +x /usr/local/bin/dsh
    SCRIPT
  end

end

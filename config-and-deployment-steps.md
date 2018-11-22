# Instance/ User Configuration & Deployment Steps

## Instance Configuration/ Setup
1. Install NVM, Node and PM2 on app user
    - Change to app user
    ```
    sudo su - app-user
    ```
    - Install nvm (using ~/.profile for use in non-interactive, login shell)
    ```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | PROFILE=~/.profile bash

    source ~/.profile
    ```
    - Install NodeJS
    ```
    nvm install node
    ```
    - Install PM2 and configure it to startup automatically on server restart
    ```
    npm install pm2 -g

    pm2 startup
    # Copy command from output

    exit    # Change back to user with sudo privileges

    # Run copied command
    sudo env PATH=$PATH:/home/app-user/.nvm/versions/node/v10.10.0/bin /home/app-user/.nvm/versions/node/v10.10.0/lib/node_modules/pm2/bin/pm2 startup systemd -u app-user --hp /home/app-user
    ```
    - Or alternatively:
    ```
    sudo -u app-user -i bash -i -c 'pm2 startup | tail -1' | bash
    ```
2. Install and configure CouchDB
    - Enable Apache CouchDB package repository
    ```
    (distribution=xenial; echo "deb https://apache.bintray.com/couchdb-deb ${distribution} main") \
    | sudo tee -a /etc/apt/sources.list
    ```
    -  Install repository key
    ```
    curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \
    | sudo apt-key add -
    ```
    - Update repository cache
    ```
    sudo apt-get update
    ```
    - Install CouchDB in standalone mode (Note: will only work with no indents for the heredoc)
    ```bash
     bash -s <<'EOF' <(echo your-admin-password)
    PASSWORD=$(< "$1")
    echo "couchdb couchdb/mode select standalone
    couchdb couchdb/mode seen true
    couchdb couchdb/bindaddress string 127.0.0.1
    couchdb couchdb/bindaddress seen true
    couchdb couchdb/adminpass password $PASSWORD
    couchdb couchdb/adminpass seen true
    couchdb couchdb/adminpass_again password $PASSWORD
    couchdb couchdb/adminpass_again seen true" | sudo debconf-set-selections
    DEBIAN_FRONTEND=noninteractive sudo apt-get install -y -q couchdb
    EOF
    ```
    - Create CouchDB app user
    ```bash
     bash -s <<'EOF' <(echo 'your-app-user-pass') <(echo 'your-admin-pass')
    curl -X PUT localhost:5984/_users/org.couchdb.user:your-app-username \
    -H 'Content-Type: application/json' \
    -d '{ "name": "your-app-user-name", "password": "'$(cat "$1")'", "roles": [ "your-app-user-role" ], "type": "user" }' \
    -u your-admin-username:$(cat "$2")
    EOF
    ```
3. Install and configure Nginx
    - Install Nginx
    ```
    sudo apt-get install nginx
    ```
    - Open inbound HTTP port 80 on AWS Console
    - Remove default config
    ```
    sudo rm /etc/nginx/sites-enabled/default
    ```
    - Create config file
    ```
    sudo vim /etc/nginx/sites-available/learning-site 
    ```
    - With the following contents:
    ```
    server {
        listen 80;
        server_name localhost;
        location / {
            proxy_set_header  X-Real-IP  $remote_addr;
            proxy_set_header  Host       $http_host;
            proxy_pass        http://127.0.0.1:5000;
        }
    }
    ```
    - Link config to sites-enabled
    ```
    sudo ln -s /etc/nginx/sites-available/learning-site /etc/nginx/sites-enabled/learning-site
    ```
    - Restart Nginx
    ```
    sudo service nginx restart
    ```
    - Ensure/ enable startup on boot
    ```
    systemctl is-enabled nginx

    sudo systemctl enable nginx
    ```

## Configure App User
1. Create app user
```
sudo adduser app-user --disabled-password --gecos ""
```
2. Add app user to app group
```
sudo addgroup app
sudo usermod -a -G app app-user
```
3. Change group and permissions of deployment directory
```
sudo chgrp app /var/www
sudo chmod ug+rwx /var/www
```

## Configure Deployment User
1. Create deploy user
```
sudo adduser deploy-user --disabled-password --gecos ""
```
2. Add deploy user to app group
```
sudo usermod -a -G app deploy-user
```
3. Give deploy user permission to run commands as users in app group
    - Create new sudoers file:
    ```
    sudo visudo -f /etc/sudoers.d/01-deploy-user
    ```
    - Add permissions into file e.g.:
    ```
    deploy-user ALL=(%app) NOPASSWD:ALL
    ```
4. Create folder and file for SSH authorized keys
```
sudo su deploy-user

cd
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
```
5. On your **local machine**, generate a new key pair
```
ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/private-key-file-name -C "comment-at-end-of-public-key-file"
```
6. Copy the public key (by default it is the private key file appended with '.pub')
```
cat ~/.ssh/private-key-file-name.pub | pbcopy
```
7. On the instance, as deploy-user
    - Run
    ```
    cat >> ~/.ssh/authorized_keys
    ```
    - Paste copied public key into cat prompt
    - Press enter and Ctrl + D to end input and save public key into file
8. On **local machine**, verify that SSH works
```
ssh -i ~/.ssh/private-key-file-name deploy-user@ec2-instance-hostname
```

## Deployment Steps
1. Clone repository from GitHub
``` 
git clone https://github.com/adyang/learning-site.git
```
2. Build/ optimise for production
```
cd learning-site/
npm run build
```
3. Ensure database exists in CouchDB
    - Obtain AuthSession token (Note the space before the command to not save the password into bash history)
    ```
     echo 'name=admin&password=your-password' | curl -i -X POST localhost:5984/_session -d @-
    ```
    - Create database
    ```
    curl -i -X PUT localhost:5984/posts --cookie AuthSession=your-auth-session-token
    ```
4. Start server (Using pm2 ecosystem.config.js in project root)
```
cd learning-site/
pm2 start
```
5. Save running process to ensure correct state when server reboots
```
pm2 save
```

## Misc
1. Update packages:
```
sudo apt-get update && sudo apt-get upgrade && sudo apt-get dist-upgrade
```
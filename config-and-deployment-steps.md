# Instance Configuration & Deployment Steps

## Instance Configuration/ Setup
1. Install nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

source ~/.bashrc
```
2. Install NodeJS
```
nvm install node
```
3. Install CouchDB
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
     bash -s <<'EOF' <(echo your-password)
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
4. Start server
```
npm start???
or consider PM2???
```

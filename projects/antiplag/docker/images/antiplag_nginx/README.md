
## Creating the dh4096.pem with openssl

To create a Diffie-Hellman cert, you can use the following command

$ openssl dhparam -out dh4096.pem 4096

## Creating a high secure SSL CSR with openssl

This cert might be incompatible with Windows 2000, XP and older IE Versions

$ openssl req -nodes -new -newkey rsa:4096 -out csr.pem -sha256

## Creating a self-signed ssl cert

Please note, that the Common Name (CN) is important and should be the FQDN to the secured server:

$ openssl req -x509 -newkey rsa:4086 \
    -keyout key.pem -out cert.pem \
    -days 3650 -nodes -sha256


## Creating a htpasswd file

You need the htpasswd command (on Ubuntu you can simply install it with sudo apt-get install -y apache2-utils)

The first time you wanna create the htpasswd-file, you need to use the -c parameter (it stands for create).

$ htpasswd -c htpasswd user1

Any other new User you want to add, simply use the following command:

$ htpasswd registry.htpasswd userN

if you use the -c on a existing htpasswd-file, all existing user will be deleted and you create a new file which only contains the new user
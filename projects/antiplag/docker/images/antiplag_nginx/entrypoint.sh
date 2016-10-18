#!/bin/bash

cat <<EOF

IMPORTANT:
  IF you use SSL inside your personal NGINX-config,
  you should add the Strict-Transport-Security header like:

    # only this domain
    add_header Strict-Transport-Security "max-age=31536000";
    # apply also on subdomains
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

  to your config.
  After this you should gain a A+ Grade on the Qualys SSL Test

EOF

if [ -z ${DH_SIZE+x} ]
then
  >&2 echo ">> no \$DH_SIZE specified using default" 
#  DH_SIZE="2048"
  DH_SIZE="512"
fi

HTUSER=${HTUSER:-avc}
HTPASSWD=${HTPASSWD:-123qwe123qwe}
DOMAIN_NAME=${DOMAIN_NAME:-localhost}


DH="/etc/nginx/external/dh.pem"

if [ ! -e "$DH" ]
then
  echo ">> seems like the first start of nginx"
  echo ">> doing some preparations..."
  echo ""

  echo ">> generating $DH with size: $DH_SIZE"
  openssl dhparam -out "$DH" $DH_SIZE
fi

if [ ! -e "/etc/nginx/external/cert.pem" ] || [ ! -e "/etc/nginx/external/key.pem" ]
then
  echo ">> generating self signed cert"
  openssl req -x509 -newkey rsa:4086 \
  -subj "/C=XX/ST=XXXX/L=XXXX/O=XXXX/CN=$DOMAIN_NAME" \
  -keyout "/etc/nginx/external/key.pem" \
  -out "/etc/nginx/external/cert.pem" \
  -days 3650 -nodes -sha256
fi

if [ ! -e "/etc/nginx/external/.htpasswd" ]
then
  echo ">> setting default password "
  htpasswd -cb /etc/nginx/external/.htpasswd "$HTUSER" "$HTPASSWD"
fi

echo ">> copy /etc/nginx/external/*.conf files to /etc/nginx/conf.d/"
cp -f /etc/nginx/external/*.conf /etc/nginx/conf.d/

# exec CMD
echo ">> exec docker CMD"
echo "$@"
exec "$@"

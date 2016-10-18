FROM nginx

ENV LANG C.UTF-8

RUN apt-get update && apt-get install -y openssl apache2-utils && apt-get autoclean

#RUN rm -rf /etc/nginx/conf.d/*
RUN mkdir -p /etc/nginx/external


#RUN sed -i 's/access_log.*/access_log \/dev\/stdout;/g' /etc/nginx/nginx.conf
#RUN sed -i 's/error_log.*/error_log \/dev\/stdout info;/g' /etc/nginx/nginx.conf
RUN sed -i 's/^pid/daemon off;\npid/g' /etc/nginx/nginx.conf

ADD basic.conf /etc/nginx/conf.d/basic.conf
ADD ssl.conf /etc/nginx/conf.d/ssl.conf

ADD entrypoint.sh /opt/entrypoint.sh
RUN chmod a+x /opt/entrypoint.sh

# application conf
ADD web-antiplag.conf /etc/nginx/conf.d/web-antiplag.conf

## Define mountable directories.
VOLUME /etc/nginx/external

# Expose ports.
EXPOSE 80
EXPOSE 443

ENTRYPOINT DOMAIN_NAME=antiplag-demo.avicomp.ru /opt/entrypoint.sh nginx

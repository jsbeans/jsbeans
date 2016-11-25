FROM dockerfile/java:oracle-java8

RUN mkdir -p /root/jsbeans

ADD *.tar.gz /root/jsbeans/

RUN cd /root/jsbeans && ls -l 
#    file=$(ls *.tar.gz | sort -n -t _ -k 2 | tail -1) && echo $file && \
#    tar -xzf $file && \
#    rm -f $file

ADD config /root/jsbeans/jsb-application/config

EXPOSE 8888

RUN chmod +x /root/jsbeans/jsb-application/*.sh

CMD cp -rf /root/jsbeans/jsb-application/external_config/* /root/jsbeans/jsb-application/config ; cd /root/jsbeans/jsb-application && ./start_release.sh

VOLUME /root/.antiplag
VOLUME /root/jsbeans/jsb-application/logs
VOLUME /root/jsbeans/jsb-application/external_config

FROM dockerfile/elasticsearch

# Define mountable directories.
VOLUME ["/data/data", "/data/log"]

# Define working directory.
WORKDIR /data

# Expose ports.
#   - 9200: HTTP
#   - 9300: transport
EXPOSE 9200
EXPOSE 9300

CMD /elasticsearch/bin/elasticsearch

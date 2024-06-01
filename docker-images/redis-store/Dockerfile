FROM redis:5-alpine@sha256:1a3c609295332f1ce603948142a132656c92a08149d7096e203058533c415b8c

RUN mkdir -p /redis-data && chown -R redis:redis /redis-data

# @FIXME: Update redis image
# Pin busybox=1.33.1-r6 https://github.com/sourcegraph/sourcegraph/issues/27965

RUN apk --no-cache add tini apk-tools=2.12.7-r0 libssl1.1=1.1.1l-r0 busybox=1.33.1-r6

USER redis
COPY redis.conf /etc/redis/redis.conf

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["redis-server", "/etc/redis/redis.conf"]

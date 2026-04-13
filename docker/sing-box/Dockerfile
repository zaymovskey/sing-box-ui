FROM golang:1.24-alpine AS builder

ARG SING_BOX_REF=v1.14.0-alpha.9

RUN apk add --no-cache git build-base

WORKDIR /src

RUN git clone https://github.com/SagerNet/sing-box.git . \
  && git checkout "${SING_BOX_REF}"

RUN DEFAULT_TAGS="$(tr ',' ' ' < release/DEFAULT_BUILD_TAGS_OTHERS)" \
  && TAGS="${DEFAULT_TAGS} with_v2ray_api" \
  && echo "Using tags: ${TAGS}" \
  && CGO_ENABLED=0 go build -v -trimpath \
    -tags "${TAGS}" \
    -o /out/sing-box \
    ./cmd/sing-box

FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /out/sing-box /usr/local/bin/sing-box

ENTRYPOINT ["sing-box"]
CMD ["run", "-c", "/etc/sing-box/config.json"]

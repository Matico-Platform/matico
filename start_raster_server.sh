docker run --name titiler \
    -p 8001:8000 \
    --env PORT=8000 \
    --env WORKERS_PER_CORE=1 \
    --rm -it ghcr.io/developmentseed/titiler:latest

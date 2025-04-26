# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --prod -c production

# ---------- Runtime Stage ----------
FROM alpine:3.19

# Install Node, Nginx, Tini, and Supervisor
RUN apk add --no-cache nodejs nginx tini supervisor

# Create working directories
WORKDIR /app
RUN mkdir -p /run/nginx /app/server /usr/share/nginx/html

# Copy SSR build output
COPY --from=builder /app/dist/directv-portal/browser /usr/share/nginx/html
COPY --from=builder /app/dist/directv-portal/server /app/server

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

FROM coturn/coturn:latest

# Install iproute2 for IP detection (if not already installed)
RUN apt-get update && apt-get install -y iproute2 && rm -rf /var/lib/apt/lists/*

# Copy config file
COPY turnserver.conf /etc/turnserver.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose TURN ports
EXPOSE 3478/udp
EXPOSE 3478/tcp
EXPOSE 5349/udp
EXPOSE 5349/tcp

# Use entrypoint script to auto-detect external IP
ENTRYPOINT ["/entrypoint.sh"]


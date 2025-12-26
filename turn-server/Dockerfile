FROM coturn/coturn:latest

# Copy config file
COPY turnserver.conf /etc/turnserver.conf

# Expose TURN ports
EXPOSE 3478/udp
EXPOSE 3478/tcp
EXPOSE 5349/udp
EXPOSE 5349/tcp

# Start coturn
CMD ["turnserver", "-n", "-v"]


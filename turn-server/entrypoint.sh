#!/bin/sh

# Get external IP from Railway's environment or detect automatically
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
    # Try to resolve the domain to get IP
    EXTERNAL_IP=$(getent hosts $RAILWAY_PUBLIC_DOMAIN | awk '{ print $1 }' | head -n1)
    if [ -z "$EXTERNAL_IP" ]; then
        # Fallback: get public IP from network interface
        EXTERNAL_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "")
    fi
else
    # Detect external IP from default gateway route
    EXTERNAL_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "")
fi

# If we have an external IP, append it to turnserver.conf
if [ -n "$EXTERNAL_IP" ]; then
    echo "external-ip=$EXTERNAL_IP" >> /etc/turnserver.conf
    echo "Detected external IP: $EXTERNAL_IP"
else
    echo "Warning: Could not detect external IP. TURN relay may not work correctly."
fi

# Start turnserver
exec turnserver -n -v


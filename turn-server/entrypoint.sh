#!/bin/sh

# Railway automatically handles NAT, so we might not need explicit external-ip
# However, coturn works better with explicit external-ip for TURN relay

# Try to get external IP from Railway environment or detect from network
# Option 1: Use Railway's public domain (if available)
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
    # Try common DNS resolution tools
    if command -v nslookup >/dev/null 2>&1; then
        EXTERNAL_IP=$(nslookup $RAILWAY_PUBLIC_DOMAIN 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -n1)
    fi
    
    if [ -z "$EXTERNAL_IP" ] && command -v host >/dev/null 2>&1; then
        EXTERNAL_IP=$(host $RAILWAY_PUBLIC_DOMAIN 2>/dev/null | grep "has address" | awk '{print $4}' | head -n1)
    fi
    
    if [ -n "$EXTERNAL_IP" ]; then
        echo "external-ip=$EXTERNAL_IP" >> /etc/turnserver.conf
        echo "✅ Using external IP: $EXTERNAL_IP (from Railway domain)"
    else
        echo "ℹ️  Could not resolve Railway domain. coturn will auto-detect external IP."
    fi
else
    echo "ℹ️  Railway domain not available. coturn will attempt to auto-detect external IP."
fi

# Start turnserver with verbose logging for debugging
echo "🚀 Starting coturn TURN server..."
exec turnserver -n -v


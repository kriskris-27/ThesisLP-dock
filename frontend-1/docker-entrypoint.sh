#!/bin/sh

# Replace environment variables in the built files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} \;

# Start nginx
exec nginx -g 'daemon off;' 
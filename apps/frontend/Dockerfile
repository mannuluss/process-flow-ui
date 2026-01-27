FROM nginx:stable-alpine

# The artifact will be downloaded to 'dist' in the workspace
# We copy it to the location Nginx expects
COPY ./dist /usr/share/nginx/html/process-flow-ui

# Copy the nginx configuration from the root (adjusting path if needed)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

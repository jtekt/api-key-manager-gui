#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";


  sed -i 's|VITE_API_BASE_URL_PLACEHOLDER|'${VITE_API_BASE_URL}'|g' $file
  sed -i 's|VITE_OIDC_AUTHORITY_PLACEHOLDER|'${VITE_OIDC_AUTHORITY}'|g' $file
  sed -i 's|VITE_OIDC_CLIENT_ID_PLACEHOLDER|'${VITE_OIDC_CLIENT_ID}'|g' $file
  sed -i 's|VITE_APPS_URL_PLACEHOLDER|'${VITE_APPS_URL}'|g' $file


done

echo "Starting Nginx"
nginx -g 'daemon off;'

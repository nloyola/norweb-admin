# NGINX configurtion

Use this configuration to serve this React app on NGINX.

*Note: that in this configuration, the backend is running at port `80` on `localhost`.*

```
server {
       listen 8088;
       server_name norweb-admin;
       root /opt/norweb-admin;
       index index.html;
       error_log  /var/log/nginx/admin-error.log;
       access_log /var/log/nginx/admin-access.log;

       location / {
                try_files $uri $uri/ /index.html;
                #try_files $uri $uri/ =404;
                add_header   Cache-Control public;
                expires      1d;
       }
       location /api {
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Server $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://localhost/api;
       }
       location /site {
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Server $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://localhost$request_uri;
       }
}
```

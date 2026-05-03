
# nano /etc/nginx/sites-available/oumabarar.com || FRONTEND

server {
    server_name oumabarar.com www.oumabarar.com;

    # Increase upload size (fixes the "too large body" error in your logs)
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Do NOT put try_files here. 
        # The internal Docker Nginx handles the routing.
    }

    # Explicitly handle assets to ensure they aren't treated as HTML
    location /assets/ {
        proxy_pass http://127.0.0.1:3004/assets/;
        proxy_set_header Host $host;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/oumabarar.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/oumabarar.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = www.oumabarar.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = oumabarar.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name oumabarar.com www.oumabarar.com;
    return 404; # managed by Certbot

}


# nano /etc/nginx/sites-available/api.oumabarar.com || BACKEND
server {
    server_name api.oumabarar.com;
# ADD THIS LINE HERE:
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:4003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme; # ADD THIS LINE
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/oumabarar.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/oumabarar.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = api.oumabarar.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name api.oumabarar.com;
    return 404; # managed by Certbot


}

# nano /etc/nginx/sites-available/db.oumabarar.com || DB
server {
    server_name db.oumabarar.com;

    location / {
        proxy_pass http://127.0.0.1:8093;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/oumabarar.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/oumabarar.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = db.oumabarar.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name db.oumabarar.com;
    return 404; # managed by Certbot
}


# Certbot
sudo certbot --nginx -d oumabarar.com -d www.oumabarar.com -d api.oumabarar.com -d db.oumabarar.com
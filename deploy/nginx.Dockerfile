FROM nginx as base

COPY public /usr/share/nginx/html/public
COPY deploy/fittrek.nginx /etc/nginx/conf.d/default.conf

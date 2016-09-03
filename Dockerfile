FROM nginx
COPY landing/ /usr/share/nginx/html
CMD 'nginx'
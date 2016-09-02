FROM nginx
COPY landing/ /var/www
CMD 'nginx'
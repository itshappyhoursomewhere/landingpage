FROM nginx
COPY landing/ /usr/share/nginx/html
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

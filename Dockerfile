FROM nginx
COPY landing/ /usr/share/nginx/html
COPY dist/ /usr/share/nginx/html/dist
COPY public/ /usr/share/nginx/html/public
COPY app.html /usr/share/nginx/html/app.html
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

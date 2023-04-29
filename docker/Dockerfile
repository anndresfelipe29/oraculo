# node:alpine will be our base image to create this image
FROM node:18 as base
# Set the /app directory as working directory
WORKDIR /app
# Install ganache-cli globally
RUN npm install -g ganache
RUN npm install -g truffle


# Set the default command for the image
CMD ["truffle", "version"]

FROM base as ganache
EXPOSE 7545
ENTRYPOINT ["ganache-cli", "-h 0.0.0.0", "-p", "7545", "-g", "0"]
# https://www.bmc.com/blogs/docker-cmd-vs-entrypoint/
# https://dockertips.com/comandos-run-cmd-y-entrypoint-en-el-dockerfile
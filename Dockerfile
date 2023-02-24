 

# docker build -t a50insurance:feb24b .

# docker run -tp 8080:80 a50insurance:feb24b 

# https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/

FROM node:latest AS build
 
# environment variables

ENV REACT_APP_A50_BASE_URL=https://project20a45serverjsb09142020a1.azurewebsites.net/

ENV REACT_APP_A50_PROMOTION_CODE=100 
ENV REACT_APP_A50_USE_STYLES=Y
ENV REACT_APP_A50_USE_STAY=Y
ENV REACT_APP_A50_USE_FOCUS=Y
ENV REACT_APP_A50_USE_NAV=Y
ENV REACT_APP_A50_USE_ACTIONS=Y

ENV REACT_APP_A50_EMAIL_PATTERN=^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$
 
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY public/ public
COPY src/ src
RUN npm run build

FROM nginx:alpine
COPY --from=build /build/build/ /usr/share/nginx/html
 
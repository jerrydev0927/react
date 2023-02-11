FROM mcr.microsoft.com/playwright:v1.16.0-focal
RUN mkdir -p /tmp/react
COPY . /tmp/react
WORKDIR /tmp/react
RUN yarn
WORKDIR /tmp/react/packages/react-devtools-inline

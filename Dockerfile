FROM node:20

RUN apt-get update && apt-get install -y \
    android-sdk \
    openjdk-11-jdk \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV ANDROID_HOME=/usr/lib/android-sdk
ENV PATH="$PATH:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin"

RUN sdkmanager --install "platforms;android-33" "build-tools;33.0.0" "platform-tools" --sdk_root=${ANDROID_HOME}
RUN npm install -g expo-cli

# init for VS Code
RUN mkdir -p /root/workspace /root/.vscode-server 

# Install eslint typescript expo
RUN npm install -g eslint typescript expo-cli @expo/ngrok@^4.1.0

CMD /bin/sh -c "while sleep 86000; do :; done"



# [Choice] Node.js version: 16, 14
# or others from https://hub.docker.com/_/node








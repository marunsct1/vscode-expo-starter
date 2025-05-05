FROM node:20

RUN apt-get update && apt-get install -y \
    android-sdk \
    openjdk-11-jdk \
    wget \
    unzip \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Android Command Line Tools
RUN mkdir -p /usr/lib/android-sdk/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d /usr/lib/android-sdk/cmdline-tools && \
    mv /usr/lib/android-sdk/cmdline-tools/cmdline-tools /usr/lib/android-sdk/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

ENV ANDROID_HOME=/usr/lib/android-sdk
ENV PATH="$PATH:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:$ANDROID_HOME/cmdline-tools/latest/bin"


RUN sdkmanager --install "platforms;android-33" "build-tools;33.0.0" "platform-tools" --sdk_root=${ANDROID_HOME}
RUN npm install -g expo-cli react-native-cli

# init for VS Code
# RUN mkdir -p /root/workspace /root/.vscode-server 

# Install eslint typescript expo
RUN npm install -g eslint typescript expo-cli @expo/ngrok@^4.1.0

# Add vscode user and configure sudo
RUN useradd -ms /bin/bash vscode && \
    mkdir -p /etc/sudoers.d && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode && \
    chmod 0440 /etc/sudoers.d/vscode

# Set the working directory
WORKDIR /workspace
RUN npm install -g expo-cli react-native-cli
RUN npm install -g eslint typescript expo-cli @expo/ngrok@^4.1.0
# Expose ports for React Native development
EXPOSE 19000 19001 19002 8081

# Start the Expo server
CMD ["expo", "start", "--tunnel"]








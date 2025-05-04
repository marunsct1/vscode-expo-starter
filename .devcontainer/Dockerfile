FROM node:20

# Add vscode user and configure sudo
RUN useradd -ms /bin/bash vscode && \
    mkdir -p /etc/sudoers.d && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode && \
    chmod 0440 /etc/sudoers.d/vscode

# Set the working directory
WORKDIR /workspace

# Install dependencies
RUN apt-get update && apt-get install -y \
    android-sdk \
    openjdk-11-jdk \
    wget \
    unzip \
    git \
    curl \
    build-essential \
    watchman \
    adb \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Android Command Line Tools
RUN mkdir -p /usr/lib/android-sdk/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d /usr/lib/android-sdk/cmdline-tools && \
    mv /usr/lib/android-sdk/cmdline-tools/cmdline-tools /usr/lib/android-sdk/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Set environment variables for Android
ENV ANDROID_HOME=/usr/lib/android-sdk
ENV PATH="$PATH:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:$ANDROID_HOME/cmdline-tools/latest/bin"

# Install Android SDK components
RUN sdkmanager --install "platforms;android-33" "build-tools;33.0.0" "platform-tools" --sdk_root=${ANDROID_HOME}

# Install Node.js tools
RUN npm install -g expo-cli react-native-cli eslint typescript @expo/ngrok@^4.1.0 yarn

# Expose ports for React Native development
EXPOSE 19000 19001 19002 8081 3000 5037

# Switch to non-root user
USER vscode

# Start ADB server on container startup
CMD ["adb", "start-server", "&&", "expo", "start", "--tunnel"]








# RentSure - Android App

## 🏡 Project Overview

RentSure is a comprehensive rental management and verification platform designed to streamline the rental process for landlords, property managers, and tenants. This repository contains the source code for the native Android application built with React Native and Expo, which provides a seamless mobile experience for our users.

Our platform aims to simplify key rental tasks, including:

* **Exploring Properties**: Secure background checks, credit reports, and rental history verification.
* **Smart Rent payments**: Automated and secure rent payments with built-in reminders.
* **Maintenance Management**: Effortless request tracking and vendor coordination.
* **Digital Document Signing & Management**: Secure storage and digital signing of leases and other documents.
* **Property Analytics**: Actionable insights on property performance and tenant engagement.

## 🚀 Tech Stack

The RentSure Android application is built using a modern TypeScript stack, leveraging the power of React Native and the Expo framework for a fast and efficient development cycle.

* **Framework**: [React Native](https://reactnative.dev/)
* **Development Platform**: [Expo](https://expo.dev)
* **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (for file-based routing)

---

## 🛠️ Getting Started

### Prerequisites

To get the project running, ensure you have the following installed on your machine:

* **Node.js** (v18 or higher recommended)
* **npm** or **Yarn**
* **Expo CLI** (installed globally or used with `npx`)
* **Android Studio** with an emulator configured.

### Installation & Setup

Follow these steps to set up and run the RentSure Android application on your local machine.

1.  **Clone the Repository**

    Start by cloning the Android app repository from GitHub.

    ```bash
    git clone https://github.com/JayeshPatil163/RentSureAndroid
    ```

2.  **Install Dependencies**

    Navigate to the project directory and install all the necessary Node.js packages.

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Development Server**

    Run the following command to start the Metro Bundler, which will serve your application.

    ```bash
    npx expo start
    ```

### Running on an Android Device

Once the development server is running, you have a few options to view the app:

* **Expo Go App**:
    Scan the QR code displayed in your terminal using the **Expo Go** app on your physical Android device. This is the quickest way to get started.

* **Android Emulator**:
    Press `a` in the terminal after running `npx expo start`. This will automatically build and launch the app on your configured Android emulator.

* **Development Build (Advanced)**:
    For features not supported by Expo Go (e.g., custom native modules), you can create a development build.

    ```bash
    npx expo run:android
    ```
    This command will build and install the app on a connected device or a running emulator.

---

---

## 🤝 Contribution

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
## 📂 Project Structure

The core application code is located in the `app` directory, which uses Expo Router for file-based navigation.

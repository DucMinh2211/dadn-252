# IoT Dashboard & Gateway (DADN-252)

This project is a complete IoT solution featuring a React-based monitoring dashboard and a Python-powered MQTT gateway.

## Project Structure

- `react-fe/`: A modern web application built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**. It provides a real-time dashboard for device monitoring.
- `pythongateway/`: A Python application that communicates with the **Adafruit IO** MQTT broker to bridge data between IoT devices and the cloud.

---

## 🚀 1. Frontend Setup (React)

The frontend is responsible for displaying real-time sensor data and control switches.

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer recommended)
- `npm`

### Getting Started
1.  Navigate to the `react-fe` directory:
    ```bash
    cd react-fe
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐍 2. Python Gateway Setup

The gateway manages MQTT communication with Adafruit IO.

### Prerequisites
- [Python 3.8+](https://www.python.org/downloads/) (64-bit version recommended)

### Configuration
Before running the gateway, open `pythongateway/main.py` and update your Adafruit IO credentials:
```python
AIO_USERNAME = "Your_Username"
AIO_KEY = "Your_Active_Key"
```

### Installation
You can install the required libraries via `pip`:
```bash
pip install paho-mqtt adafruit-io pyserial requests
```

Alternatively, if you are using the pre-compiled libraries provided in the `python_libs-IoT_CoBan_64bit-v3.8` folder, ensure your Python path includes those directories.

### Running the Gateway
1.  Navigate to the `pythongateway` directory:
    ```bash
    cd pythongateway
    ```
2.  Start the gateway:
    ```bash
    python main.py
    ```

---

## 🛠️ Built With
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React, Shadcn/UI (Radix UI).
- **Backend/IoT**: Python, Adafruit IO (MQTT), Paho-MQTT.

## 📄 License
This project is licensed under the [LICENSE](LICENSE) file.

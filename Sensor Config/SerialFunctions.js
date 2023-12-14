


export const requestSerialPort = async (isConnected, portRef, readerRef) => {
  if (!("serial" in navigator)) {
    console.error("WebSerial API not supported in this browser.");
    return;
  }
  if (isConnected.current) {
    console.log("Already connected to a serial port");
    return;
  }

  try {
    const ports = await navigator.serial.getPorts();
    let port = ports.find(
      (port) =>
        port.getInfo().usbVendorId === 0x1a86 &&
        port.getInfo().usbProductId === 0x7523
    );
    if (!port) {
      port = await navigator.serial.requestPort();
    }

    await port.open({ baudRate: 115200 });
    isConnected.current = true;
    portRef.current = port;
    readerRef.current = portRef.current.readable.getReader();
    console.log("conected to serial port")
  } catch (error) {
    console.error("Error accessing serial port:", error);
  }
};

export const disconnectFromPort = async (readerRef, portRef, isConnected) => {
  if (readerRef.current) {
    try {
      await readerRef.current.cancel();
      readerRef.current.releaseLock();
    } catch (error) {
      console.error("Error releasing reader:", error);
    }
    readerRef.current = null;
  }

  const localPort = portRef.current;
  portRef.current = null;

  if (localPort) {
    try {
      await localPort.close();
      isConnected.current = false;
      console.log("Serial port disconnected");
    } catch (e) {
      console.error("Error closing serial port:", e);
    }
  } else {
    console.log("No serial port to disconnect");
  }
};

const writeToSerialPort = async (data, portRef, isConnected) => {
  if (!portRef.current || !isConnected.current) {
    console.log("Serial port is not connected.");
    return;
  }

  try {
    const writer = portRef.current.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
    console.log("Data written to serial port:", data);
  } catch (error) {
    console.error("Error writing to serial port:", error);
  }
};

export const handleWriteToSerialPort = async (
  commands,
  portRef,
  isConnected,
  commandWritten,
) => {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const delayTime = 10;
  for (const command of commands) {
    const bytes = command.map((hexString) => parseInt(hexString, 16));
    const buffer = new Uint8Array(bytes);
    writeToSerialPort(buffer, portRef, isConnected);
    await delay(delayTime);
  }
  commandWritten.current = true;
};



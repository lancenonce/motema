import serial

# Open serial port (adjust port name if needed)
ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)

while True:
    # Read line from serial port
    line = ser.readline().decode('utf-8').rstrip()
    
    if line:
        cpm = int(line)
        print(f"CPM: {cpm}")
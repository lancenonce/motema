from pyflipper.pyflipper import PyFlipper

flipper = PyFlipper(com="/dev/cu.usbmodemflip_Anen1x1") 

file_path = "/ext/dageiger.csv"
csv_data = flipper.storage.read(file=file_path)

print(csv_data)
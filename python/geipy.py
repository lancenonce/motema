from web3 import Web3
from pyflipper.pyflipper import PyFlipper
from giza_actions.action import Action, action
from giza_actions.agent import GizaAgent
from giza_actions.task import task
from dotenv import load_dotenv
from eth_account import Account

load_dotenv()

# Import account
def import_account(mnemonic):
    account = Account.from_mnemonic(mnemonic)
    return account

# Read CSV files in `data` folder and process the most recent file reads into a numpy tensor

# Read csv from Flipper
def read_csv_from_flipper():
    """
    Reads the CSV file from the geiger counter values on flipper
    """
    flipper = PyFlipper(com="/dev/cu.usbmodemflip_Anen1x1") 

    file_path = "/ext/dageiger.csv"
    csv_data = flipper.storage.read(file=file_path)

    print(csv_data)
    

# Address receiver and model launcher

# Action: 
# Action main function
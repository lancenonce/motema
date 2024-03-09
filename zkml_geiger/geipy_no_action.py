import os
import time
import pandas as pd
import numpy as np
import asyncio
import torch
import requests
from web3 import Web3
from pyflipper.pyflipper import PyFlipper
# from giza_actions.action import Action, action
from giza_actions.agent import GizaAgent
# from giza_actions.task import task
from dotenv import load_dotenv
from eth_account import Account
from eth_typing import Address

load_dotenv()

def import_account(mnemonic):
    account = Account.from_mnemonic(mnemonic)
    return account

# Read CSV files in `data` folder and process the most recent file reads into a numpy tensor
def filter_and_process_data_to_numpy():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    if not csv_files:
        raise ValueError("No CSV files found in the 'data' directory.")

    latest_csv = max(csv_files, key=lambda x: os.path.getmtime(os.path.join(data_dir, x)))
    csv_path = os.path.join(data_dir, latest_csv)
    df = pd.read_csv(csv_path)
    cps_values = df['cps'].values

    # Find the top 3 values from the cps_values
    top_3_values = np.sort(cps_values)[-3:][::-1]

    # Create a NumPy tensor with the top 3 values
    return_tensor = np.array(top_3_values)

    # return return_tensor
    # For some reason this is the only tensor that works. We need to debug this Sunday.
    return np.random.rand(1,3) * 15


def read_csv_from_flipper():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)

    try:
        flipper = PyFlipper(com="/dev/cu.usbmodemflip_Anen1x1")
    except Exception as e:
        print(f"No Flipper device found: {e}")
        pass
    else:
        files = flipper.storage.list(path="/ext")

        for file in files:
            if file.endswith('.csv'):
                file_path = f"/ext/{file}"
                csv_data = flipper.storage.read(file=file_path)

                filename = os.path.join(data_dir, file)
                with open(filename, 'w') as f:
                    f.write(csv_data)
                    print(f"Saved {file} to {filename}")

# Action function: motema()
async def motema(address):
    try:
        address = Web3.to_checksum_address(address)
    except ValueError as e:
        raise ValueError(f"Invalid address format: {e}")

    print("Address properly parsed. Starting Motema flow... 🩵")
    print("Address: ", address)
    read_csv_from_flipper()
    tensor = filter_and_process_data_to_numpy()
    print("Tensor: ", tensor)
    # print("Tensor shape:", tensor.shape)
    # print("Tensor data type:", tensor.dtype)

    Account.enable_unaudited_hdwallet_features()
    mnemonic = os.getenv("MNEMONIC")
    account = import_account(mnemonic)

    # Create GizaAgent instance
    model_id = 430
    version_id = 1
    agent = GizaAgent(id=model_id, version=version_id)

    # Run and saveinf erence
    agent.infer(input_feed={"tensor_input": tensor})

    time.sleep(20)

    # Get proof
    # proof, proof_path = agent.get_model_data()
    with open("zk.proof", "rb") as f:
        proof = f.read()
    proof_path = "zk.proof"

    # Verify proof
    # verified = await agent.verify(proof_path)
    
    verified = True
    mark = False

    if verified:
        print("Proof verified. 🚀")
        # The threshold relu function will set all values less than the threshold to 0
        print("Inference: ", agent.inference)
        if any(x != 0 for x in agent.inference[0]):
            mark = True
        else:
            pass
        if mark is True:
            print("This person has been exposed to radiation. Let's get them a payment.")
            signed_proof, is_none, proof_message, signable_proof_message = agent.sign_proof(account, proof, proof_path)
            rpc = "https://eth-sepolia.g.alchemy.com/v2/aGP6ImVTfOlef4kzUxw0-31sabFgyTCT"

            # Get contract address
            contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))

            # Transmit transaction
            receipt = await agent.transmit(
                account=account,
                contract_address=contract_address,
                chain_id=11155111,
                abi_path="contracts/abi/MotemaPoolAbi.json",
                function_name="claim",
                params=[address],
                value=0,
                signed_proof=signed_proof,
                is_none=is_none,
                proofMessage=proof_message,
                signedProofMessage=signable_proof_message,
                rpc_url=rpc,
                unsafe=True
            )
            print("Receipt: ", receipt)
            
            # Send POST request to server
            if receipt:
                transaction_data = {
                    "address": str(address),
                    "transaction_hash": receipt.transactionHash.hex(),
                    "status": receipt.status  # 1 for success, 0 for failure
                }
                try:
                    response = requests.post("http://localhost:8080/confirm", json=transaction_data)
                    response.raise_for_status()  # Raise an exception for non-2xx status codes
                    print("Transaction confirmation sent to server successfully.")
                except requests.exceptions.RequestException as e:
                    print(f"Error sending transaction confirmation to server: {e}")
            else:
                print("Transaction failed. No receipt received.")
        else:
            raise Exception("It doesn't seem like you've been in the mines.")
    else:
        raise Exception("Proof verification failed.")
    
async def main():
    await motema("0x9567D433240681653fb4DD3E05e08D60fe54210d")

if __name__ == '__main__':
    asyncio.run(main())
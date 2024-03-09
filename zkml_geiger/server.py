from flask import Flask, request, render_template, Response, jsonify
import time
import json
import logging
from geipy_no_action import motema
import asyncio
import io

app = Flask(__name__, template_folder='templates')

logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_flow():
    address = request.form.get('address')
    if address:
        asyncio.run(motema(address))
        return "Flow started successfully"
    else:
        return "Invalid request", 400

@app.route('/stream')
def stream():
    def event_stream():
        log_stream = io.StringIO()
        logging.getLogger().addHandler(logging.StreamHandler(log_stream))
        while True:
            log_contents = log_stream.getvalue()
            if log_contents:
                log_data = {"message": log_contents.strip()}
                yield f"data: {json.dumps(log_data)}\n\n"
                log_stream.seek(0)
                log_stream.truncate(0)
            time.sleep(1)
    return Response(event_stream(), mimetype="text/event-stream")

@app.route('/confirm', methods=['POST'])
def confirm_transaction():
    if request.method == 'POST':
        transaction_data = request.get_json()
        if transaction_data:
            address = transaction_data.get('address')
            transaction_hash = transaction_data.get('transaction_hash')
            status = transaction_data.get('status')
            # Process the transaction data as needed
            logging.info(f"Transaction confirmation received for address: {address}")
            logging.info(f"Transaction hash: {transaction_hash}")
            logging.info(f"Transaction status: {status}")
            return jsonify({"message": "Transaction confirmation received"}), 200
        else:
            return jsonify({"error": "Invalid transaction data"}), 400
    else:
        return jsonify({"error": "Invalid request method"}), 405

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
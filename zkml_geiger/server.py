from flask import Flask, request, render_template, Response
import time
from zkml_geiger import motema_flow
from prefect.deployments import Deployment

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_flow():
    address = request.form.get('address')
    if address:
        deployment = Deployment.build_from_flow(
            flow=motema_flow,
            name="motema-flow",
            work_queue_name="my-queue",
            parameters={"address": address}
        )
        deployment.apply()
        return "Flow started successfully"
    else:
        return "Invalid request", 400

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            transaction_status = "Transaction successful!"
            yield f"data: {transaction_status}\n\n"
            time.sleep(5)
    return Response(event_stream(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
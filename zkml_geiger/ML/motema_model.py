import torch
import torch.nn as nn
import torch.onnx

class MotemaModel(nn.Module):
    def __init__(self, threshold):
        super(MotemaModel, self).__init__()
        self.threshold = threshold

    def forward(self, inputs):
        # Apply ReLU activation
        relu_output = nn.functional.relu(inputs)

        # Find the maximum value in the ReLU output
        max_value, _ = torch.max(relu_output, dim=-1)

        # Check if the maximum value is above threshold
        above_threshold = (max_value > self.threshold).any()

        return above_threshold

# Create an instance of the model
model = MotemaModel(threshold=0.5)

# Example input tensor
input_tensor = torch.tensor([[-1.0, 2.0, -0.5], [0.1, 0.2, 0.3]])

# Export the model to ONNX
output_path = "motema.onnx"
input_names = ["input"]
output_names = ["output"]

torch.onnx.export(
    model,
    input_tensor,
    output_path,
    export_params=True,
    opset_version=11,
    do_constant_folding=True,
    input_names=input_names,
    output_names=output_names,
    dynamic_axes={'input': {0: 'batch_size'},  # Variable batch size
                  'output': {0: 'batch_size'}}
)

print(f"Model exported to {output_path}")
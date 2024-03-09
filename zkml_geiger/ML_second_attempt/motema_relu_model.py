import torch
import torch.nn as nn
import torch.onnx

class ThresholdReLU(nn.Module):
    def __init__(self):
        super(ThresholdReLU, self).__init__()
        self.threshold = 10  # threshold value set to 10 cpm ☢️

    def forward(self, x):
        return torch.clamp(x, min=0, max=None) - torch.clamp(x - self.threshold, min=0, max=None) + self.threshold

# Example usage
input_tensor = torch.randn(3, 4, 5)  
threshold_relu = ThresholdReLU()
output_tensor = threshold_relu(input_tensor)
print(output_tensor)

# Export to ONNX
dummy_input = torch.randn(1, 4, 5) 
onnx_path = "MotemaRELU.onnx"
torch.onnx.export(threshold_relu, dummy_input, onnx_path, input_names=["input"], output_names=["output"])
print(f"ONNX model exported to {onnx_path}")
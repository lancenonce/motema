import torch
import torch.nn as nn
import torch.onnx

class ThresholdReLU(nn.Module):
    def __init__(self, threshold=10):
        super(ThresholdReLU, self).__init__()
        self.threshold = threshold

    def forward(self, x):
        return torch.max(x, torch.zeros_like(x)) - torch.max(x - self.threshold, torch.zeros_like(x)) + self.threshold

input_tensor = torch.tensor([-5.0, 2.0, 8.0, -3.0, 12.0, 0.0, 7.0, -1.0, 10.0, 6.0])
threshold_relu = ThresholdReLU(threshold=10)
output_tensor = threshold_relu(input_tensor)
print(output_tensor)

dummy_input = torch.randn(10)  
onnx_path = "Motema_three.onnx"
torch.onnx.export(threshold_relu, dummy_input, onnx_path, input_names=["input"], output_names=["output"])
print(f"ONNX model exported to {onnx_path}")
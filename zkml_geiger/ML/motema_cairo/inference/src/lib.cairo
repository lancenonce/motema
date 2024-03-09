use orion::operators::tensor::{Tensor, TensorTrait};
use orion::operators::tensor::{U32Tensor, I32Tensor, I8Tensor, FP8x23Tensor, FP16x16Tensor, FP32x32Tensor, BoolTensor};
use orion::numbers::{FP8x23, FP16x16, FP32x32};
use orion::operators::matrix::{MutMatrix, MutMatrixImpl};


use _reducemax_axes::get__reducemax_axes;
use _constant_value::get__constant_value;
use _constant_1_value::get__constant_1_value;

fn main(node_input: Tensor<FP16x16>) -> Tensor<bool> {
let node__relu_output_0 = NNTrait::relu(@node_input);
let node__reducemax_output_0 = // Operator ReduceMax is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;
let node__constant_output_0 = get__constant_value();
let node__greater_output_0 = // Operator Greater is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;
let node__reducesum_output_0 = // Operator ReduceSum is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;
let node__constant_1_output_0 = get__constant_1_value();
let node_output = // Operator Greater is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;

        node_output
    }
use orion::operators::tensor::{Tensor, TensorTrait};
use orion::operators::tensor::{U32Tensor, I32Tensor, I8Tensor, FP8x23Tensor, FP16x16Tensor, FP32x32Tensor, BoolTensor};
use orion::numbers::{FP8x23, FP16x16, FP32x32};
use orion::operators::matrix::{MutMatrix, MutMatrixImpl};


use _constant_value::get__constant_value;
use _constant_1_value::get__constant_1_value;
use _constant_2_value::get__constant_2_value;
use _constant_3_value::get__constant_3_value;

fn main(node_input: Tensor<FP16x16>) -> Tensor<FP16x16> {
let node__constant_output_0 = get__constant_value();
let node__clip_output_0 = // Operator Clip is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;
let node__constant_1_output_0 = get__constant_1_value();
let node__sub_output_0 = TensorTrait::sub(node_input, node__constant_1_output_0);
let node__constant_2_output_0 = get__constant_2_value();
let node__clip_1_output_0 = // Operator Clip is not yet supported by the Giza transpiler. If Orion supports it, consider manual implementation.;
let node__sub_1_output_0 = TensorTrait::sub(node__clip_output_0, node__clip_1_output_0);
let node__constant_3_output_0 = get__constant_3_value();
let node_output = TensorTrait::add(node__sub_1_output_0, node__constant_3_output_0);

        node_output
    }
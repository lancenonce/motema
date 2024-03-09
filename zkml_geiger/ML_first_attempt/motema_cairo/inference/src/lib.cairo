use orion::operators::tensor::{Tensor, TensorTrait};
use orion::operators::nn::{NNTrait, FP16x16NN};
use orion::operators::tensor::{U32Tensor, I32Tensor, I8Tensor, FP8x23Tensor, FP16x16Tensor, FP32x32Tensor, BoolTensor};
use orion::numbers::{FP8x23, FP16x16, FP32x32};
use orion::operators::matrix::{MutMatrix, MutMatrixImpl};
use _constant_value::get__constant_value;
use _constant_1_value::get__constant_1_value;

fn main(node_input: Tensor<FP16x16>) -> bool {
    let node__relu_output_0 = NNTrait::relu(@node_input);
    let node__max_output_0 = node__relu_output_0.max_in_tensor();
    let node__constant_output_0 = get__constant_value();
    let res = node__max_output_0 > node__constant_output_0.at(indices: array![0].span());
    res
}

// fn makeshift_reduce_max(tensor: Tensor<FP16x16>) -> Tensor<FP16x16> {
//     let shape = tensor::shape;
//     let num_elements = shape[0];
    
//     let mut max_value = tensor.get(0);
    
//     let mut i = 1;
//     loop {
//         if i >= num_elements {
//             break;
//         }
        
//         let current_value = tensor.get(i);
//         max_value = if current_value > max_value { current_value } else { max_value };
        
//         i += 1;
//     }
    
//     TensorTrait::<FP16x16>::new(shape: array![].span(), data: array![max_value].span())
// }
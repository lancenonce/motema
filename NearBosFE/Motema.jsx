if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
`,
  });
}
const Theme = state.theme;
const sender = Ethers.send("eth_requestAccounts", [])[0];
const contractAddress = "0x584dA09Cb8570074233812994646746b5D24e0FF";
const productName = props.productName || "iPhone 14";


if (productName.includes("iPhone")) {
  props.grams = 20;
} else {
  props.grams = 10;
}

if (!sender) return <Web3Connect connectLabel="Connect Wallet" />;

const handleSend = async () => {
  const value = 0.1634578 * 1000000000000000;
  const valueString = value.toString();
  //console.log('valueString: ' + valueString);

  const transactionHash = Ethers.send("eth_sendTransaction", [
    {
      "from": sender, // address of the wallet connected
      "to": contractAddress, // address of pool contract
      "value": valueString // the amount of ether to send to the pool contract
    }
  ]);

  setTimeout(() => {
    console.log("transactionHash is " + transactionHash);
  }, 40000);

}


const getSender = () => {
  return !state.sender
    ? ""
    : state.sender.substring(0, 6) +
    "..." +
    state.sender.substring(state.sender.length - 4, state.sender.length);
};

const prettyAddress = (address) => {
  const string = address.substring(0, 2) + "..." + address.substring(address.length - 4, address.length);
  return string
}

const message = props.message || `Balance is: `;
const unit = props.unit || `ETH`;

if (state.balance === undefined && sender) {
  Ethers.provider().getBalance(sender).then((balance) => {
    State.update({ balance: Big(balance).div(Big(10).pow(18)).toFixed(2) });
  });
}

return (
  <Theme>
    <div class="background-green"></div>
    <div class="main-container">
      <div class="left-container">
        <div class="header">
          <div class="nav-icons">
            {state.sender ? (<li> {prettyAddress(state.sender)}</li>) : ('')}
            <li>
              <Web3Connect disconnectLabel="Disconnect" />
            </li>
            {message} {state.balance} {unit}
          </div>
        </div>
        <span>
          <p>You just purchased {productName} item which contains {props.grams} grams of cobalt!</p>
          <p>Do you want to help reduce the impact of cobalt mining in Democratic Republic of Congo? Donate to the cause!</p>
          <p>The money will be used to support the local communities and help them to find alternative sources of income.</p>
          <p>You will contribute with 0.1 ETH</p>
        </span>
        <div class="chatbox-input" style={{ padding: '10px' }}>
          <button onClick={handleSend}>Donate</button>
        </div>
      </div>
    </div>
  </Theme>
);

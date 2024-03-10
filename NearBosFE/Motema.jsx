if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: bold;
    background-color: #E0E0E0;
    color: #0047AB;
    padding: 10px;
    border-radius: 0.45rem;
    border: 3px solid #66CC99;
  `,
  });
}
const Theme = state.theme;
const sender = Ethers.send("eth_requestAccounts", [])[0];
const contractAddress = "0x584dA09Cb8570074233812994646746b5D24e0FF";
const productName = props.productName.split("(")[0];


if (productName.includes("iPhone")) {
  props.grams = 20;
} else if (productName.includes("MacBook") || productName.includes("Portátil")) {
  props.grams = 40;
} else if (productName.includes("Batería")) {
  props.grams = 30;
} else if (productName.includes("iPod")) {
  props.grams = 10;
} else if (productName.includes("iWatch")) {
  props.grams = 15;
} else {
  props.grams = null;
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

  /*
  setTimeout(() => {
    console.log("transactionHash is " + transactionHash);
  }, 40000);
  */

  let checkInterval = setInterval(() => {
    if (transactionHash !== null) {
      console.log("transactionHash is " + transactionHash);
      clearInterval(checkInterval);
    }
  }, 5000);

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

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const LeftSide = styled.div`
  display: flex;
  gap: 10px;
`;

const RightSide = styled.div`
  display: flex;
  gap: 10px;
`;

return (
  <Theme>
    <div class="main-container">
      <div class="header">
      <Navbar>
  <LeftSide>
    {sender ? (<>{prettyAddress(sender)}</>) : ('')}
    {message} {state.balance} {unit}
  </LeftSide>
  <RightSide>
    <Web3Connect
      className="styled.div"
      connectLabel="Connect"
      disconnectLabel="Disconnect"
      connectingLabel="Connecting..."
    />
  </RightSide>
</Navbar>
      </div>
      <div>
        {props.grams && productName ? (
          <>
            <span>
              <p>You just purchased {productName} which contains {props.grams} grams of cobalt!</p>
              <p>Do you want to help reduce the impact of cobalt mining in Democratic Republic of Congo? Donate to the cause!</p>
              <p>The money will be used to support the local communities and help them to find alternative sources of income.</p>
              <p>You will contribute with 0.1 ETH</p>
            </span>
            <div class="chatbox-input" style={{ padding: '10px' }}>
              <button onClick={handleSend}>Donate</button>
            </div>
          </>
        ) : (
          <span>
            <p>You just purchased {productName}!</p>
            <p>Your purchase is cobalt free, thank you for caring!</p>
          </span>
        )}
      </div>
    </div>
  </Theme>
);

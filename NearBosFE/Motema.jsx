const sender = Ethers.send("eth_requestAccounts", [])[0];
const contractAddress = "0x8030A36c4a063752A0E2Ab9b66410c27E20B153B";
const productName = props.productName.split("(")[0];
const [isLoading, setIsLoading] = useState(false);
const [transactionHash, setTransactionHash] = useState(null);
const message = props.message || `Balance is: `;
const unit = props.unit || `ETH`;
const [showModal, setShowModal] = useState(false);
const [canClose, setCanClose] = useState(false);

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

  try {
    const donation = Ethers.send("eth_sendTransaction", [
      {
        "from": sender,
        "to": contractAddress,
        "value": valueString
      }
    ]);

    setShowModal(true);

    setTimeout(() => {
      setTransactionHash(donation);
      console.log("transactionHash is " + transactionHash);
      setCanClose(true);
      //setShowModal(false);
    }, 60000);

  } catch (error) {
    console.error('Error:', error);
  }
  /*
    let checkInterval = setInterval(() => {
      console.log("Checking transactionHash");
      if (donation !== null) {
        console.log("transactionHash is " + donation);
        setShowModal(false);
        clearInterval(checkInterval);
      }
    }, 5000);*/

}

function Modal({ onClose, show, children }) {
  if (!show) {
    return <></>;
  }

  return (
    <div
      class="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(224,224,224,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        zIndex: 2
      }}
      onClick={() => { onClose(); }}
    >
      <div
        class="rounded-2xl px-4 py-4"
        style={{
          width: '40%',
          minHeight: '80px',
          padding: '20px',
          color: '#0047AB',
          backgroundColor: 'rgba(224,224,224)',
          borderRadius: '0.45rem',
          border: '3px solid #66CC99',
          alignItems: 'center',
        }}
        onClick={e => { e.stopPropagation(); }}
      >
        <div class="rounded-lg bg-lime-300 py-4 px-4 border-2">
          {children}
        </div>
      </div>
    </div>
  )
}

/*
useEffect(() => {
  if (props.transactionHashes) {
    setShowModal(true);
  }
}, []);

useEffect(() => {
  setTransactionHash(props.transactionHashes);
}, [props.transactionHashes]);
*/

const [dots, setDots] = useState('');

useEffect(() => {
  const intervalId = setInterval(() => { setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : '')); }, 700);
  return () => clearInterval(intervalId);
}, []);

const closeModal = () => {
  setShowModal(false);
}

const prettyAddress = (address) => {
  const string = address.substring(0, 2) + "..." + address.substring(address.length - 4, address.length);
  return string
}

if (state.balance === undefined && sender) {
  Ethers.provider().getBalance(sender).then((balance) => {
    State.update({ balance: Big(balance).div(Big(10).pow(18)).toFixed(2) });
  });
}

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
      <Navbar><img src="https://i.ibb.co/VD1Gsd7/motema-banner.png" alt="Motema Banner"></img></Navbar>
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {props.grams && productName ? (
          <>
            <span>
              <p>You just purchased {productName} which contains {props.grams} grams of cobalt!</p>
              <p>Do you want to help reduce the impact of cobalt mining in Democratic Republic of Congo? Donate to the cause!</p>
              <p>The money will be used to support the local communities and help them to find alternative sources of income.</p>
              <p>You will contribute with 0.1 ETH</p>
            </span>
            <button onClick={handleSend}>Donate</button>

            <Modal show={showModal} onRequestClose={() => { if (canClose) closeModal(); }} onClose={closeModal} >
              <h1 class="text-xl font-bold">Thank You!</h1>
              <div class="h-2 w-20 bg-slate-700"></div>

              {!transactionHash ? (
                <p className="font-bold mt-2">Processing your donation{dots}</p>
              ) : (
                <p>Transaction Hash: {transactionHash}</p>
              )}
            </Modal>
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

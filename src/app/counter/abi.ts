const abi = [
  {
    inputs: [],
    name: "decrease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "increase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "count",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const bytecode =
  "6080604052348015600e575f80fd5b505f80819055506101dd806100225f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c806306661abd1461004e578063a87d942c1461006c578063d732d9551461008a578063e8927fbc14610094575b5f80fd5b61005661009e565b60405161006391906100f3565b60405180910390f35b6100746100a3565b60405161008191906100f3565b60405180910390f35b6100926100ab565b005b61009c6100c3565b005b5f5481565b5f8054905090565b5f808154809291906100bc90610139565b9190505550565b5f808154809291906100d490610160565b9190505550565b5f819050919050565b6100ed816100db565b82525050565b5f6020820190506101065f8301846100e4565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610143826100db565b91505f82036101555761015461010c565b5b600182039050919050565b5f61016a826100db565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361019c5761019b61010c565b5b60018201905091905056fea26469706673582212206b40542db039f45ec2de92a7a7ea4b72a2db2fba30f95f3d8fc18fbf9e5b826964736f6c634300081a0033";

export { abi, bytecode };

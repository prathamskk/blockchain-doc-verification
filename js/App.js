window.CONTRACT = {
  address: "0x9DD2E2cFDFf249317Ef0F3c770E679FDCEee6FA0",
  network: "HTTP://127.0.0.1:8545",
  explore: "Example : https://polygonscan.com/",
  // Your Contract ABI

  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "exporter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "HashAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_ipfs",
          "type": "string"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_info",
          "type": "string"
        }
      ],
      "name": "addExporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_newInfo",
          "type": "string"
        }
      ],
      "name": "alterExporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "countExporters",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "countHashes",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "deleteExporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "deleteHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "getExporterInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};
//login
async function connect() {
  if (window.ethereum) {
    try {
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          return accounts[0];
        })
        .catch(() => {
          throw Error("No account selected 👍");
        });
      window.web3 = new Web3(new Web3.providers.HttpProvider(window.CONTRACT.network));
      // const providersAccounts = await window.web3.eth.getAccounts();
      // console.log(providersAccounts);
      // const defaultAccount = providersAccounts[0];
      // console.log(defaultAccount);
      window.userAddress = selectedAccount;
      console.log(selectedAccount);
      // window.userAddress = defaultAccount;
      window.localStorage.setItem("userAddress", window.userAddress);
      window.location.reload();
    } catch (error) { }
  } else {
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    // Show The Warning for not detecting wallet
    document.querySelector(".alert").classList.remove("d-none");
  }
}

window.onload = async () => {
  $("#loginButton").hide();
  $("#recent-header").hide();
  $(".loader-wraper").fadeOut("slow");
  hide_txInfo();
  $("#upload_file_button").attr("disabled", true);

  window.userAddress = window.localStorage.getItem("userAddress");
  //gere we need MetaMask to read and write to our Contract
  window.web3 = new Web3(new Web3.providers.HttpProvider(window.CONTRACT.network));
  window.contract = new window.web3.eth.Contract(
    window.CONTRACT.abi,
    window.CONTRACT.address
  );
  console.log(
    'window.web3 onload available'
  );
  //checking if user loged in
  if (window.userAddress.length > 10) {
    console.log(
      'userAddress length is greater than 10'
    );
    // let isLocked =await window.ethereum._metamask.isUnlocked();
    //  if(!isLocked) disconnect();
    $("#logoutButton").show();
    $("#loginButton").hide();
    $("#userAddress")
      .html(`<i class="fa-solid fa-address-card mx-2 text-primary"></i>${truncateAddress(
        window.userAddress
      )}
       <a class="text-info" href="${window.CONTRACT.explore}/address/${window.userAddress
        }" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-square-arrow-up-right text-warning"></i></a>  
       </a>`);

    //if admin is viewed then show the doc,exporter counters
    if (window.location.pathname == "/admin.html") await getCounters();

    await getExporterInfo();
    await get_ChainID();
    await get_ethBalance();
    $("#Exporter-info").html(
      `<i class="fa-solid fa-building-columns mx-2 text-warning"></i>${window.info}`
    );

    setTimeout(() => {
      listen();
    }, 0);
  } else {
    $("#logoutButton").hide();
    $("#loginButton").show();
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    $(".box").addClass("d-none");
    $(".loading-tx").addClass("d-none");
  }

};

function hide_txInfo() {
  $(".transaction-status").addClass("d-none");
}

function show_txInfo() {
  $(".transaction-status").removeClass("d-none");
}
async function get_ethBalance() {
  await web3.eth.getBalance(window.userAddress, function (err, balance) {
    if (err === null) {
      $("#userBalance").html(
        "<i class='fa-brands fa-gg-circle mx-2 text-danger'></i>" +
        web3.utils.fromWei(balance).substr(0, 6) +
        ""
      );
    } else {
      print(err, 'app.js get balance error')
      $("#userBalance").html("n/a");
    }
  });
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    connect();
  });
}

function printUploadInfo(result) {
  $("#transaction-hash").html(
    `<a target="_blank" title="View Transaction at Polygon Scan" href="${window.CONTRACT.explore}/tx/` +
    result.transactionHash +
    '"+><i class="fa fa-check-circle font-size-2 mx-1 text-white mx-1"></i></a>' +
    truncateAddress(result.transactionHash)
  );
  $("#file-hash").html(
    `<i class="fa-solid fa-hashtag mx-1"></i> ${truncateAddress(
      window.hashedfile
    )}`
  );
  $("#contract-address").html(
    `<i class="fa-solid fa-file-contract mx-1"></i> ${truncateAddress(
      result.to
    )}`
  );
  $("#time-stamps").html('<i class="fa-solid fa-clock mx-1"></i>' + getTime());
  $("#blockNumber").html(
    `<i class="fa-solid fa-link mx-1"></i>${result.blockNumber}`
  );
  $("#blockHash").html(
    `<i class="fa-solid fa-shield mx-1"></i> ${truncateAddress(
      result.blockHash
    )}`
  );
  $("#to-netowrk").html(
    `<i class="fa-solid fa-chart-network"></i> ${window.chainID}`
  );
  $("#to-netowrk").hide();
  $("#gas-used").html(
    `<i class="fa-solid fa-gas-pump mx-1"></i> ${result.gasUsed} Gwei`
  );
  $("#loader").addClass("d-none");
  $("#upload_file_button").addClass("d-block");
  show_txInfo();
  get_ethBalance();

  $("#note").html(`<h5 class="text-info">
   Transaction Confirmed to the BlockChain 😊<i class="mx-2 text-info fa fa-check-circle" aria-hidden="true"></i>
   </h5>`);
  listen();
}


// async function uploadFileToIpfs() {
//   const fileInput = document.getElementById("doc-file"); // Assuming you have an input element with id 'doc-file' for selecting files
//   const file = fileInput.files[0];
//   const formData = new FormData();
//   formData.append("file", file);

//   //for authinticating your request to infura.io
//   const auth = "Basic " + btoa(`${projectId}:${projectSecret}`);

//   try {
//     //make post request to upload the file and get the CID
//     const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
//       method: "POST",
//       body: formData,
//       headers: {
//         Authorization: auth,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("File upload failed");
//     }

//     const data = await response.json();
//     console.log(data["Hash"]); // Response data
//     //return the CID to the addDocHash to store it in the Contract
//     return data["Hash"];
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// }

async function uploadFileToIpfs() {
  const fileInput = document.getElementById("doc-file"); // Assuming you have an input element with id 'doc-file' for selecting files
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data;`,
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNGU3ODI4YS1jY2QwLTQ3OWUtYmMwNS04YjM3YWZiYzRhZGQiLCJlbWFpbCI6InByYXRoYW1za2tAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRlY2JkY2Y4MGQzNGFmNDcyNWU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiOGQxZTMwMWE3ZjcxZDRlNzY3ZjNiOGNmODY2NDA4MGYwODNkZjdlZWE0NDEzNjIzNDQ1MTBmOGQ0NDY5MjAxOSIsImlhdCI6MTcxMjE1NDk1OX0.FUYVQJqfe2D0kDU5XaYEfdlx8YRRu2lUR-L7_nbkx8s"
      }
    });
    console.log(res.data);
    const ImgHash = res.data.IpfsHash
    console.log(ImgHash); // Response data
    return ImgHash;
  } catch (error) {
    console.log(error);
  }
  // try {
  //   //make post request to upload the file and get the CID
  //   const response = await axios({
  //     method: "post",
  //     url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
  //     data: formData,
  //     headers: {
  //       pinata_api_key: '1614c996c73d489bbb34',
  //       pinata_secret_api_key: '22f67b89973cde6e42005a506b21719ea44e9927ec3bc1a313d7af9d9e0e0d3a',
  //       "Content-Type":"multipart/form-data",
  //     },
  //   });

  //   const ImgHash = `ipfs://${response.data.IpfsHash};`
  //   console.log(ImgHash); // Response data
  //   //return the CID to the addDocHash to store it in the Contract
  //   return ImgHash;
  // } catch (error) {
  //   console.error("Error uploading file:", error);
  //   throw error;
  // }
}
async function sendHash() {
  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  get_ChainID();
  // Initilize Ipfs
  // https://api.pdfrest.com/resource/21c2cbf2d-eb79-4eef-be3e-303b98d26f8c?format=url
  // https://api.pdfrest.com/resource/2ff49040b-a696-44ce-a705-1c1ca69d51c8?format=url
  // =================================================
  // await getFilebinInfo();
  // await uploadFileToBin();
  const CID = await uploadFileToIpfs();
  if (window.hashedfile.length > 4) {
    console.log("hashedfile length greater than 4");
    await window.contract.methods
      .addDocHash(window.hashedfile, CID)
      .send({ from: window.userAddress, gas: '1000000' })
      .on("transactionHash", function (_hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined...</h5>`
        );
      })

      .on("receipt", function (receipt) {
        printUploadInfo(receipt);
        generateQRCode();
      })

      .on("confirmation", function (confirmationNr) { })
      .on("error", function (error) {
        console.log(error.message);
        $("#note").html(`<h5 class="text-center">${error.message} 😏</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      });
  }
}

//delete document hash from the contract
//only the exporter who add it can delete it
async function deleteHash() {
  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  get_ChainID();

  if (window.hashedfile) {
    await window.contract.methods
      .deleteHash(window.hashedfile)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴</h5>`
        );
      })

      .on("receipt", function (receipt) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Document Deleted 😳</h5>`
        );

        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      })

      .on("confirmation", function (confirmationNr) {
        console.log(confirmationNr);
      })
      .on("error", function (error) {
        console.log(error.message);
        $("#note").html(`<h5 class="text-center">${error.message}</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      });
  }
}

//get current time
function getTime() {
  let d = new Date();
  a =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " - " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();
  return a;
}

//get network name based on ID
async function get_ChainID() {
  let a = await web3.eth.getChainId();
  console.log(a);
  switch (a) {
    case 1:
      window.chainID = "Ethereum Main Network (Mainnet)";
      break;
    case 80001:
      window.chainID = "Polygon Test Network";
      break;
    case 137:
      window.chainID = "Polygon Mainnet";
      break;
    case 3:
      window.chainID = "Ropsten Test Network";
      break;
    case 4:
      window.chainID = "Rinkeby Test Network";
      break;
    case 5:
      window.chainID = "Goerli Test Network";
      break;
    case 42:
      window.chainID = "Kovan Test Network";
      break;
    case 1337:
      window.chainID = "Ganache Test Network"
      break;
    default:
      window.chainID = "Uknnown ChainID";
      break;
  }
  let network = document.getElementById("network");
  if (network) {
    document.getElementById(
      "network"
    ).innerHTML = `<i class="text-info fa-solid fa-circle-nodes mx-2"></i>${window.chainID}`;
  }
}

function get_Sha3() {
  hide_txInfo();
  $("#note").html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`);

  $("#upload_file_button").attr("disabled", false);

  console.log("file changed");

  var file = document.getElementById("doc-file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = web3.utils.soliditySha3(evt.target.result);
      console.log(`Document Hash : ${window.hashedfile}`);
      $("#note").html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`
      );
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
    };
  } else {
    window.hashedfile = null;
  }
}

//logout
function disconnect() {
  $("#logoutButton").hide();
  $("#loginButton").show();
  window.userAddress = null;
  $(".wallet-status").addClass("d-none");
  window.localStorage.setItem("userAddress", null);
  $("#upload_file_button").addClass("disabled");
}

//shortcut wallet address
function truncateAddress(address) {
  if (!address) {
    return;
  }
  return `${address.substr(0, 7)}...${address.substr(
    address.length - 8,
    address.length
  )}`;
}

async function addExporter() {
  const address = document.getElementById("Exporter-address").value;
  const info = document.getElementById("info").value;

  if (info && address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 👍...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    $("#delete").attr("disabled", true);
    $("#edit").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .addExporter(address, info)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Added to the Blockchain 😇</h5>`
          );
        })

        .on("confirmation", function (confirmationNr) { })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message}</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message}</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to add  </h5>`
    );
  }
}

async function getExporterInfo() {
  await window.contract.methods
    .getExporterInfo(window.userAddress)
    .call({ from: window.userAddress })

    .then((result) => {
      window.info = result;
    });
}

async function getCounters() {
  console.log(window.contract.methods.countExporters, 'getcounterfunct');
  await window.contract.methods
    .countExporters()
    .call({ from: window.userAddress })

    .then((result) => {
      $("#num-exporters").html(
        `<i class="fa-solid fa-building-columns mx-2 text-info"></i>${result}`
      );
    });
  await window.contract.methods
    .countHashes()
    .call({ from: window.userAddress })

    .then((result) => {
      $("#num-hashes").html(
        `<i class="fa-solid fa-file mx-2 text-warning"></i>${result}`
      );
    });
}

async function editExporter() {
  const address = document.getElementById("Exporter-address").value;
  const info = document.getElementById("info").value;

  if (info && address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😴...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .alterExporter(address, info)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😇...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Updated Successfully 😊</h5>`
          );
        })

        .on("confirmation", function (confirmationNr) { })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to update 😵‍💫 </h5>`
    );
  }
}

async function deleteExporter() {
  const address = document.getElementById("Exporter-address").value;

  if (address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😕...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .deleteExporter(address)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴 ...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Deleted Successfully 🙂</h5>`
          );
        })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address to delete 👍</h5>`
    );
  }
}

// Generate QR code so any one an Verify the documents
//note: if you r using local server you need to replace 127.0.0.1 with your machine local ip address got from the router
function generateQRCode() {
  document.getElementById("qrcode").innerHTML = "";
  console.log("making qr-code...");
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  if (!window.hashedfile) return;
  let url = `${window.location.host}/verify.html?hash=${window.hashedfile}`;
  qrcode.makeCode(url);
  document.getElementById("download-link").download =
    document.getElementById("doc-file").files[0].name;
  document.getElementById("verfiy").href =
    window.location.protocol + "//" + url;

  function makeDownload() {
    document.getElementById("download-link").href =
      document.querySelector("#qrcode img").src;
  }
  setTimeout(makeDownload, 500);
  //  makeDownload();
}

//check old transaction and show them if exist
//Transactions in last afew hours will show but very old transactions wont show
// cuz the pastEvents returns transactions in last 999 block
function listen() {
  console.log("started...");
  if (window.location.pathname != "/upload.html") return;
  // document.querySelector(".loading-tx").classList.remove("d-none");
  window.web3 = new Web3(new Web3.providers.HttpProvider(window.CONTRACT.network));
  window.contract = new window.web3.eth.Contract(
    window.CONTRACT.abi,
    window.CONTRACT.address
  );

  window.web3.eth.getBlockNumber().then((blockNumber) => {
    console.log(blockNumber);
    window.contract.getPastEvents(
      "HashAdded",
      {
        filter: {
          _exporter: window.userAddress, //Only get the documents uploaded by current Exporter
        },
        fromBlock: 0,
        toBlock: "latest",
      }
    )
      .then(function (events) {
        console.log(events) // same results as the optional callback above
      }).catch(function (errors) {
        console.log(errors) // same results as the optional callback above
      })
  })

}

//If there is past tx then show them
function printTransactions(data) {
  document.querySelector(".transactions").innerHTML = "";
  document.querySelector(".loading-tx").classList.add("d-none");
  if (!data.length) {
    $("#recent-header").hide();
    return;
  }
  const main = document.querySelector(".transactions");
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement("a");
    a.href = `${window.CONTRACT.explore}` + "/tx/" + data[i].transactionHash;
    a.setAttribute("target", "_blank");
    a.className =
      "col-lg-3 col-md-4 col-sm-5 m-2  bg-dark text-light rounded position-relative card";
    a.style = "overflow:hidden;";
    const image = document.createElement("object");
    image.style = "width:100%;height: 100%;";

    image.data = `https://gray-abundant-wolf-888.mypinata.cloud/ipfs/${data[i].returnValues[1]}`;
    const num = document.createElement("h1");
    num.append(document.createTextNode(i + 1));
    a.appendChild(image);
    num.style =
      "position:absolute; left:4px; bottom: -20px;font-size:4rem; color: rgba(20, 63, 74, 0.35);";
    a.appendChild(num);
    main.prepend(a);
  }
  $("#recent-header").show();
}

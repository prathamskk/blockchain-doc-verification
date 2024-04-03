// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma abicoder v1;

contract Verification {
    uint16 public countExporters;
    uint16 public countHashes;
    address public owner;

    struct Record {
        uint blockNumber;
        uint minetime;
        string info;
        string ipfsHash;
    }

    struct ExporterRecord {
        uint blockNumber;
        string info;
    }

    mapping (bytes32 => Record) private docHashes;
    mapping (address => ExporterRecord) private exporters;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    modifier authorizedExporter(bytes32 _doc) {
        require(keccak256(abi.encodePacked(exporters[msg.sender].info)) == keccak256(abi.encodePacked(docHashes[_doc].info)), "Caller is not authorized to edit this document");
        _;
    }

    modifier canAddHash() {
        require(exporters[msg.sender].blockNumber != 0, "Caller not authorized to add documents");
        _;
    }

    event HashAdded(address indexed exporter, string ipfsHash);

    constructor() {
        owner = msg.sender;
    }

    function addExporter(address _addr, string calldata _info) external onlyOwner {
        require(exporters[_addr].blockNumber == 0, "Exporter already exists");
        
        exporters[_addr].blockNumber = block.number;
        exporters[_addr].info = _info;
        countExporters++;
    }

    function deleteExporter(address _addr) external onlyOwner {
        require(exporters[_addr].blockNumber != 0, "Exporter does not exist");
        
        delete exporters[_addr];
        countExporters--;
    }
    
    function alterExporter(address _addr, string calldata _newInfo) external onlyOwner { 
        require(exporters[_addr].blockNumber != 0, "Exporter does not exist");
        
        exporters[_addr].info = _newInfo;
    }

    function changeOwner(address _newOwner) external onlyOwner validAddress(_newOwner) {  
        owner = _newOwner;
    }

    function addDocHash(bytes32 _hash, string calldata _ipfs) external canAddHash {
        require(docHashes[_hash].blockNumber == 0 && docHashes[_hash].minetime == 0, "Document hash already exists");

        Record memory newRecord = Record({
            blockNumber: block.number,
            minetime: block.timestamp,
            info: exporters[msg.sender].info,
            ipfsHash: _ipfs
        });

        docHashes[_hash] = newRecord; 
        countHashes++;
        emit HashAdded(msg.sender, _ipfs);
    }

    function findDocHash(bytes32 _hash) external view returns (uint, uint, string memory, string memory) {
        Record memory doc = docHashes[_hash];
        return (doc.blockNumber, doc.minetime, doc.info, doc.ipfsHash);
    }

    function deleteHash(bytes32 _hash) external authorizedExporter(_hash) canAddHash {
        require(docHashes[_hash].minetime != 0, "Document hash does not exist");

        delete docHashes[_hash];
        countHashes--;
    }
    
    function getExporterInfo(address _addr) external view returns (string memory) {
        return exporters[_addr].info;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@pancakeswap/v3-core/contracts/interfaces/IPancakeV3Pool.sol";
import "@pancakeswap/v3-periphery/contracts/interfaces/IPancakeV3Router.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlashLoanArbitrage is ReentrancyGuard {
    address public owner;
    IPancakeV3Router public router;
    address public tokenA;
    address public tokenB;
    address public pool;
    AggregatorV3Interface public priceFeedA;
    AggregatorV3Interface public priceFeedB;
    
    uint256 public minProfitThreshold;
    uint256 public slippageTolerance;
    bool public isExecutionPaused;
    
    event ArbitrageExecuted(uint256 amount, uint256 profit);
    event ProfitsWithdrawn(uint256 amount);
    event ParametersUpdated(uint256 minProfitThreshold, uint256 slippageTolerance);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier notPaused() {
        require(!isExecutionPaused, "Execution is paused");
        _;
    }

    constructor(
        address _router,
        address _tokenA,
        address _tokenB,
        address _pool,
        address _priceFeedA,
        address _priceFeedB
    ) {
        require(_router != address(0), "Invalid router address");
        require(_tokenA != address(0), "Invalid tokenA address");
        require(_tokenB != address(0), "Invalid tokenB address");
        require(_pool != address(0), "Invalid pool address");
        require(_priceFeedA != address(0), "Invalid price feed A address");
        require(_priceFeedB != address(0), "Invalid price feed B address");

        owner = msg.sender;
        router = IPancakeV3Router(_router);
        tokenA = _tokenA;
        tokenB = _tokenB;
        pool = _pool;
        priceFeedA = AggregatorV3Interface(_priceFeedA);
        priceFeedB = AggregatorV3Interface(_priceFeedB);
        
        minProfitThreshold = 0.001 ether;
        slippageTolerance = 200;
        isExecutionPaused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

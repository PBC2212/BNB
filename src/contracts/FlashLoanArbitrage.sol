// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@pancakeswap/v3-core/contracts/interfaces/IPancakeV3Pool.sol";
import "@pancakeswap/v3-periphery/contracts/interfaces/IPancakeRouter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlashLoanArbitrage is ReentrancyGuard {
    address public owner;
    IPancakeRouter public router;
    address public tokenA;
    address public tokenB;
    address public pool;
    AggregatorV3Interface public priceFeedA;
    AggregatorV3Interface public priceFeedB;
    
    // Additional variables for improved functionality
    uint256 public minProfitThreshold;
    uint256 public slippageTolerance; // in basis points (1/100 of a percent)
    bool public isExecutionPaused;
    
    // Events for better tracking
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
        owner = msg.sender;
        router = IPancakeRouter(_router);
        tokenA = _tokenA;
        tokenB = _tokenB;
        pool = _pool;
        priceFeedA = AggregatorV3Interface(_priceFeedA);
        priceFeedB = AggregatorV3Interface(_priceFeedB);
        
        // Default settings
        minProfitThreshold = 0.001 ether; // Minimum profit to execute
        slippageTolerance = 200; // 2% default slippage tolerance
        isExecutionPaused = false;
    }

    function executeFlashLoan(uint256 amount) external onlyOwner notPaused nonReentrant {
        (bool profitable, uint256 estimatedProfit) = checkArbitrageProfitability(amount);
        require(profitable, "No profit opportunity");
        require(estimatedProfit >= minProfitThreshold, "Profit below threshold");
        
        IPancakeV3Pool(pool).flash(address(this), amount, 0, abi.encode(amount));
    }

    function pancakeV3FlashCallback(uint256 fee0, uint256 fee1, bytes calldata data) external nonReentrant {
        require(msg.sender == address(pool), "Invalid sender");
        uint256 amount = abi.decode(data, (uint256));
        uint256 balanceBefore = IERC20(tokenA).balanceOf(address(this));

        require(IERC20(tokenA).balanceOf(address(router)) >= amount, "Not enough liquidity in pool");
        
        // Multi-path swap for better rates
        _optimizedSwap(tokenA, tokenB, amount);

        // Swap tokenB back to tokenA using the best available route
        _optimizedSwap(tokenB, tokenA, IERC20(tokenB).balanceOf(address(this)));

        uint256 balanceAfter = IERC20(tokenA).balanceOf(address(this));
        uint256 profit = balanceAfter - (balanceBefore + fee0);
        require(profit > 0, "No profit");

        // Repay loan
        IERC20(tokenA).transfer(pool, amount + fee0);
        
        emit ArbitrageExecuted(amount, profit);
    }

    function _optimizedSwap(address from, address to, uint256 amount) internal {
        IERC20(from).approve(address(router), amount);
        
        // Check if direct path or multi-hop path is better
        uint256 directSwapEstimate = getDirectSwapEstimate(from, to, amount);
        uint256 multiHopEstimate = getMultiHopEstimate(from, to, amount);
        
        if (multiHopEstimate > directSwapEstimate) {
            _executeMultiHopSwap(from, to, amount);
        } else {
            _executeDirectSwap(from, to, amount);
        }
    }
    
    function _executeDirectSwap(address from, address to, uint256 amount) internal {
        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;

        uint256[] memory amounts = router.getAmountsOut(amount, path);
        require(amounts.length > 1, "Invalid swap path");
        
        // Calculate minimum output with slippage protection
        uint256 minOut = amounts[1] - (amounts[1] * slippageTolerance / 10000);

        router.swapExactTokensForTokens(amount, minOut, path, address(this), block.timestamp);
    }
    
    function _executeMultiHopSwap(address from, address to, uint256 amount) internal {
        // Example using a common intermediate token like WETH
        address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // Example WETH address
        
        address[] memory path = new address[](3);
        path[0] = from;
        path[1] = weth;
        path[2] = to;

        uint256[] memory amounts = router.getAmountsOut(amount, path);
        require(amounts.length > 2, "Invalid multi-hop path");
        
        uint256 minOut = amounts[2] - (amounts[2] * slippageTolerance / 10000);

        router.swapExactTokensForTokens(amount, minOut, path, address(this), block.timestamp);
    }

    function checkArbitrageProfitability(uint256 amount) public view returns (bool, uint256) {
        (, int256 priceA,,,) = priceFeedA.latestRoundData();
        (, int256 priceB,,,) = priceFeedB.latestRoundData();
        
        // Get prices from different sources for comparison
        uint256 dexPriceA = getDexPrice(tokenA, tokenB, amount);
        uint256 dexPriceB = getDexPrice(tokenB, tokenA, amount);
        
        // Calculate estimated profit accounting for gas costs
        uint256 estimatedProfit = (dexPriceB - dexPriceA) * amount / 1e18;
        uint256 estimatedGasCost = 0.005 ether; // Estimated gas cost
        
        if (estimatedProfit > estimatedGasCost) {
            return (true, estimatedProfit - estimatedGasCost);
        }
        return (false, 0);
    }

    function getDirectSwapEstimate(address from, address to, uint256 amount) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;
        uint256[] memory amounts = router.getAmountsOut(amount, path);
        return amounts[1];
    }
    
    function getMultiHopEstimate(address from, address to, uint256 amount) public view returns (uint256) {
        address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // Example WETH address
        
        address[] memory path = new address[](3);
        path[0] = from;
        path[1] = weth;
        path[2] = to;
        
        uint256[] memory amounts = router.getAmountsOut(amount, path);
        return amounts[2];
    }

    function getDexPrice(address from, address to, uint256 amount) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;
        uint256[] memory amounts = router.getAmountsOut(amount, path);
        return amounts[1];
    }

    // Improved profit withdrawal with partial withdrawal option
    function withdrawProfits(uint256 amount) external onlyOwner nonReentrant {
        uint256 balance = IERC20(tokenA).balanceOf(address(this));
        require(balance > 0, "No profits");
        
        // If amount is 0, withdraw all
        uint256 withdrawAmount = amount == 0 ? balance : amount;
        require(withdrawAmount <= balance, "Insufficient balance");
        
        IERC20(tokenA).transfer(owner, withdrawAmount);
        emit ProfitsWithdrawn(withdrawAmount);
    }
    
    // Configuration functions
    function updateParameters(uint256 _minProfitThreshold, uint256 _slippageTolerance) external onlyOwner {
        require(_slippageTolerance <= 1000, "Slippage too high"); // Max 10%
        minProfitThreshold = _minProfitThreshold;
        slippageTolerance = _slippageTolerance;
        emit ParametersUpdated(_minProfitThreshold, _slippageTolerance);
    }
    
    function setPaused(bool _paused) external onlyOwner {
        isExecutionPaused = _paused;
    }
    
    // Emergency functions
    function emergencyWithdraw(address token) external onlyOwner nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        IERC20(token).transfer(owner, balance);
    }
    
    // Allow owner to update price feeds if needed
    function updatePriceFeeds(address _priceFeedA, address _priceFeedB) external onlyOwner {
        priceFeedA = AggregatorV3Interface(_priceFeedA);
        priceFeedB = AggregatorV3Interface(_priceFeedB);
    }
    
    // Allow transfer of ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

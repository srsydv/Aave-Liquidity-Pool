# Aave Liquidity Pool

A Solidity smart contract for interacting with Aave V3 liquidity pools, providing simplified functions for supplying and withdrawing liquidity, managing user account data, and handling token operations.

## Features

- **Supply Liquidity**: Deposit tokens into Aave V3 pools
- **Withdraw Liquidity**: Withdraw tokens from Aave V3 pools
- **User Account Data**: Get comprehensive user account information
- **Token Balance**: Check token balances
- **Owner Controls**: Secure withdrawal functions with owner-only access
- **Event Logging**: Comprehensive event emission for all operations
- **ETH Reception**: Accept ETH payments

## Contract Structure

### Main Contract: `AaveLiquidityPool.sol`

The main contract provides the following functions:

- `supplyLiquidity(address _tokenAddress, uint256 _amount)`: Supply tokens to Aave pool
- `withdrawlLiquidity(address _tokenAddress, uint256 _amount)`: Withdraw tokens from Aave pool
- `getUserAccountData(address _userAddress)`: Get user account data
- `getBalance(address _tokenAddress)`: Get token balance
- `withdraw(address _tokenAddress)`: Owner-only token withdrawal
- `receive()`: Accept ETH payments

### Mock Contracts for Testing

- `MockPoolAddressesProvider.sol`: Mock Aave pool addresses provider
- `MockPool.sol`: Mock Aave pool with tracking capabilities
- `MockERC20.sol`: Mock ERC20 token for testing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Aave-Liquidity-Pool
```

2. Install dependencies:
```bash
npm install
```

3. Compile contracts:
```bash
npx hardhat compile
```

## Testing

The project includes comprehensive test suites:

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test files
npx hardhat test test/SimpleTest.js
npx hardhat test test/AaveLiquidityPoolTest.js
npx hardhat test test/FinalTest.js
```

### Test Coverage

The tests cover:

- **Deployment**: Contract deployment and initialization
- **Supply Liquidity**: Token supply functionality and events
- **Withdraw Liquidity**: Token withdrawal functionality and events
- **User Account Data**: Account data retrieval
- **Owner Controls**: Access control and security
- **Edge Cases**: Zero amounts, invalid addresses
- **Mock Contracts**: Mock contract functionality

## Usage

### Deployment

```javascript
const AaveLiquidityPool = await ethers.getContractFactory("AaveLiquidityPool");
const aaveLiquidityPool = await AaveLiquidityPool.deploy(addressesProvider);
```

### Supply Liquidity

```javascript
await aaveLiquidityPool.supplyLiquidity(tokenAddress, amount);
```

### Withdraw Liquidity

```javascript
const withdrawnAmount = await aaveLiquidityPool.withdrawlLiquidity(tokenAddress, amount);
```

### Get User Account Data

```javascript
const accountData = await aaveLiquidityPool.getUserAccountData(userAddress);
```

## Events

The contract emits the following events:

- `SupplyLiquidity(address indexed tokenAddress, uint256 amount)`
- `WithdrawLiquidity(address indexed tokenAddress, uint256 amount)`
- `Withdraw(address indexed tokenAddress)`

## Security Features

- **Owner Controls**: Critical functions restricted to contract owner
- **Input Validation**: Proper parameter validation
- **Event Logging**: Comprehensive event emission for transparency
- **Safe Token Operations**: Secure token transfer and approval mechanisms

## Dependencies

- **Hardhat**: Development environment and testing framework
- **OpenZeppelin**: ERC20 token implementation
- **Aave Core V3**: Aave protocol interfaces (for production use)

## Configuration

The project uses Hardhat configuration with:

- Solidity version: 0.8.20
- Optimizer enabled with 200 runs
- EVM target: Paris

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on the repository.

---

**Note**: This is a development/testing version. For production use, ensure proper integration with Aave V3 protocol and thorough security auditing.

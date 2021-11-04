// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./ProxyOwnable.sol";

contract REFLECT5 is Context, IERC20 {
    using SafeMath for uint256;
    using Address for address;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;

    //blacklist IPs
    mapping (address => bool) private _isExcluded;
    address[] private _excluded;

    uint256 private constant MAX = ~uint256(0);
    uint256 private constant MAXed = ~uint256(0);
    // total supply of tokens
	uint256 private constant _tTotal = 1000;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    address private constant _burnAddress = 0x000000000000000000000000000000000000dEaD;
    uint256 private _burnFeeTotal;

    // All address that need to be whitelisted are described as follows
    // variable name - description
    // value - address
    //address public constant EMAXMint = 0x15874d65e649880c2614e7a480cb7c9a55787ff6;
    address public constant EMAXMint = 0x263674F945b6903Cd421d755337710DD8083fcC1;
    address public constant bitforex = 0xd81d665edeEe5762FCbC4802520910ED509dA22a;
    address public constant EMAXExpenseOld = 0x331626d097cc466f6544257c2Dc18f60f6382414;
    address public constant EMAXExpense = 0x87Ba6c0B3E06d4B9Ae4E5c5752D8E94AeE135470;
    address public constant EMAXTreasury = 0x5EA06A2bE857D35D5E545b2bF54b2d387bB8B4bA;
    address public constant EMAXEvents = 0x80dF68fA5275D0e1EE83aA4160f0b82033597f51;

    mapping(address => bool) public whitelist;

   constructor () public {
    //function initialize() public initializer {
        //ownerInitialize();
        _rTotal = (MAX - (MAX % _tTotal));
        _name = "EthereumMax";
        _symbol = "eMax";
        _decimals = 18;

        _rOwned[_msgSender()] = _rTotal;
        emit Transfer(address(0), _msgSender(), _tTotal);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public pure override returns (uint256) {
        return _tTotal;
    }

    function totalMAX() public view returns  (uint256) {
        return MAXed;
    }

    function ourSupply() public view returns  (uint256) {
        return _rTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function isExcluded(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function reflect(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,) = _getValues(tAmount, 6);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,) = _getValues(tAmount, 6);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,) = _getValues(tAmount, 6);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }


    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        uint256 txFee = 6;
        uint256 burnFee = 3;

        // Whitelisted the deployer
        if (
            sender == bitforex || recipient == bitforex ||
            sender == EMAXExpenseOld || recipient == EMAXExpenseOld ||
            sender == EMAXExpense || recipient == EMAXExpense ||
            sender == EMAXTreasury || recipient == EMAXTreasury ||
            sender == EMAXEvents || recipient == EMAXEvents ||
            sender == EMAXMint || recipient == EMAXMint
        ) {
            txFee = 0;
            burnFee = 0;
        }

        uint256 totalFeePercentage = txFee + burnFee;
        
        (uint256 rAmount, uint256 rTransferAmount, uint256 tTransferAmount, uint256 currentRate) = _getValues(amount, totalFeePercentage);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);

        if (_isExcluded[sender]) { _tOwned[sender] = _tOwned[sender].sub(amount); }
        if (_isExcluded[recipient]) { _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount); }

        // txfee is 6% but not for whitelist
        uint256 tFee = amount.mul(txFee).div(100);
        // deflation amount for bank ratio
        uint256 rFee = tFee.mul(currentRate);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);

        uint256 tBurn = amount.mul(burnFee).div(100);
        uint256 rBurn = tBurn.mul(currentRate);
        _burnTokens(sender, tBurn, rBurn);
    }

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }
    // changed to public
    function _getValues(uint256 tAmount, uint256 totalFeePercentage) public view returns (uint256, uint256, uint256, uint256) {
        uint256 currentRate =  _getRate();

        uint256 totalFee = tAmount.mul(totalFeePercentage).div(100);
        uint256 tTransferAmount = tAmount.sub(totalFee);
        
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = totalFee.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee);
        return (rAmount, rTransferAmount, tTransferAmount, currentRate);
    }

    function _getRate() public view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }
    // ******** changed to public from private
    function _getCurrentSupply() public view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;   
        uint256 excludedLength = _excluded.length;   
        for (uint256 i = 0; i < excludedLength; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }

    //------------------- Owner

    function excludeAccount(address account) external  {
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeAccount(address account) external  {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }

    //------------------- Burn Baby Burn

    function _burnTokens(address sender, uint256 tBurn, uint256 rBurn) internal {
        _rOwned[_burnAddress] = _rOwned[_burnAddress].add(rBurn);
        if (_isExcluded[_burnAddress])
            _tOwned[_burnAddress] = _tOwned[_burnAddress].add(tBurn);

        emit Transfer(sender, _burnAddress, tBurn);
        _burnFeeTotal = _burnFeeTotal.add(tBurn);
    }
}

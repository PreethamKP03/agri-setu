// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriSetuEscrow
 * @dev Decentralized 60/40 Escrow Protocol for Direct Farm-to-Shop Wholesale Trade.
 * Designed for Sepolia / Polygon Amoy Testnet.
 */
contract AgriSetuEscrow {
    enum Stage { Placed, SixtyPaid, Dispatched, Delivered, FortyPaid, Closed }

    struct Order {
        uint256 id;
        address payable farmer;
        address payable vendor;
        uint256 totalAmount;
        uint256 sixtyPercentDeposit;
        uint256 fortyPercentBalance;
        Stage stage;
        string ipfsQualityHash;
        uint256 createdAt;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    event OrderPlaced(uint256 indexed orderId, address indexed vendor, address indexed farmer, uint256 totalAmount);
    event SixtyPercentPaid(uint256 indexed orderId, uint256 amount);
    event ProduceDispatched(uint256 indexed orderId, string trackingHash);
    event DeliveryConfirmed(uint256 indexed orderId);
    event FortyPercentPaid(uint256 indexed orderId, uint256 amount);
    event OrderClosed(uint256 indexed orderId);

    // Place Order & Lock 100% Escrow in Smart Contract
    function placeOrder(address payable _farmer, string memory _ipfsQualityHash) external payable returns (uint256) {
        require(msg.value > 0, "Escrow amount must be > 0");
        orderCount++;
        
        uint256 sixty = (msg.value * 60) / 100;
        uint256 forty = msg.value - sixty;

        orders[orderCount] = Order({
            id: orderCount,
            farmer: _farmer,
            vendor: payable(msg.sender),
            totalAmount: msg.value,
            sixtyPercentDeposit: sixty,
            fortyPercentBalance: forty,
            stage: Stage.SixtyPaid,
            ipfsQualityHash: _ipfsQualityHash,
            createdAt: block.timestamp
        });

        emit OrderPlaced(orderCount, msg.sender, _farmer, msg.value);
        emit SixtyPercentPaid(orderCount, sixty);

        return orderCount;
    }

    // Farmer confirms dispatch -> Releases 60% deposit to Farmer wallet
    function dispatchProduce(uint256 _orderId, string memory _trackingHash) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.farmer, "Only farmer can dispatch");
        require(order.stage == Stage.SixtyPaid, "Invalid stage for dispatch");

        order.stage = Stage.Dispatched;
        
        // Payout 60% to farmer
        (bool success, ) = order.farmer.call{value: order.sixtyPercentDeposit}("");
        require(success, "Transfer of 60% deposit failed");

        emit ProduceDispatched(_orderId, _trackingHash);
    }

    // Vendor confirms delivery
    function confirmDelivery(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.vendor, "Only vendor can confirm delivery");
        require(order.stage == Stage.Dispatched, "Invalid stage for delivery");

        order.stage = Stage.Delivered;
        emit DeliveryConfirmed(_orderId);
    }

    // Vendor or Contract releases remaining 40% balance to Farmer wallet
    function releaseFinalForty(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.vendor || msg.sender == order.farmer, "Unauthorized");
        require(order.stage == Stage.Delivered, "Must be delivered first");

        order.stage = Stage.Closed;

        // Payout remaining 40% to farmer
        (bool success, ) = order.farmer.call{value: order.fortyPercentBalance}("");
        require(success, "Transfer of 40% balance failed");

        emit FortyPercentPaid(_orderId, order.fortyPercentBalance);
        emit OrderClosed(_orderId);
    }

    // View Order Details
    function getOrderInfo(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }
}

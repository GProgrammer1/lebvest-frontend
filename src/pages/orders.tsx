class Order {
   orderId: string;
   customer: Customer;
   items: Item[];

  constructor(orderId: string, customer: Customer, items: Item[]) {
    this.orderId = orderId;
    this.customer = customer;
    this.items = items;
  }
}

class Item {
   productId: string;
   price: number;
   name: string;
   quantity: number;

  constructor(productId: string, price: number, name: string, quantity: number) {
    this.productId = productId;
    this.price = price;
    this.name = name;
    this.quantity = quantity;
  }
}

class Customer {
   name: string;
   email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

class OrderSummary {
   totalOrders: number;
   totalRevenue: number;
   topCustomer: string;

  constructor(totalOrders: number, totalRevenue: number, topCustomer: string) {
    this.totalOrders = totalOrders;
    this.totalRevenue = totalRevenue;
    this.topCustomer = topCustomer;
  }
}

function analyzeOrders(orders: Order[]) {
    const prices = orders.map((order) => order.items.reduce((acc, curr) => acc + curr.price* curr.quantity, 0));
    const sortedPrices = prices.sort((a,b) => b - a);
    const idxOfHighestPayingCustomer = prices.indexOf(sortedPrices[0]);
    const mostPayingCustomerName = orders[idxOfHighestPayingCustomer]['customer']['name'];
    const orderSummary = new OrderSummary(
        orders.length,
        prices.reduce((acc, curr) => acc + curr, 0),
        mostPayingCustomerName
    );
    return orderSummary;

}

const orders: Order[] = [
  {
    orderId: "001",
    customer: { name: "Alice", email: "alice@example.com" },
    items: [
      { productId: "A1", name: "Laptop", price: 1000, quantity: 1 },
      { productId: "B2", name: "Mouse", price: 50, quantity: 2 }
    ]
  },
  {
    orderId: "002",
    customer: { name: "Bob", email: "bob@example.com" },
    items: [
      { productId: "C3", name: "Monitor", price: 300, quantity: 2 }
    ]
  },
  {
    orderId: "003",
    customer: { name: "Alice", email: "alice@example.com" },
    items: [
      { productId: "D4", name: "Keyboard", price: 100, quantity: 1 }
    ]
  }
];
console.log(analyzeOrders(orders));


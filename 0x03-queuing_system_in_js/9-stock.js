// Use redis with web server created using express
import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// redis client
const client = createClient();
// promisify client.get
const getAsync = promisify(client.get).bind(client);

// create app
const app = express();
const port = 1245;

// list of products with initial stock
const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// returns the product with given id from `listProducts`
function getItemById(id) {
  return listProducts.find((product) => product.Id === id);
}

// set in Redis the stock for the key item.ITEM_ID
function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

// return the reserved stock for a specific item using `getAsync` (returns a Promise)
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock;
}

// GET /list_products
app.get('/list_products', (req, res) => {
  res.send(JSON.stringify(listProducts));
});

// GET /list_products/:itemId - return the current product and the current available stock
app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);
  if (item) { // item exists
    // await since getCurrent returns a Promise
    const reservedStock = await getCurrentReservedStockById(itemId);
    const { itemName, price, stock } = item;
    const responseData = {
      itemId,
      itemName,
      price,
      initialAvailableQuantity: stock,
      // subtract reservedStock if any from initial stock to get currentQuantity
      currentQuantity: stock - (reservedStock ? parseInt(reservedStock, 10) : 0),
    };
    res.send(JSON.stringify(responseData));
  } else res.send(JSON.stringify({ status: 'Product not found' })); // item doesn't exist
});

// GET /reserve_product/:itemId - if currentQuantity > 1, reserves 1 item
app.get('/reserve_product/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);
  if (item) {
    // await since getCurrent returns a Promise
    let reservedStock = await getCurrentReservedStockById(itemId);
    reservedStock = reservedStock ? parseInt(reservedStock, 10) : 0;
    const { stock } = item;
    const currentQuantity = stock - reservedStock;

    // check if atleast one of item exists
    if (currentQuantity === 0) { // no stock left
      res.send(JSON.stringify({ status: 'Not enough stock available', itemId }));
    } else { // reserve one more item
      reserveStockById(itemId, reservedStock + 1);
      res.send(JSON.stringify({ status: 'Reservation confirmed', itemId }));
    }
  } else res.send(JSON.stringify({ status: 'Product not found' })); // item doesn't exist
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

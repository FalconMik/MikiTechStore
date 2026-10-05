# Protector inventory

The protector page is ready for real stock. Its inventory is currently empty.

Send a list containing phone brand, exact phone model, protector type, price in KSh, and quantity. A plain list or spreadsheet is enough.

The four photographed products map to:

| Product ID | Product | Finish |
| --- | --- | --- |
| ceramic-matte | Ceramic full-cover film | Matte |
| matte-glass | Yellow-pack matte glass | Matte |
| full-cover-glass | Purple/gold full-cover glass | Clear |
| ok-solid-glass | Blue/gorilla OK SOLID glass | Clear |

Add confirmed stock rows to `PROTECTOR_INVENTORY` in `js/protector-inventory.js`. Each row has a unique stable `id`, `brand`, `model`, `productId`, numeric `price`, and integer `stock`. Only valid rows with positive stock produce selectable phone models. Privacy is an available finish; add its product details to `PROTECTOR_CATALOG` when supplied.

All brands previews the product types without prices or ordering. Selecting a brand reveals available models in a horizontal row. Selecting a model reveals its stock grouped by Matte, Clear, and Privacy. The bag and WhatsApp order carry the exact model and model-specific price. Quantity changes are capped at the configured stock; stock is locally configured, not a shared reservation system.

Run checks with `node tests/protectors.test.cjs`. Fixtures are isolated in the test and do not appear in the real shop.

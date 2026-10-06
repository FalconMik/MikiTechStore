# Protector inventory

Stock entered from the owner’s list on 6 October 2026. Repeated entries are combined. There are 27 confirmed pieces. Prices are unset as requested; availability is visible and ordering is disabled until prices are supplied.

| Protector | Phone | Available |
| --- | --- | ---: |
| OK SOLID clear glass | Samsung A53 | 2 |
| OK SOLID clear glass | Redmi Note 11 | 1 |
| OK SOLID clear glass | Samsung A50 | 1 |
| OK SOLID clear glass | Samsung A15 | 2 |
| OK SOLID clear glass | Samsung A24 | 2 |
| OK SOLID clear glass | Samsung A51 | 1 |
| Matte ceramic | Samsung A54 | 2 |
| Matte ceramic | Samsung A55 | 2 |
| Full-cover clear glass | Redmi 13C | 3 |
| Full-cover clear glass | Tecno Camon 30 | 1 |
| Yellow-pack matte glass | Samsung A15 | 2 |
| Yellow-pack matte glass | Samsung A05 | 2 |
| Privacy | Redmi 14C | 2 |
| OG ESD clear full glue | Infinix Hot 9 | 3 |
| Star clear protector | Samsung A52 | 1 |

All entries are confirmed. “Samsung 1824” was clarified as Samsung A24 clear, and “Start sam A52” as Star Samsung A52 clear. ESD, Star, and Privacy use illustrative images until product photos are supplied.

Inventory is in `js/protector-inventory.js`. Each row has a stable unique id, brand, model, productId, price (null until supplied), and stock. Only positive stock produces available model buttons. Quantities are locally configured, not a shared reservation system.

Run checks with `node tests/protectors.test.cjs`.

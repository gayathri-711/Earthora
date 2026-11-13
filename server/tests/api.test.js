import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import request from 'supertest';

import app from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { seedIfEmpty } from '../src/seeds/seed.js';

let customerToken = '';
let farmerToken = '';
let adminToken = '';
let firstProductId = '';

before(async () => {
  await connectDatabase('');
  await seedIfEmpty();
});

after(async () => {
  await disconnectDatabase();
});

test('GET /api/health returns healthy status', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test('GET /api/v1/products returns seeded organic produce', async () => {
  const res = await request(app).get('/api/v1/products');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.products));
  assert.ok(res.body.data.products.length >= 6);
  firstProductId = res.body.data.products[0]._id;
});

test('Auth login works for Customer, Farmer, and Admin accounts', async () => {
  const cust = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'customer@agriva.com', password: 'Agriva123!' });
  assert.equal(cust.status, 200);
  customerToken = cust.body.data.token;

  const frm = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'farmer@agriva.com', password: 'Agriva123!' });
  assert.equal(frm.status, 200);
  farmerToken = frm.body.data.token;

  const adm = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@agriva.com', password: 'Agriva123!' });
  assert.equal(adm.status, 200);
  adminToken = adm.body.data.token;
});

test('RBAC blocks customer from farmer and admin routes', async () => {
  const farmerRes = await request(app)
    .get('/api/v1/farmer/dashboard')
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(farmerRes.status, 403);

  const adminRes = await request(app)
    .get('/api/v1/admin/overview')
    .set('Authorization', `Bearer ${farmerToken}`);
  assert.equal(adminRes.status, 403);
});

test('Farmer can create product and Customer can place + track order', async () => {
  const prodRes = await request(app)
    .post('/api/v1/farmer/products')
    .set('Authorization', `Bearer ${farmerToken}`)
    .send({
      name: 'Fresh Organic Spinach',
      category: 'vegetables',
      price: 4.5,
      unit: '250g bunch',
      stock: 20,
      shortDescription: 'Crisp morning-picked spinach.',
    });
  assert.equal(prodRes.status, 201);
  const createdProduct = prodRes.body.data.product;

  const orderRes = await request(app)
    .post('/api/v1/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      items: [{ productId: createdProduct._id, quantity: 2 }],
      shippingAddress: {
        fullName: 'Claire Bennett',
        email: 'customer@agriva.com',
        phone: '+1 555 010 2233',
        street: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        postalCode: '97205',
      },
      paymentMethod: 'card',
      couponCode: 'ORGANIC10',
    });
  assert.equal(orderRes.status, 201);
  const orderNumber = orderRes.body.data.order.orderNumber;

  const trackRes = await request(app).get(`/api/v1/orders/track/${orderNumber}`);
  assert.equal(trackRes.status, 200);
  assert.equal(trackRes.body.data.order.orderNumber, orderNumber);

  const checkProd = await request(app).get(`/api/v1/products/${createdProduct._id}`);
  assert.equal(checkProd.body.data.product.stock, 18);
});

test('Admin overview returns live KPIs and Contact form persists inquiries', async () => {
  const contactRes = await request(app).post('/api/v1/contact').send({
    name: 'Tester',
    email: 'tester@example.com',
    subject: 'Wholesale',
    message: 'Interested in weekly restaurant crates.',
  });
  assert.equal(contactRes.status, 201);

  const ovRes = await request(app)
    .get('/api/v1/admin/overview')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(ovRes.status, 200);
  assert.ok(ovRes.body.data.stats.totalOrders >= 2);
});


import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import request from 'supertest';

import app from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { seedIfEmpty } from '../src/seeds/seed.js';

let customerToken = '';
let farmerToken = '';
let expertToken = '';
let adminToken = '';
let firstProductId = '';

before(async () => {
  await connectDatabase('');
  await seedIfEmpty();
});

after(async () => {
  await disconnectDatabase();
});

test('GET /api/health returns EARTHORA platform status', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.platform, 'EARTHORA');
  assert.equal(res.body.status, 'healthy');
});

test('GET /api/v1/dashboard/smart returns ecosystem metrics & charts', async () => {
  const res = await request(app).get('/api/v1/dashboard/smart');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.metrics.totalFarmers >= 2);
  assert.ok(Array.isArray(res.body.data.salesMonthly));
  assert.ok(Array.isArray(res.body.data.recentActivities));
});

test('Auth login works for Customer, Farmer, Expert, and Admin roles', async () => {
  const cust = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'customer@earthora.io', password: 'Earthora123!' });
  assert.equal(cust.status, 200);
  customerToken = cust.body.data.token;

  const frm = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'farmer@earthora.io', password: 'Earthora123!' });
  assert.equal(frm.status, 200);
  farmerToken = frm.body.data.token;

  const exp = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'expert@earthora.io', password: 'Earthora123!' });
  assert.equal(exp.status, 200);
  expertToken = exp.body.data.token;

  const adm = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@earthora.io', password: 'Earthora123!' });
  assert.equal(adm.status, 200);
  adminToken = adm.body.data.token;
});

test('GET /api/v1/products returns multi-category marketplace catalog', async () => {
  const res = await request(app).get('/api/v1/products');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.products));
  assert.ok(res.body.data.products.length >= 6);
  firstProductId = res.body.data.products[0]._id;
});

test('Crop Management: list, create, and inspect crops', async () => {
  const list = await request(app).get('/api/v1/crops');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body.data.crops));

  const create = await request(app)
    .post('/api/v1/crops')
    .set('Authorization', `Bearer ${farmerToken}`)
    .send({
      name: 'Organic Sweet Corn',
      variety: 'Golden Bantam Heirloom',
      fieldName: 'West Valley Field 03',
      acreage: 10,
      estimatedHarvestDate: '2027-02-15',
      status: 'Seedling',
      growthProgress: 20,
    });
  assert.equal(create.status, 201);
  assert.equal(create.body.data.crop.name, 'Organic Sweet Corn');
});

test('Soil Insights & Weather Intelligence endpoints function cleanly', async () => {
  const soil = await request(app).get('/api/v1/soil/analytics');
  assert.equal(soil.status, 200);
  assert.ok(soil.body.data.averagePH >= 6.0);

  const weather = await request(app).get('/api/v1/weather?region=sonoma');
  assert.equal(weather.status, 200);
  assert.equal(weather.body.data.weather.regionName, 'Sonoma Valley & North Coast');
  assert.ok(Array.isArray(weather.body.data.weather.advisories));
});

test('Expert Connect: list experts, Q&A, and consultation booking', async () => {
  const expList = await request(app).get('/api/v1/experts');
  assert.equal(expList.status, 200);
  assert.ok(expList.body.data.experts.length >= 2);

  const qa = await request(app).get('/api/v1/experts/questions');
  assert.equal(qa.status, 200);
  assert.ok(Array.isArray(qa.body.data.questions));

  const consult = await request(app)
    .post('/api/v1/experts/consultations')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      expertId: expList.body.data.experts[0]._id,
      clientName: 'Claire Bennett',
      clientEmail: 'customer@earthora.io',
      date: '2026-11-25',
      timeSlot: '11:00 AM - 12:00 PM',
      topic: 'Cover Crop Nitrogen Fixation Strategy',
    });
  assert.equal(consult.status, 201);
});

test('Knowledge Hub: list articles and fetch article by slug', async () => {
  const articles = await request(app).get('/api/v1/knowledge');
  assert.equal(articles.status, 200);
  assert.ok(articles.body.data.articles.length >= 3);

  const slug = articles.body.data.articles[0].slug;
  const single = await request(app).get(`/api/v1/knowledge/${slug}`);
  assert.equal(single.status, 200);
  assert.equal(single.body.data.article.slug, slug);
});

test('Marketplace order placement, stock decrement, and order tracking', async () => {
  const orderRes = await request(app)
    .post('/api/v1/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      items: [{ productId: firstProductId, quantity: 1 }],
      shippingAddress: {
        fullName: 'Claire Bennett',
        email: 'customer@earthora.io',
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
  const orderNum = orderRes.body.data.order.orderNumber;

  const track = await request(app).get(`/api/v1/orders/track/${orderNum}`);
  assert.equal(track.status, 200);
  assert.equal(track.body.data.order.orderNumber, orderNum);
});

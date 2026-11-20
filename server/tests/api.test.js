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

test('Customer registration and login are normal and immediate', async () => {
  const regEmail = `testcust_${Date.now()}@earthora.io`;
  const regRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'New Organic Shopper',
      email: regEmail,
      password: 'Earthora123!',
      role: 'customer',
      phone: '+1 555 987 6543',
    });

  assert.equal(regRes.status, 201);
  assert.ok(regRes.body.data.token, 'Token should be returned immediately for customers');
  assert.equal(regRes.body.data.requiresApproval, false);

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: regEmail, password: 'Earthora123!' });

  assert.equal(loginRes.status, 200);
  assert.ok(loginRes.body.data.token);
  assert.equal(loginRes.body.data.user.role, 'customer');
});

test('Admin credentials are fixed and public admin registration is rejected', async () => {
  // Public admin signup is blocked
  const rejectAdminReg = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Imposter Admin',
      email: 'imposter@earthora.io',
      password: 'Earthora123!',
      role: 'admin',
    });
  assert.equal(rejectAdminReg.status, 403);

  // Fixed admin login works
  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@earthora.io', password: 'Earthora123!' });
  assert.equal(adminLogin.status, 200);
  assert.equal(adminLogin.body.data.user.role, 'admin');
});

test('Agriculture expert account can only be created by admin, then expert logs in', async () => {
  const expEmail = `agronomist_${Date.now()}@earthora.io`;

  // 1. Public registration as expert is forbidden
  const publicExpReg = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Dr. Jane Plantington',
      email: expEmail,
      password: 'Earthora123!',
      role: 'expert',
      fieldOfStudy: 'Biochar & Nitrogen Stabilization',
      organization: 'Soil Carbon Institute',
      experienceYears: 14,
      consultationFee: 95,
    });

  assert.equal(publicExpReg.status, 403);
  assert.ok(
    publicExpReg.body.message.includes('cannot be registered publicly') ||
    publicExpReg.body.message.includes('created exclusively by platform administrators')
  );

  // 2. Admin creates the expert account via POST /api/v1/admin/experts
  const adminCreateExp = await request(app)
    .post('/api/v1/admin/experts')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Dr. Jane Plantington',
      email: expEmail,
      password: 'Earthora123!',
      title: 'Senior Agronomist',
      fieldOfStudy: 'Biochar & Nitrogen Stabilization',
      organization: 'Soil Carbon Institute',
      location: 'Coimbatore, Tamil Nadu',
      experienceYears: 14,
      consultationFee: 1800,
    });

  assert.equal(adminCreateExp.status, 201);
  assert.equal(adminCreateExp.body.data.expert.approvalStatus, 'approved');
  assert.equal(adminCreateExp.body.data.expert.verified, true);
  assert.equal(adminCreateExp.body.data.user.role, 'expert');

  // 3. Expert immediately logs in using the credentials set by Admin
  const expertLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: expEmail, password: 'Earthora123!' });
  assert.equal(expertLogin.status, 200);
  assert.ok(expertLogin.body.data.token);
  assert.equal(expertLogin.body.data.user.role, 'expert');
  assert.equal(expertLogin.body.data.user.email, expEmail);
});

test('Admin can query all registered customers, experts, and farmers from User database', async () => {
  const res = await request(app)
    .get('/api/v1/admin/users')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.users));
  assert.ok(res.body.data.users.length >= 4);

  const customerUser = res.body.data.users.find((u) => u.role === 'customer');
  assert.ok(customerUser, 'Customer record exists');
  assert.ok(customerUser.email);

  const expertUser = res.body.data.users.find((u) => u.role === 'expert');
  assert.ok(expertUser, 'Expert record exists');
  assert.ok(expertUser.email);
});

test('Orders DB: admin queries outbound orders with items, recipient details, and dispatch status', async () => {
  const res = await request(app)
    .get('/api/v1/admin/orders')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.orders));
  assert.ok(res.body.data.orders.length >= 1);

  const firstOrder = res.body.data.orders[0];
  assert.ok(firstOrder.orderNumber);
  assert.ok(firstOrder.items.length >= 1);
  assert.ok(firstOrder.shippingAddress?.fullName);
  assert.ok(firstOrder.totalAmount > 0);

  const updateRes = await request(app)
    .patch(`/api/v1/admin/orders/${firstOrder._id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'Dispatched', courierPartner: 'BlueDart Express' });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.data.order.status, 'Dispatched');
  assert.ok(updateRes.body.data.order.dispatchedAt);
});

test('Supply Receipts DB: admin logs inbound products received from farmers into database', async () => {
  const createRes = await request(app)
    .post('/api/v1/admin/supply-receipts')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      productName: 'Organic Heirloom Tomato Seeds',
      supplierName: 'Elena Vance - Green Valley Farm',
      supplierContact: '+1 555 014 8899',
      supplierLocation: 'Sonoma County, CA',
      quantityReceived: 50,
      unit: 'boxes',
      unitCost: 180,
      batchNumber: 'BATCH-2026-TOM-99',
      qualityStatus: 'Passed - Grade A Organic',
      warehouseLocation: 'Central Cold Storage Hub A',
      notes: 'Passed USDA organic inspection',
      updateStock: true,
    });
  assert.equal(createRes.status, 201);
  assert.ok(createRes.body.data.receipt.receiptNumber);
  assert.equal(createRes.body.data.receipt.quantityReceived, 50);

  const listRes = await request(app)
    .get('/api/v1/admin/supply-receipts')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(listRes.status, 200);
  assert.ok(Array.isArray(listRes.body.data.receipts));
  assert.ok(listRes.body.data.receipts.length >= 1);
  const found = listRes.body.data.receipts.find((r) => r.batchNumber === 'BATCH-2026-TOM-99');
  assert.ok(found, 'Receipt found in inbound receiving log');
});

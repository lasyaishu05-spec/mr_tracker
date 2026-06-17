const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

async function testApi() {
  const t1 = jwt.sign({ id: 1, email: 'lasya@gmail.com', role: 'MR' }, process.env.JWT_SECRET || 'secret');
  const t2 = jwt.sign({ id: 2, email: 'lasya4@gmail.com', role: 'MR' }, process.env.JWT_SECRET || 'secret');

  try {
    let res1 = await fetch('http://localhost:5001/api/followups', { headers: { 'Authorization': `Bearer ${t1}` } });
    let d1 = await res1.json();
    console.log("Followups returned for User 1 (lasya):", d1.data.map(f => f.visit.doctor.doctorName));

    let res2 = await fetch('http://localhost:5001/api/followups', { headers: { 'Authorization': `Bearer ${t2}` } });
    let d2 = await res2.json();
    console.log("Followups returned for User 2 (lasya4):", d2.data.map(f => f.visit.doctor.doctorName));

  } catch (e) {
    console.error(e);
  }
}

testApi();

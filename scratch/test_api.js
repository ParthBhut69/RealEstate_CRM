const axios = require('axios');
const FormData = require('form-data');

async function testTaskCreate() {
  const url = 'http://localhost:5000/api/tasks';
  
  console.log('--- Testing with JSON ---');
  try {
    const res = await axios.post(url, {
      title: 'Test Task JSON',
      due_date: new Date().toISOString(),
      status: 'Pending'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Failed (JSON):', err.response ? err.response.data : err.message);
  }

  console.log('\n--- Testing with FormData ---');
  try {
    const form = new FormData();
    form.append('title', 'Test Task FormData');
    form.append('due_date', new Date().toISOString());
    form.append('status', 'Pending');
    
    const res = await axios.post(url, form, {
      headers: form.getHeaders()
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Failed (FormData):', err.response ? err.response.data : err.message);
  }
}

testTaskCreate();

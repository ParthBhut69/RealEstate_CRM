const fetch = require('node-fetch');
const FormData = require('form-data');
(async () => {
  const form = new FormData();
  form.append('title', 'Test Property');
  form.append('description', 'Test description');
  form.append('price', '100');
  form.append('status', 'Available');
  form.append('building_name', 'Test Building');
  form.append('address', '123 Test St');
  form.append('location', 'BVI West');
  form.append('property_for', 'Buy');
  form.append('configuration', '1 BHK');
  form.append('carpet_area', '500');
  form.append('price_in_cr', '1.5');
  form.append('furnishing_status', 'Semi Furnished');
  form.append('parking_type', 'Covered Parking');
  form.append('oc_status', 'Yes');
  // images omitted

  try {
    const res = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
})();

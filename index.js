require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE 1: Get ALL citizens/complaints
app.get('/citizens', async (req, res) => {
  const { data, error } = await supabase.from('citizens').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ROUTE 2: Get ONE citizen/complaint by ID
app.get('/citizens/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('citizens')
    .select('*')
    .eq('citizen_id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Citizen not found' });
  res.json(data);
});

// ROUTE 3: Update ONE citizen/complaint (e.g. change complaint_status)
app.patch('/citizens/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('citizens')
    .update(req.body)
    .eq('citizen_id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/', (req, res) => {
  res.send('Grievance API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
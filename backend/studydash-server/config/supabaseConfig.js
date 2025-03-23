require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

let supabase;

const getDbInstance = () => {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log("successfully connected to supabase")
    }
    return supabase;
};

module.exports = getDbInstance;
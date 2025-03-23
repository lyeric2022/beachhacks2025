require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

let supabase;


const getDbInstance = () => {
    console.log(process.env.SUPABASE_URL)   
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log("successfully connected to supabase")
    }
    return supabase;
};

module.exports = getDbInstance;
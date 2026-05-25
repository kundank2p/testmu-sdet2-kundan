import * as dotenv from 'dotenv';
dotenv.config();

const Env = {
  UI_BASE_URL: process.env.UI_BASE_URL, 
  API_BASE_URL: process.env.API_BASE_URL, 
  ADMIN_USER:   process.env.ADMIN_USER,  
  ADMIN_PASS:   process.env.ADMIN_PASS,  
};

export default Env;
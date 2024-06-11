npm create vite@latest frontend -- --template react && cd frontend && npm install && npm run dev  

----------------------------------------------------------------------------------------------------------------
npm create vite@latest frontend -- --template react && \
cd frontend && \
npm install && \
npm install -D tailwindcss postcss autoprefixer && \
npx tailwindcss init -p && \
rm src/App.css && \
echo "function App() {
  return (
    <div className='text-3xl font-bold underline'>
      Hello world!
    </div>
  )
}
export default App" > src/App.jsx && \
echo "@tailwind base;
@tailwind components;
@tailwind utilities;" > src/index.css && \
cd .. && \
echo "/** @type {import('tailwindcss').Config} */
export default {
  content: [
    \"./index.html\",
    \"./src/**/*.{js,ts,jsx,tsx}\",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}" > frontend/tailwind.config.js && \
cd frontend && \
npm run dev   

----------------------------------------------------------------------------------------------------------------  
mkdir backend && \
cd backend && \
touch .env index.js app.js && \
npm init -y && \
npm i express && \
npm i -D nodemon && \
mkdir src && \
cd src && \
mkdir controllers db middleware models routes utils && \
cd ../..

-----------------------------------------------------------------------------------------------------------
PORT=8000  
MONGODB_URI=mongodb+srv://amjglobaliasoft:00salmankhan@cluster0.ugfdbfk.mongodb.net 
-----------------------------------------------------------------------------------------------------------
CLOUDINARY_CLOUD_NAME=du4jaiccf   
CLOUDINARY_API_KEY=865673722824947   
CLOUDINARY_API_SECRET=cmNiS3ef6GPzxRxhmH0IsUE9Crk   




 // أضف هذا المتغير في بداية الـ script
 const API_URL = 'https://api.sheetbest.com/sheets/26b70ef2-3e56-4e8f-aa38-291a01df03b3'; // ضع هنا الرابط الذي حصلت عليه من Sheet.best

 // دالة تسجيل الدخول
 function login() {
     const username = document.getElementById('username').value;
     const password = document.getElementById('password').value;
     
     // يمكنك تغيير بيانات الدخول هنا
     if (username === 'admin' && password === '2002') {
         document.getElementById('loginForm').style.display = 'none';
         document.getElementById('adminPanel').style.display = 'block';
         sessionStorage.setItem('isLoggedIn', 'true');
     } else {
         alert('بيانات الدخول غير صحيحة');
     }
 }

 // دالة تسجيل الخروج
 function logout() {
     sessionStorage.removeItem('isLoggedIn');
     document.getElementById('loginForm').style.display = 'block';
     document.getElementById('adminPanel').style.display = 'none';
 }

 // دالة معاينة الصورة
 function previewImage(url) {
     const preview = document.getElementById('imagePreview');
     preview.src = url;
     preview.style.display = 'block';
 }

 // دالة إضافة منتج جديد
 async function addProduct(event) {
     event.preventDefault();
     
     const submitBtn = event.target.querySelector('button[type="submit"]');
     submitBtn.disabled = true;
     submitBtn.textContent = 'جاري الإضافة...';
     
     const product = {
         id: Date.now().toString(),
         name: document.getElementById('productName').value,
         price: document.getElementById('productPrice').value,
         oldPrice: document.getElementById('oldPrice').value,
         image: document.getElementById('imageUrl').value
     };

     try {
         const response = await fetch(API_URL, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(product)
         });
         
         if (response.ok) {
             alert('تم إضافة المنتج بنجاح!');
             event.target.reset();
             document.getElementById('imagePreview').style.display = 'none';
             await displayProducts();
         } else {
             throw new Error('فشل في إضافة المنتج');
         }
     } catch (error) {
         console.error('Error:', error);
         alert('حدث خطأ في إضافة المنتج');
     } finally {
         submitBtn.disabled = false;
         submitBtn.textContent = 'إضافة المنتج';
     }
 }

 // دالة حذف منتج
 async function deleteProduct(id) {
     if(confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
         try {
             // نحصل على جميع المنتجات أولاً
             const response = await fetch(API_URL);
             const products = await response.json();
             
             // نجد المنتج المراد حذفه
             const productIndex = products.findIndex(p => p.id === id);
             if (productIndex > -1) {
                 // نحذف المنتج
                 await fetch(`${API_URL}/${productIndex}`, {
                     method: 'DELETE'
                 });
                 await displayProducts();
             }
         } catch (error) {
             console.error('Error:', error);
             alert('حدث خطأ في حذف المنتج');
         }
     }
 }

 // دالة عرض المنتجات
 async function displayProducts() {
     try {
         const response = await fetch(API_URL);
         const products = await response.json();
         
         const productsList = document.getElementById('productsList');
         
         productsList.innerHTML = products.map(product => `
             <div class="product-item">
                 <img src="${product.image}" class="preview-img" alt="${product.name}">
                 <div>
                     <h3>${product.name}</h3>
                     <p>السعر: ${product.price} ريال</p>
                 </div>
                 <button onclick="deleteProduct('${product.id}')" class="delete-btn">حذف</button>
             </div>
         `).join('');
     } catch (error) {
         console.error('Error:', error);
         alert('حدث خطأ في تحميل المنتجات');
     }
 }

 // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
 window.onload = function() {
     if (sessionStorage.getItem('isLoggedIn') === 'true') {
         document.getElementById('loginForm').style.display = 'none';
         document.getElementById('adminPanel').style.display = 'block';
         displayProducts();
     }
 }
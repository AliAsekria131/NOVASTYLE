const API_URL = 'https://api.sheetbest.com/sheets/26b70ef2-3e56-4e8f-aa38-291a01df03b3'; // نفس الرابط المستخدم في admin.html

    function openOrderForm(productName, price) {
        document.getElementById('orderModal').style.display = 'flex';
        document.getElementById('selectedProduct').textContent = 
            `المنتج: ${productName} - السعر: ${price} ريال`;
    }

    function closeOrderForm() {
        document.getElementById('orderModal').style.display = 'none';
    }

    function submitOrder(event) {
        event.preventDefault();
        
        // الحصول على عناصر الزر
        const submitBtn = document.getElementById('submitBtn');
        const spinner = submitBtn.querySelector('.spinner');
        const btnText = submitBtn.querySelector('.btn-text');
        
        // تعطيل الزر وإظهار التحميل
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        btnText.textContent = 'جاري إرسال الطلب...';
        
        // جمع بيانات النموذج
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const size = document.getElementById('size').value;
        const product = document.getElementById('selectedProduct').textContent;
        
        // معرف بوت التلغرام الخاص بك
        const botToken = '6992598038:AAEQnowJ16fzp_ATs4kbI6fiKcIg0Oi_Vx4';
        const chatId = '6266933954';
        
        // تجهيز نص الرسالة
        const message = `
🛍️ طلب جديد!
${product}
------------------
👤 الاسم: ${name}
📱 رقم الجوال: ${phone}
📍 العنوان: ${address}
📏 المقاس: ${size}
    `.trim();

        // إرسال الرسالة
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('فشل في إرسال الطلب');
            }
            return response.json();
        })
        .then(data => {
            alert('تم إرسال طلبك بنجاح!');
            closeOrderForm();
            document.getElementById('orderForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ في إرسال الطلب: ' + error.message);
        })
        .finally(() => {
            // إعادة تفعيل الزر وإخفاء التحميل
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.textContent = 'تأكيد الطلب';
        });
    }

    // إغلاق النموذج عند النقر خارج النموذج
    window.onclick = function(event) {
        if (event.target == document.getElementById('orderModal')) {
            closeOrderForm();
        }
    }

    // دالة لعرض المنتجات في الصفحة الرئيسية
    async function displayProducts() {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            
            const productsGrid = document.querySelector('.products-grid');
            
            productsGrid.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price-container">
                            <span class="new-price">${product.price} ريال</span>
                            <span class="old-price">${product.oldPrice} ريال</span>
                        </div>
                        <button class="order-btn" onclick="openOrderForm('${product.name}', '${product.price}')">اطلب الآن</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // عرض المنتجات عند تحمي�� الصفحة
    displayProducts();

    async function loadProducts() {
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
            const data = await response.json();
            
            const products = data.values.map(row => ({
                name: row[0],
                price: row[1],
                oldPrice: row[2],
                image: row[3]
            }));

            displayProducts(products);
        } catch (error) {
            console.error('Error:', error);
        }
    }